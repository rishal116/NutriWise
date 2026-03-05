import Stripe from "stripe";
import { injectable, inject } from "inversify";
import { Types } from "mongoose";
import { stripe } from "../../../configs/stripe";
import { IStripeWebhookService } from "../../interfaces/common/IStripeWebhookService";
import { TYPES } from "../../../types/types";
import { IUserPlanRepository } from "../../../repositories/interfaces/user/IUserPlanRepository";
import { INutritionistPlanRepository } from "../../../repositories/interfaces/nutritionist/INutritionistPlanRepository";
import { IWalletRepository } from "../../../repositories/interfaces/common/IWalletRepository";
import { IPaymentRepository } from "../../../repositories/interfaces/common/IPaymentRepository";
import { calculateCommission } from "../../../helper/paymentCalculator";
import { IUserProgramRepository } from "../../../repositories/interfaces/user/IUserProgramRepository";
import { IHealthDetailsRepository } from "../../../repositories/interfaces/user/IHealthDetailsRepository";

@injectable()
export class StripeWebhookService implements IStripeWebhookService {
  constructor(
    @inject(TYPES.IUserPlanRepository)
    private _userPlanRepo: IUserPlanRepository,

    @inject(TYPES.INutritionistPlanRepository)
    private _planRepo: INutritionistPlanRepository,

    @inject(TYPES.IWalletRepository)
    private _walletRepo: IWalletRepository,

    @inject(TYPES.IPaymentRepository)
    private _paymentRepo: IPaymentRepository,

    @inject(TYPES.IUserProgramRepository)
    private _userProgram: IUserProgramRepository,

    @inject(TYPES.IHealthDetailsRepository)
    private _healthDetails: IHealthDetailsRepository

  ) {}

  async process(payload: Buffer, signature: string) {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type !== "checkout.session.completed") return;

    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, planId, nutritionistId } = session.metadata!;


    const alreadyProcessed =
      await this._paymentRepo.existsBySessionId(session.id);
    if (alreadyProcessed) return;


    const plan = await this._planRepo.findById(planId);
    if (!plan) throw new Error("Plan not found");

  const totalAmount = plan.price;
  
  const { adminAmount, nutritionistAmount } = calculateCommission(totalAmount);

    const userObjectId = new Types.ObjectId(userId);
    const planObjectId = new Types.ObjectId(planId);
    const nutritionistObjectId = new Types.ObjectId(nutritionistId);

  
    const adminWallet = await this._walletRepo.findOrCreate(
      process.env.ADMIN_ID!,
      "ADMIN"
    );

    const nutritionistWallet = await this._walletRepo.findOrCreate(
      nutritionistId,
      "NUTRITIONIST"
    );


    await this._paymentRepo.create({
      userId: userObjectId,
      planId: planObjectId,
      nutritionistId: nutritionistObjectId,
      amount: totalAmount,
      type: "PLAN_PURCHASE",
      stripeSessionId: session.id,
    });

    await this._paymentRepo.create({
      userId: userObjectId,
      nutritionistId: nutritionistObjectId,
      amount: adminAmount,
      type: "ADMIN_COMMISSION",
      stripeSessionId: session.id,
    });

    await this._paymentRepo.create({
      userId: userObjectId,
      nutritionistId: nutritionistObjectId,
      amount: nutritionistAmount,
      type: "NUTRITIONIST_EARNING",
      stripeSessionId: session.id,
    });


  await Promise.all([
    this._walletRepo.credit(adminWallet._id.toString(), adminAmount),
    this._walletRepo.credit(
      nutritionistWallet._id.toString(),
      nutritionistAmount
    ),
  ]);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationInDays);

    const planSnapshot = {
      title: plan.title,
      durationInDays: plan.durationInDays,
      price: plan.price,
      currency: plan.currency ?? "INR",
    };
    const paymentId = session.payment_intent as string;

  const userPlan = await this._userPlanRepo.create({
    userId: userObjectId,
    planId: planObjectId,
    nutritionistId: nutritionistObjectId,
    paymentProvider: "stripe",
    paymentId: paymentId,
    checkoutSessionId: session.id,
    paymentStatus: "paid",
    amount: totalAmount,
    currency: planSnapshot.currency,
    planSnapshot,
    status: "ACTIVE",
    startDate,
    endDate,
  });

  const healthProfile = await this._healthDetails.findByUserId(userId);

  await this._userProgram.create({
  userId: userObjectId,
  planId: planObjectId,
  userPlanId: userPlan._id,
  nutritionistId: nutritionistObjectId,

  goal: healthProfile?.goal,
  dietType: healthProfile?.dietType,
  activityLevel: healthProfile?.activityLevel,
  focusAreas: healthProfile?.focusAreas,

  startDate,
  endDate,
  durationDays: plan.durationInDays,
  currentDay: 1,
  completionPercentage: 0,
  status: "ACTIVE",

  planSnapshot: {
    title: plan.title,
    price: plan.price,
    currency: plan.currency ?? "INR",
    durationInDays: plan.durationInDays,
  },
});

    console.log("✅ Stripe payment processed successfully");
  }
}
