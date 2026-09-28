import mongoose, { Types } from "mongoose";
import Stripe from "stripe";
import { inject, injectable } from "inversify";

import logger from "../../../../utils/logger";
import { TYPES } from "../../../../types/types";

import { IStripeCheckoutHandlerService } from "../../../interfaces/common/stripe/IStripeCheckoutHandlerService";
import { IUserPlanRepository } from "../../../../repositories/interfaces/user/program/IUserPlanRepository";
import { IUserProgramRepository } from "../../../../repositories/interfaces/user/program/IUserProgramRepository";
import { IPaymentRepository } from "../../../../repositories/interfaces/common/IPaymentRepository";
import { IWalletRepository } from "../../../../repositories/interfaces/common/IWalletRepository";
import { INutritionistPlanRepository } from "../../../../repositories/interfaces/nutritionist/INutriPlanRepository";
import { IUserProgramProgressRepository } from "../../../../repositories/interfaces/user/tracking/IUserProgramProgressRepository";
import { IConversationService } from "../../../interfaces/chat/IConversationService";

import { CURRENCY } from "../../../../constants/currency.constants";

@injectable()
export class StripeCheckoutHandlerService implements IStripeCheckoutHandlerService {
  constructor(
    @inject(TYPES.IUserPlanRepository)
    private readonly _userPlanRepository: IUserPlanRepository,

    @inject(TYPES.IUserProgramRepository)
    private readonly _userProgramRepository: IUserProgramRepository,

    @inject(TYPES.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,

    @inject(TYPES.IWalletRepository)
    private readonly _walletRepository: IWalletRepository,

    @inject(TYPES.INutritionistPlanRepository)
    private readonly _planRepository: INutritionistPlanRepository,

    @inject(TYPES.IUserProgramProgressRepository)
    private readonly _userProgramProgressRepository: IUserProgramProgressRepository,

    @inject(TYPES.IConversationService)
    private readonly _conversationService: IConversationService,
  ) {}

  async handle(session: Stripe.Checkout.Session): Promise<void> {
    console.log("\n========== STRIPE CHECKOUT HANDLER ==========");
    console.log("Stripe session ID:", session.id);
    console.log("Stripe metadata:", session.metadata);

    if (
      !session.metadata?.userId ||
      !session.metadata?.planId ||
      !session.metadata?.nutritionistId
    ) {
      throw new Error("Stripe session metadata is missing.");
    }

    if (!session.payment_intent) {
      throw new Error("Stripe payment intent not found.");
    }

    console.log("User ID:", session.metadata.userId);
    console.log("Plan ID:", session.metadata.planId);
    console.log("Nutritionist ID:", session.metadata.nutritionistId);
    console.log("Payment Intent:", session.payment_intent);

    const alreadyProcessed =
      await this._paymentRepository.existsByCheckoutSessionId(session.id);

    console.log("Already processed:", alreadyProcessed);

    if (alreadyProcessed) {
      logger.warn("Duplicate Stripe webhook ignored.", {
        sessionId: session.id,
      });
      return;
    }

    const plan = await this._planRepository.findById(session.metadata.planId);

    if (!plan) {
      throw new Error("Nutritionist plan not found.");
    }

    console.log("\n========== PLAN ==========");
    console.log("Plan ID:", plan._id.toString());
    console.log("Plan title:", plan.title);
    console.log("Plan price:", plan.price);
    console.log("Plan currency:", plan.currency);

    const userId = new Types.ObjectId(session.metadata.userId);
    const nutritionistId = new Types.ObjectId(session.metadata.nutritionistId);
    const planId = new Types.ObjectId(session.metadata.planId);

    const dbSession = await mongoose.startSession();

    try {
      dbSession.startTransaction();

      console.log("\n========== TRANSACTION STARTED ==========");

      const latestPlan = await this._userPlanRepository.findLatestPlan(
        userId,
        nutritionistId,
      );

      console.log("\n========== LATEST USER PLAN ==========");
      console.log(
        "Latest plan:",
        latestPlan
          ? {
              id: latestPlan._id.toString(),
              status: latestPlan.subscriptionStatus,
              startDate: latestPlan.startDate,
              endDate: latestPlan.endDate,
            }
          : null,
      );

      let startDate = new Date();
      let subscriptionStatus: "active" | "pending" = "active";

      if (latestPlan?.endDate && latestPlan.endDate > new Date()) {
        startDate = new Date(latestPlan.endDate);
        startDate.setDate(startDate.getDate() + 1);
        subscriptionStatus = "pending";
      }

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + plan.durationDays);

      console.log("\n========== PLAN DATES ==========");
      console.log("Start date:", startDate);
      console.log("End date:", endDate);
      console.log("Subscription status:", subscriptionStatus);

      /*
       * =====================================================
       * USER PLAN
       * =====================================================
       */

      const userPlan = await this._userPlanRepository.createWithSession(
        {
          userId,
          nutritionistId,
          planId,

          paymentStatus: "paid",
          subscriptionStatus,

          amount: plan.price,
          currency: CURRENCY,

          payment: {
            provider: "stripe",
            sessionId: session.id,
            transactionId: session.payment_intent.toString(),
            completedAt: new Date(),
          },

          planSnapshot: {
            title: plan.title,
            description: plan.description,
            specialization: plan.specialization,
            durationDays: plan.durationDays,
            price: plan.price,
            currency: CURRENCY,
          },

          startDate,
          endDate,
        },
        dbSession,
      );

      console.log("\n========== USER PLAN CREATED ==========");
      console.log("UserPlan ID:", userPlan._id.toString());
      console.log("UserPlan status:", userPlan.subscriptionStatus);
      console.log("UserPlan payment status:", userPlan.paymentStatus);
      console.log("UserPlan currency:", userPlan.currency);

      /*
       * =====================================================
       * USER PROGRAM
       * =====================================================
       */

      const userProgram = await this._userProgramRepository.createWithSession(
        {
          userId,
          nutritionistId,
          userPlanId: userPlan._id,
          planId,

          startDate,
          endDate,

          durationDays: plan.durationDays,

          status: subscriptionStatus === "active" ? "active" : "upcoming",
        },
        dbSession,
      );

      console.log("\n========== USER PROGRAM CREATED ==========");
      console.log("UserProgram ID:", userProgram._id.toString());
      console.log("UserProgram status:", userProgram.status);

      /*
       * =====================================================
       * USER PROGRAM PROGRESS
       * =====================================================
       */

      const userProgramProgress =
        await this._userProgramProgressRepository.createWithSession(
          {
            userId,
            userProgramId: userProgram._id,
            totalDays: plan.durationDays,
          },
          dbSession,
        );

      console.log("\n========== USER PROGRAM PROGRESS CREATED ==========");
      console.log("Progress ID:", userProgramProgress._id.toString());

      /*
       * =====================================================
       * CONVERSATION
       * =====================================================
       */

      console.log("\n========== CREATING COACHING CONVERSATION ==========");
      console.log("Current user:", userId.toString());
      console.log("Nutritionist:", nutritionistId.toString());

      const conversation =
        await this._conversationService.createDirectConversationWithSession(
          {
            currentUserId: userId.toString(),
            otherUserId: nutritionistId.toString(),
          },
          dbSession,
        );

      console.log("\n========== CONVERSATION CREATED ==========");
      console.log("Conversation ID:", conversation.id.toString());

      /*
       * =====================================================
       * PAYMENT
       * =====================================================
       */

      const payment = await this._paymentRepository.createWithSession(
        {
          userId,
          sellerId: nutritionistId,

          resourceType: "nutritionist_plan",
          resourceId: planId,

          provider: "stripe",
          status: "paid",

          amount: plan.price,
          currency: CURRENCY,

          checkoutSessionId: session.id,
          paymentIntentId: session.payment_intent.toString(),

          itemSnapshot: {
            title: plan.title,
            price: plan.price,
            currency: CURRENCY,
          },

          metadata: {
            userPlanId: userPlan._id.toString(),
          },
        },
        dbSession,
      );

      console.log("\n========== PAYMENT CREATED ==========");
      console.log("Payment ID:", payment._id.toString());

      /*
       * =====================================================
       * ADMIN WALLET
       * =====================================================
       */

      const adminWallet = await this._walletRepository.findOrCreate(
        process.env.ADMIN_ID!,
        "admin",
        dbSession,
      );

      console.log("\n========== ADMIN WALLET ==========");
      console.log("Admin wallet ID:", adminWallet._id.toString());
      console.log("Balance before escrow:", adminWallet.availableBalance);
      console.log("Escrow before:", adminWallet.escrowBalance);

      await this._walletRepository.creditEscrow(
        adminWallet._id.toString(),
        plan.price,
        dbSession,
      );

      console.log("Escrow credited:", plan.price);

      /*
       * =====================================================
       * COMMIT
       * =====================================================
       */

      await dbSession.commitTransaction();

      console.log("\n========== TRANSACTION COMMITTED ==========");
      console.log("Stripe checkout processed successfully:", session.id);

      logger.info("Stripe checkout processed successfully.", {
        checkoutSessionId: session.id,
      });
    } catch (error) {
      console.log("\n========== TRANSACTION FAILED ==========");
      console.log(error);

      await dbSession.abortTransaction();

      console.log("Transaction aborted.");

      logger.error("Stripe checkout processing failed.", error);

      throw error;
    } finally {
      await dbSession.endSession();

      console.log("MongoDB session ended.");
      console.log("==========================================\n");
    }
  }
}
