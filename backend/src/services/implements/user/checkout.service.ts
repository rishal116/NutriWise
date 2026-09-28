import { ICheckoutService } from "../../interfaces/user/ICheckoutService";
import { IStripeService } from "../../interfaces/common/stripe/IStripeService";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { CreateCheckoutSessionDTO } from "../../../dtos/user/checkout/create-checkout-session.dto";
import { CheckoutStatusResponseDTO } from "../../../dtos/user/checkout/checkout-status-response.dto";
import { CheckoutStripeMapper } from "../../../mappers/user/checkout/checkout-stripe.mapper";
import { INutritionistPlanRepository } from "../../../repositories/interfaces/nutritionist/INutriPlanRepository";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { IUserRepository } from "../../../repositories/interfaces/user/account/IUserRepository";
import { IPaymentRepository } from "../../../repositories/interfaces/common/IPaymentRepository";

@injectable()
export class CheckoutService implements ICheckoutService {
  constructor(
    @inject(TYPES.IStripeService)
    private readonly _stripeService: IStripeService,

    @inject(TYPES.INutritionistPlanRepository)
    private readonly _nutritionistPlanRepository: INutritionistPlanRepository,

    @inject(TYPES.IUserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TYPES.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,
  ) {}

  async createCheckoutSession(dto: CreateCheckoutSessionDTO): Promise<string> {
    const plan = await this._nutritionistPlanRepository.findById(dto.planId);

    if (!plan) {
      throw new CustomError("Plan not found.", StatusCode.NOT_FOUND);
    }

    const nutritionistUser = await this._userRepository.findById(
      plan.nutritionistId.toString(),
    );

    if (!nutritionistUser) {
      throw new CustomError("Nutritionist not found.", StatusCode.NOT_FOUND);
    }
    const stripeCheckoutInput = CheckoutStripeMapper.toStripeInput(
      plan,
      dto.userId,
    );
    return this._stripeService.createCheckoutSession(stripeCheckoutInput);
  }

  async getCheckoutStatus(
    sessionId: string,
    userId: string,
  ): Promise<CheckoutStatusResponseDTO> {
    if (!sessionId) {
      throw new CustomError("Session ID is required.", StatusCode.BAD_REQUEST);
    }

    const payment =
      await this._paymentRepository.findByCheckoutSessionId(sessionId);

    if (payment) {
      if (payment.userId.toString() !== userId) {
        throw new CustomError(
          "Unauthorized access to checkout session.",
          StatusCode.FORBIDDEN,
        );
      }

      if (payment.status === "paid") {
        return {
          status: "completed",
          sessionId,
          amount: payment.amount,
          currency: payment.currency,
          itemTitle: payment.itemSnapshot?.title,
          message: "Payment confirmed and purchase fulfilled successfully.",
        };
      }
    }

    try {
      const session =
        await this._stripeService.retrieveCheckoutSession(sessionId);

      if (session.metadata?.userId && session.metadata.userId !== userId) {
        throw new CustomError(
          "Unauthorized access to checkout session.",
          StatusCode.FORBIDDEN,
        );
      }

      if (session.payment_status === "paid" || session.status === "complete") {
        return {
          status: "pending",
          sessionId,
          message:
            "Payment received by Stripe. Waiting for system fulfillment.",
        };
      }

      if (session.status === "expired") {
        return {
          status: "failed",
          sessionId,
          message: "Stripe checkout session has expired.",
        };
      }

      return {
        status: "pending",
        sessionId,
        message: "Payment is processing.",
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw new CustomError(
        "Unable to verify Stripe checkout session.",
        StatusCode.NOT_FOUND,
      );
    }
  }
}

