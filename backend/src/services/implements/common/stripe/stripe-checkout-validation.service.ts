import { inject, injectable } from "inversify";
import Stripe from "stripe";
import { Types } from "mongoose";
import { CustomError } from "../../../../utils/customError";
import { StatusCode } from "../../../../enums/statusCode.enum";
import { TYPES } from "../../../../types/types";
import { CURRENCY } from "../../../../constants/common/currency.constants";
import type { INutritionistPlanRepository } from "../../../../repositories/interfaces/nutritionist/INutriPlanRepository";
import type { INutritionistPlan } from "../../../../models/nutritionistPlan.model";
import type { IStripeCheckoutValidationService } from "../../../interfaces/common/stripe/IStripeCheckoutValidationService";
import type { StripeCheckoutData } from "../../../../dtos/common/stripe/stripe-checkout.dto";

@injectable()
export class StripeCheckoutValidationService implements IStripeCheckoutValidationService {
  constructor(
    @inject(TYPES.INutritionistPlanRepository)
    private readonly planRepository: INutritionistPlanRepository,
  ) {}

  async validate(
    session: Stripe.Checkout.Session,
  ): Promise<StripeCheckoutData> {
    const { userId, nutritionistId, planId } = session.metadata ?? {};

    this.validateMetadata(userId, nutritionistId, planId);
    this.validatePaymentDetails(session);

    const plan = await this.getAndValidatePlan(
      planId!,
      nutritionistId!,
      session.amount_total!,
    );

    const adminId = this.getAdminId();

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent!.id;

    return {
      userId: new Types.ObjectId(userId),
      nutritionistId: new Types.ObjectId(nutritionistId),
      planId: new Types.ObjectId(planId),
      plan,
      paymentIntentId,
      amountInPaise: session.amount_total!,
      adminId,
    };
  }

  private validateMetadata(
    userId?: string,
    nutritionistId?: string,
    planId?: string,
  ): asserts userId is string {
    if (!userId || !nutritionistId || !planId) {
      throw new CustomError(
        "Stripe checkout session metadata is incomplete.",
        StatusCode.BAD_REQUEST,
      );
    }

    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(nutritionistId) ||
      !Types.ObjectId.isValid(planId)
    ) {
      throw new CustomError(
        "Stripe checkout session contains invalid IDs.",
        StatusCode.BAD_REQUEST,
      );
    }
  }

  private validatePaymentDetails(session: Stripe.Checkout.Session): void {
    if (session.payment_status !== "paid") {
      throw new CustomError(
        "Stripe checkout session has not been paid.",
        StatusCode.BAD_REQUEST,
      );
    }

    if (
      !session.payment_intent ||
      session.amount_total === null ||
      session.amount_total === undefined ||
      session.amount_total <= 0 ||
      session.currency?.toLowerCase() !== CURRENCY.toLowerCase()
    ) {
      throw new CustomError(
        "Stripe payment details are invalid.",
        StatusCode.BAD_REQUEST,
      );
    }
  }

  private async getAndValidatePlan(
    planId: string,
    nutritionistId: string,
    amountInPaise: number,
  ): Promise<INutritionistPlan> {
    const plan = await this.planRepository.findById(planId);

    if (!plan) {
      throw new CustomError(
        "Nutritionist plan not found.",
        StatusCode.NOT_FOUND,
      );
    }

    if (plan.nutritionistId.toString() !== nutritionistId) {
      throw new CustomError(
        "Nutritionist does not own this plan.",
        StatusCode.FORBIDDEN,
      );
    }

    const expectedAmountInPaise = Math.round(plan.price * 100);

    if (expectedAmountInPaise !== amountInPaise) {
      throw new CustomError(
        "Stripe payment amount does not match the plan price.",
        StatusCode.BAD_REQUEST,
      );
    }

    return plan;
  }

  private getAdminId(): string {
    const adminId = process.env.ADMIN_ID;

    if (!adminId || !Types.ObjectId.isValid(adminId)) {
      throw new CustomError(
        "Admin wallet configuration is invalid.",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return adminId;
  }
}
