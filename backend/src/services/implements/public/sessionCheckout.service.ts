import { inject, injectable } from "inversify";

import { Types } from "mongoose";

import { TYPES } from "../../../types/types";

import { ISessionCheckoutService } from "../../interfaces/public/ISessionCheckoutService";

import { IStripeService } from "../../interfaces/common/stripe/IStripeService";

import { ISessionRepository } from "../../../repositories/interfaces/public/ISessionRepository";

import { CreateSessionCheckoutDTO } from "../../../dtos/public/session-registration/create-session-checkout.dto";

import { SessionCheckoutStripeMapper } from "../../../mapper/public/session-registration/session-checkout-stripe.mapper";

import { CustomError } from "../../../utils/customError";

import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class SessionCheckoutService implements ISessionCheckoutService {
  constructor(
    @inject(TYPES.IStripeService)
    private readonly _stripeService: IStripeService,

    @inject(TYPES.ISessionRepository)
    private readonly _sessionRepository: ISessionRepository,
  ) {}

  async createCheckoutSession(dto: CreateSessionCheckoutDTO): Promise<string> {
    if (!Types.ObjectId.isValid(dto.userId)) {
      throw new CustomError("Invalid user ID", StatusCode.BAD_REQUEST);
    }

    if (!Types.ObjectId.isValid(dto.sessionId)) {
      throw new CustomError("Invalid session ID", StatusCode.BAD_REQUEST);
    }

    const session = await this._sessionRepository.findById(
      new Types.ObjectId(dto.sessionId),
    );

    if (!session) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }

    if (session.status !== "scheduled" && session.status !== "live") {
      throw new CustomError(
        "Session is not available for registration",
        StatusCode.BAD_REQUEST,
      );
    }

    if (session.pricing.type !== "paid") {
      throw new CustomError(
        "This session does not require payment",
        StatusCode.BAD_REQUEST,
      );
    }

    const stripeCheckoutInput = SessionCheckoutStripeMapper.toStripeInput(
      session,
      dto.userId,
    );

    return this._stripeService.createCheckoutSession(stripeCheckoutInput);
  }
}
