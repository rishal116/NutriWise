import mongoose, { Types } from "mongoose";
import Stripe from "stripe";
import { inject, injectable } from "inversify";

import logger from "../../../../utils/logger";
import { TYPES } from "../../../../types/types";

import { IStripeCheckoutHandlerService } from "../../../interfaces/common/stripe/IStripeCheckoutHandlerService";

import { IUserPlanRepository } from "../../../../repositories/interfaces/user/IUserPlanRepository";
import { IUserProgramRepository } from "../../../../repositories/interfaces/user/IUserProgramRepository";
import { IPaymentRepository } from "../../../../repositories/interfaces/common/IPaymentRepository";
import { IWalletRepository } from "../../../../repositories/interfaces/common/IWalletRepository";
import { INutritionistPlanRepository } from "../../../../repositories/interfaces/nutritionist/INutriPlanRepository";

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
  ) {}

  async handle(session: Stripe.Checkout.Session): Promise<void> {
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

    const alreadyProcessed =
      await this._paymentRepository.existsByCheckoutSessionId(session.id);

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

    const userId = new Types.ObjectId(session.metadata.userId);
    const nutritionistId = new Types.ObjectId(session.metadata.nutritionistId);
    const planId = new Types.ObjectId(session.metadata.planId);

    const dbSession = await mongoose.startSession();

    try {
      dbSession.startTransaction();

      const latestPlan = await this._userPlanRepository.findLatestPlan(
        userId,
        nutritionistId,
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

      const userPlan = await this._userPlanRepository.createWithSession(
        {
          userId,
          nutritionistId,
          planId,

          paymentStatus: "paid",
          subscriptionStatus,

          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: session.payment_intent.toString(),

          amount: plan.price,
          currency: plan.currency,

          planSnapshot: {
            title: plan.title,
            durationDays: plan.durationDays,
            price: plan.price,
            currency: plan.currency,
          },

          startDate,
          endDate,

          paymentCompletedAt: new Date(),
        },
        dbSession,
      );

      const userProgram = await this._userProgramRepository.createWithSession(
        {
          userId,
          nutritionistId,
          userPlanId: userPlan._id,
          planId,

          startDate,
          endDate,

          durationDays: plan.durationDays,

          currentDay: 1,
          completionPercentage: 0,

          status: subscriptionStatus === "active" ? "active" : "upcoming",
        },
        dbSession,
      );

      await this._paymentRepository.createWithSession(
        {
          userId,
          sellerId: nutritionistId,

          resourceType: "nutritionist_plan",
          resourceId: planId,

          provider: "stripe",
          status: "paid",

          amount: plan.price,
          currency: plan.currency,

          checkoutSessionId: session.id,
          paymentIntentId: session.payment_intent.toString(),

          itemSnapshot: {
            title: plan.title,
            price: plan.price,
            currency: plan.currency,
          },

          metadata: {
            userPlanId: userPlan._id.toString(),
          },
        },
        dbSession,
      );

      const adminWallet = await this._walletRepository.findOrCreate(
        process.env.ADMIN_ID!,
        "admin",
        dbSession,
      );

      await this._walletRepository.creditEscrow(
        adminWallet._id.toString(),
        plan.price,
        dbSession,
      );

      await this._userPlanRepository.updateById(userPlan._id.toString(), {
        userProgramId: userProgram._id,
      });

      await dbSession.commitTransaction();

      logger.info("Stripe checkout processed successfully.", {
        checkoutSessionId: session.id,
      });
    } catch (error) {
      await dbSession.abortTransaction();

      logger.error("Stripe checkout processing failed.", error);

      throw error;
    } finally {
      await dbSession.endSession();
    }
  }
}
