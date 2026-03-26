import Stripe from "stripe";
import mongoose, { Types } from "mongoose";
import { injectable, inject } from "inversify";
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
import logger from "../../../utils/logger";

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
    private _healthDetails: IHealthDetailsRepository,
  ) {}

  async process(payload: Buffer, signature: string) {
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      logger.error("❌ Stripe webhook signature verification failed", err);
      throw new Error("Invalid webhook signature");
    }

    if (event.type !== "checkout.session.completed") return;

    const session = event.data.object as Stripe.Checkout.Session;

    if (
      !session.metadata?.userId ||
      !session.metadata?.planId ||
      !session.metadata?.nutritionistId
    ) {
      throw new Error("Missing metadata in Stripe session");
    }

    if (!session.payment_intent) {
      throw new Error("Missing payment intent");
    }

    const { userId, planId, nutritionistId } = session.metadata;

    const alreadyProcessed = await this._paymentRepo.existsBySessionId(
      session.id,
    );
    if (alreadyProcessed) {
      logger.warn("⚠️ Duplicate webhook ignored", { sessionId: session.id });
      return;
    }

    const plan = await this._planRepo.findById(planId);
    if (!plan) throw new Error("Plan not found");

    const totalAmount = plan.price;
    const { adminAmount, nutritionistAmount } =
      calculateCommission(totalAmount);

    const userObjectId = new Types.ObjectId(userId);
    const planObjectId = new Types.ObjectId(planId);
    const nutritionistObjectId = new Types.ObjectId(nutritionistId);

    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
      const latestPlan = await this._userPlanRepo.findLatestPlan(
        userObjectId,
        nutritionistObjectId,
      );

      let startDate = new Date();
      let status: "ACTIVE" | "UPCOMING" = "ACTIVE";
      if (latestPlan && latestPlan.endDate && latestPlan.endDate > new Date()) {
        startDate = new Date(latestPlan.endDate);
        startDate.setDate(startDate.getDate() + 1);
        status = "UPCOMING";
      }
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + plan.durationInDays);

      const planSnapshot = {
        title: plan.title,
        durationInDays: plan.durationInDays,
        price: plan.price,
        currency: plan.currency ?? "INR",
      };

      const userPlan = await this._userPlanRepo.create(
        {
          userId: userObjectId,
          planId: planObjectId,
          nutritionistId: nutritionistObjectId,
          paymentProvider: "stripe",
          paymentId: session.payment_intent.toString(),
          checkoutSessionId: session.id,
          paymentStatus: "paid",
          amount: totalAmount,
          currency: planSnapshot.currency,
          planSnapshot,
          status, 
          pendingPayout: nutritionistAmount,
          isPayoutDone: false,
          adminCommission: adminAmount,
          startDate,
          endDate,
        },
        dbSession,
      );

      const healthProfile = await this._healthDetails.findByUserId(userId);
      await this._userProgram.create(
        {
          userId: userObjectId,
          planId: planObjectId,
          userPlanId: userPlan._id,
          nutritionistId: nutritionistObjectId,
          goal: healthProfile?.goal ?? "general_wellness",
          dietType: healthProfile?.dietType,
          activityLevel: healthProfile?.activityLevel,
          focusAreas: healthProfile?.focusAreas,
          startDate,
          endDate,
          durationDays: plan.durationInDays,
          currentDay: 1,
          completionPercentage: 0,
          status: status === "ACTIVE" ? "ACTIVE" : "UPCOMING",
          planSnapshot,
        },
        dbSession,
      );

      await this._paymentRepo.create(
        {
          userId: userObjectId,
          planId: planObjectId,
          nutritionistId: nutritionistObjectId,
          amount: totalAmount,
          type: "PLAN_PURCHASE",
          status: "SUCCESS",
          currency: "INR",
          stripeSessionId: session.id,
        },
        dbSession,
      );

      await this._paymentRepo.create(
        {
          userId: userObjectId,
          nutritionistId: nutritionistObjectId,
          amount: adminAmount,
          type: "ADMIN_COMMISSION",
          status: "SUCCESS",
          currency: "INR",
          stripeSessionId: session.id,
        },
        dbSession,
      );

      await this._paymentRepo.create(
        {
          userId: userObjectId,
          nutritionistId: nutritionistObjectId,
          amount: nutritionistAmount,
          type: "NUTRITIONIST_EARNING",
          status: "PENDING",
          currency: "INR",
          stripeSessionId: session.id,
        },
        dbSession,
      );

      const adminWallet = await this._walletRepo.findOrCreate(
        process.env.ADMIN_ID!,
        "ADMIN",
        dbSession,
      );

      await this._walletRepo.creditEscrow(
        adminWallet._id.toString(),
        totalAmount,
        dbSession,
      );
      await dbSession.commitTransaction();
      logger.info("✅ Stripe payment processed successfully", {
        sessionId: session.id,
      });
    } catch (err) {
      await dbSession.abortTransaction();
      logger.error("❌ Stripe webhook failed", err);
      throw err;
    } finally {
      dbSession.endSession();
    }
  }
}
