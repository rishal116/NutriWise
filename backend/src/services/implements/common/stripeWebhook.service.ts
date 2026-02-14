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
    private _paymentRepo: IPaymentRepository
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
    const ADMIN_COMMISSION_PERCENT = 20;

    const adminAmount = Math.round(
      (totalAmount * ADMIN_COMMISSION_PERCENT) / 100
    );
    const nutritionistAmount = totalAmount - adminAmount;

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
      currency: plan.currency,
      type: "PLAN_PURCHASE",
      stripeSessionId: session.id,
    });

    await this._paymentRepo.create({
      userId: userObjectId,
      nutritionistId: nutritionistObjectId,
      amount: adminAmount,
      currency: plan.currency,
      type: "ADMIN_COMMISSION",
      stripeSessionId: session.id,
    });

    await this._paymentRepo.create({
      userId: userObjectId,
      nutritionistId: nutritionistObjectId,
      amount: nutritionistAmount,
      currency: plan.currency,
      type: "NUTRITIONIST_EARNING",
      stripeSessionId: session.id,
    });


    await this._walletRepo.credit(adminWallet._id.toString(), adminAmount);
    await this._walletRepo.credit(
      nutritionistWallet._id.toString(),
      nutritionistAmount
    );

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationInDays);

    await this._userPlanRepo.create({
      userId: userObjectId,
      planId: planObjectId,
      nutritionistId: nutritionistObjectId,
      stripeSessionId: session.id,
      amount: totalAmount,
      currency: plan.currency,
      status: "ACTIVE",
      startDate,
      endDate,
    });

    console.log("✅ Stripe payment processed successfully");
  }
}
