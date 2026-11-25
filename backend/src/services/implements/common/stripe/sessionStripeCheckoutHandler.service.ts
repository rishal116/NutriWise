import mongoose, { Types } from "mongoose";
import type Stripe from "stripe";
import { inject, injectable } from "inversify";

import logger from "../../../../utils/logger";
import { TYPES } from "../../../../types/types";
import { CustomError } from "../../../../utils/customError";
import { StatusCode } from "../../../../enums/statusCode.enum";

import type { IStripeCheckoutEventHandler } from "../../../interfaces/common/stripe/IStripeCheckoutEventHandler";
import type { IPublicSessionRepository } from "../../../../repositories/interfaces/public/IPublicSessionRepository";
import type { ISessionRegistrationRepository } from "../../../../repositories/interfaces/public/ISessionRegistrationRepository";
import type { IPaymentRepository } from "../../../../repositories/interfaces/common/IPaymentRepository";
import type { IWalletRepository } from "../../../../repositories/interfaces/common/IWalletRepository";
import type { ISessionRegistration } from "../../../../models/sessionRegistration.model";

@injectable()
export class SessionStripeCheckoutHandlerService implements IStripeCheckoutEventHandler {
  readonly paymentType = "session_registration" as const;

  constructor(
    @inject(TYPES.IPublicSessionRepository)
    private readonly _sessionRepository: IPublicSessionRepository,

    @inject(TYPES.ISessionRegistrationRepository)
    private readonly _sessionRegistrationRepository: ISessionRegistrationRepository,

    @inject(TYPES.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,

    @inject(TYPES.IWalletRepository)
    private readonly _walletRepository: IWalletRepository,
  ) {}

  async handle(stripeSession: Stripe.Checkout.Session): Promise<void> {
    if (stripeSession.metadata?.paymentType !== this.paymentType) {
      return;
    }

    const { userId, sessionId } = this.validateMetadata(stripeSession);
    const paymentIntentId = this.getPaymentIntentId(stripeSession);

    // Fast idempotency check.
    const existingPayment =
      await this._paymentRepository.findByCheckoutSessionId(stripeSession.id);

    if (existingPayment) {
      logger.info("Duplicate session Stripe webhook ignored.", {
        checkoutSessionId: stripeSession.id,
      });
      return;
    }

    const adminId = process.env.ADMIN_ID;

    if (!adminId || !Types.ObjectId.isValid(adminId)) {
      throw new CustomError(
        "Admin wallet configuration is invalid.",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const userObjectId = new Types.ObjectId(userId);
    const sessionObjectId = new Types.ObjectId(sessionId);
    const dbSession = await mongoose.startSession();

    try {
      dbSession.startTransaction();

      // Recheck idempotency inside the transaction.
      const paymentAlreadyProcessed =
        await this._paymentRepository.existsByCheckoutSessionId(
          stripeSession.id,
          dbSession,
        );

      if (paymentAlreadyProcessed) {
        await dbSession.abortTransaction();

        logger.info("Duplicate session Stripe webhook ignored.", {
          checkoutSessionId: stripeSession.id,
        });
        return;
      }

      const sessionData = await this._sessionRepository.findById(
        sessionObjectId,
        dbSession,
      );

      if (!sessionData) {
        throw new CustomError("Session not found.", StatusCode.NOT_FOUND);
      }

      this.validateSessionAndPayment(sessionData, stripeSession);

      const existingRegistration =
        await this._sessionRegistrationRepository.findBySessionAndUser(
          sessionObjectId,
          userObjectId,
          dbSession,
        );

      this.validateExistingRegistration(existingRegistration);

      // Check capacity for both new and cancelled registrations.
      const participantCount =
        await this._sessionRegistrationRepository.countActiveRegistrations(
          sessionObjectId,
          dbSession,
        );

      if (participantCount >= sessionData.maxParticipants) {
        throw new CustomError(
          "Session has reached its maximum participant capacity.",
          StatusCode.CONFLICT,
        );
      }

      const registration = await this.createOrRestoreRegistration(
        existingRegistration,
        sessionObjectId,
        userObjectId,
        dbSession,
      );

      const pricing = sessionData.pricing;

      if (!pricing) {
        throw new CustomError(
          "Session pricing is not configured.",
          StatusCode.BAD_REQUEST,
        );
      }

      // Save the full payment. Nutritionist payout happens later.
      await this._paymentRepository.create(
        {
          buyerId: userObjectId,
          sellerId: sessionData.nutritionistId,
          itemType: "session_registration",
          itemId: sessionObjectId,
          itemSnapshot: {
            title: sessionData.title,
          },
          provider: "stripe",
          status: "paid",
          amount: pricing.amount,
          currency: pricing.currency,
          providerReferences: {
            checkoutId: stripeSession.id,
            transactionId: paymentIntentId,
          },
        },
        dbSession,
      );

      // Hold the entire payment in admin escrow.
      const adminWallet = await this._walletRepository.findOrCreate(
        adminId,
        "admin",
        dbSession,
      );

      await this._walletRepository.creditEscrow(
        adminWallet._id.toString(),
        pricing.amount,
        dbSession,
      );

      await dbSession.commitTransaction();

      logger.info("Session Stripe checkout processed successfully.", {
        checkoutSessionId: stripeSession.id,
        paymentIntentId,
        sessionId: sessionObjectId.toString(),
        userId: userObjectId.toString(),
        registrationId: registration._id.toString(),
        amount: pricing.amount,
        currency: pricing.currency,
      });
    } catch (error) {
      if (dbSession.inTransaction()) {
        await dbSession.abortTransaction();
      }

      logger.error("Session Stripe checkout processing failed.", {
        checkoutSessionId: stripeSession.id,
        sessionId: sessionObjectId.toString(),
        userId: userObjectId.toString(),
        error:
          error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
              }
            : String(error),
      });

      throw error;
    } finally {
      await dbSession.endSession();
    }
  }

  private validateMetadata(stripeSession: Stripe.Checkout.Session): {
    userId: string;
    sessionId: string;
  } {
    const { userId, sessionId } = stripeSession.metadata ?? {};

    if (
      !userId ||
      !sessionId ||
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(sessionId)
    ) {
      throw new CustomError(
        "Stripe session metadata is missing or contains invalid IDs.",
        StatusCode.BAD_REQUEST,
      );
    }

    return { userId, sessionId };
  }

  private getPaymentIntentId(stripeSession: Stripe.Checkout.Session): string {
    if (stripeSession.payment_status !== "paid") {
      throw new CustomError(
        `Stripe checkout payment is not completed. Status: ${stripeSession.payment_status}`,
        StatusCode.BAD_REQUEST,
      );
    }

    const paymentIntent = stripeSession.payment_intent;
    const paymentIntentId =
      typeof paymentIntent === "string" ? paymentIntent : paymentIntent?.id;

    if (!paymentIntentId) {
      throw new CustomError(
        "Stripe payment intent not found.",
        StatusCode.BAD_REQUEST,
      );
    }

    return paymentIntentId;
  }

  private validateSessionAndPayment(
    sessionData: NonNullable<
      Awaited<ReturnType<IPublicSessionRepository["findById"]>>
    >,
    stripeSession: Stripe.Checkout.Session,
  ): void {
    if (sessionData.deletedAt) {
      throw new CustomError(
        "Cannot register for a deleted session.",
        StatusCode.CONFLICT,
      );
    }

    if (sessionData.status !== "scheduled" && sessionData.status !== "live") {
      throw new CustomError(
        "Session is not available for registration.",
        StatusCode.CONFLICT,
      );
    }

    if (sessionData.pricingType !== "paid" || !sessionData.pricing) {
      throw new CustomError(
        "Session is not configured as a paid session.",
        StatusCode.BAD_REQUEST,
      );
    }

    const { amount, currency } = sessionData.pricing;

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      stripeSession.currency?.toLowerCase() !== currency.toLowerCase() ||
      stripeSession.amount_total !== Math.round(amount * 100)
    ) {
      throw new CustomError(
        "Stripe payment amount or currency does not match session pricing.",
        StatusCode.BAD_REQUEST,
      );
    }
  }

  private validateExistingRegistration(
    registration: ISessionRegistration | null,
  ): void {
    if (registration?.status === "registered") {
      throw new CustomError(
        "User is already registered for this session.",
        StatusCode.CONFLICT,
      );
    }

    if (
      registration?.status === "attended" ||
      registration?.status === "absent"
    ) {
      throw new CustomError(
        "User has already participated in this session.",
        StatusCode.CONFLICT,
      );
    }
  }

  private async createOrRestoreRegistration(
    existingRegistration: ISessionRegistration | null,
    sessionId: Types.ObjectId,
    userId: Types.ObjectId,
    dbSession: mongoose.ClientSession,
  ): Promise<ISessionRegistration> {
    let registration: ISessionRegistration | null;

    if (existingRegistration?.status === "cancelled") {
      registration =
        await this._sessionRegistrationRepository.updateRegistration(
          existingRegistration._id,
          {
            status: "registered",
            registeredAt: new Date(),
            $unset: {
              cancelledAt: 1,
              attendedAt: 1,
            },
          },
          dbSession,
        );
    } else {
      registration = await this._sessionRegistrationRepository.create(
        {
          sessionId,
          userId,
          status: "registered",
          registeredAt: new Date(),
        },
        dbSession,
      );
    }

    if (!registration) {
      throw new CustomError(
        "Failed to create or restore session registration.",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return registration;
  }
}
