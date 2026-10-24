import mongoose, { Types } from "mongoose";
import Stripe from "stripe";
import { inject, injectable } from "inversify";

import logger from "../../../../utils/logger";
import { CustomError } from "../../../../utils/customError";
import { StatusCode } from "../../../../enums/statusCode.enum";
import { TYPES } from "../../../../types/types";
import { CURRENCY } from "../../../../constants/currency.constants";

import { IStripeCheckoutHandlerService } from "../../../interfaces/common/stripe/IStripeCheckoutHandlerService";
import { IUserPlanRepository } from "../../../../repositories/interfaces/user/program/IUserPlanRepository";
import { IUserProgramRepository } from "../../../../repositories/interfaces/user/program/IUserProgramRepository";
import { IPaymentRepository } from "../../../../repositories/interfaces/common/IPaymentRepository";
import { IWalletRepository } from "../../../../repositories/interfaces/common/IWalletRepository";
import { INutritionistPlanRepository } from "../../../../repositories/interfaces/nutritionist/INutriPlanRepository";
import { IUserProgramProgressRepository } from "../../../../repositories/interfaces/user/tracking/IUserProgramProgressRepository";
import { IConversationService } from "../../../interfaces/chat/IConversationService";

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
    const userIdValue = session.metadata?.userId;
    const nutritionistIdValue = session.metadata?.nutritionistId;
    const planIdValue = session.metadata?.planId;

    if (!userIdValue || !nutritionistIdValue || !planIdValue) {
      throw new CustomError(
        "Stripe checkout session metadata is incomplete.",
        StatusCode.BAD_REQUEST,
      );
    }

    if (
      !Types.ObjectId.isValid(userIdValue) ||
      !Types.ObjectId.isValid(nutritionistIdValue) ||
      !Types.ObjectId.isValid(planIdValue)
    ) {
      throw new CustomError(
        "Stripe checkout session contains invalid IDs.",
        StatusCode.BAD_REQUEST,
      );
    }

    if (session.payment_status !== "paid") {
      throw new CustomError(
        "Stripe checkout session has not been paid.",
        StatusCode.BAD_REQUEST,
      );
    }

    if (!session.payment_intent) {
      throw new CustomError(
        "Stripe payment intent not found.",
        StatusCode.BAD_REQUEST,
      );
    }

    if (
      session.amount_total === null ||
      session.amount_total === undefined ||
      session.currency?.toUpperCase() !== CURRENCY
    ) {
      throw new CustomError(
        "Stripe payment amount or currency is invalid.",
        StatusCode.BAD_REQUEST,
      );
    }

    const alreadyProcessed =
      await this._paymentRepository.existsByCheckoutSessionId(session.id);

    if (alreadyProcessed) {
      logger.warn("Duplicate Stripe checkout webhook ignored.", {
        checkoutSessionId: session.id,
      });
      return;
    }

    const plan = await this._planRepository.findById(planIdValue);

    if (!plan) {
      throw new CustomError(
        "Nutritionist plan not found.",
        StatusCode.NOT_FOUND,
      );
    }

    if (plan.price * 100 !== session.amount_total) {
      throw new CustomError(
        "Stripe payment amount does not match the plan price.",
        StatusCode.BAD_REQUEST,
      );
    }

    if (plan.nutritionistId.toString() !== nutritionistIdValue) {
      throw new CustomError(
        "Nutritionist does not own this plan.",
        StatusCode.FORBIDDEN,
      );
    }

    const adminId = process.env.ADMIN_ID;

    if (!adminId || !Types.ObjectId.isValid(adminId)) {
      throw new CustomError(
        "Admin wallet configuration is invalid.",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const userId = new Types.ObjectId(userIdValue);
    const nutritionistId = new Types.ObjectId(nutritionistIdValue);
    const planId = new Types.ObjectId(planIdValue);

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent.id;

    const amount = session.amount_total / 100;
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.durationDays);

    const dbSession = await mongoose.startSession();

    try {
      dbSession.startTransaction();

      const duplicatePayment =
        await this._paymentRepository.existsByCheckoutSessionId(session.id);

      if (duplicatePayment) {
        await dbSession.abortTransaction();

        logger.warn("Duplicate Stripe checkout webhook ignored.", {
          checkoutSessionId: session.id,
        });
        return;
      }

      const userPlan = await this._userPlanRepository.createWithSession(
        {
          userId,
          nutritionistId,
          planId,
          amount,
          currency: CURRENCY,
          planSnapshot: {
            title: plan.title,
            description: plan.description,
            specialization: plan.specialization,
            durationDays: plan.durationDays,
            price: plan.price,
            currency: CURRENCY,
          },
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
          status: "active",
        },
        dbSession,
      );

      await this._userProgramProgressRepository.createWithSession(
        {
          userId,
          userProgramId: userProgram._id,
          totalDays: plan.durationDays,
        },
        dbSession,
      );

      await this._conversationService.createDirectConversation(
        {
          currentUserId: userId.toString(),
          otherUserId: nutritionistId.toString(),
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
          amount,
          currency: CURRENCY,
          checkoutSessionId: session.id,
          paymentIntentId,
          itemSnapshot: {
            title: plan.title,
            price: amount,
            currency: CURRENCY,
          },
        },
        dbSession,
      );

      const adminWallet = await this._walletRepository.findOrCreate(
        adminId,
        "admin",
        dbSession,
      );

      await this._walletRepository.creditEscrow(
        adminWallet._id.toString(),
        amount,
        dbSession,
      );

      await dbSession.commitTransaction();

      logger.info("Stripe checkout processed successfully.", {
        checkoutSessionId: session.id,
        userPlanId: userPlan._id.toString(),
        userProgramId: userProgram._id.toString(),
      });
    } catch (error) {
      if (dbSession.inTransaction()) {
        await dbSession.abortTransaction();
      }

      logger.error("Stripe checkout processing failed.", {
        checkoutSessionId: session.id,
        error,
      });

      throw error;
    } finally {
      await dbSession.endSession();
    }
  }
}
