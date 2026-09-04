import mongoose, { Types } from "mongoose";
import Stripe from "stripe";
import { inject, injectable } from "inversify";

import logger from "../../../../utils/logger";
import { TYPES } from "../../../../types/types";

import { ISessionStripeCheckoutHandlerService } from "../../../interfaces/common/stripe/ISessionStripeCheckoutHandlerService";

import { ISessionRepository } from "../../../../repositories/interfaces/public/ISessionRepository";

import { ISessionRegistrationRepository } from "../../../../repositories/interfaces/public/ISessionRegistrationRepository";

import { IPaymentRepository } from "../../../../repositories/interfaces/common/IPaymentRepository";

import { IWalletRepository } from "../../../../repositories/interfaces/common/IWalletRepository";

@injectable()
export class SessionStripeCheckoutHandlerService implements ISessionStripeCheckoutHandlerService {
  constructor(
    @inject(TYPES.ISessionRepository)
    private readonly _sessionRepository: ISessionRepository,

    @inject(TYPES.ISessionRegistrationRepository)
    private readonly _sessionRegistrationRepository: ISessionRegistrationRepository,

    @inject(TYPES.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,

    @inject(TYPES.IWalletRepository)
    private readonly _walletRepository: IWalletRepository,
  ) {}

  async handle(session: Stripe.Checkout.Session): Promise<void> {
    if (!session.metadata?.userId || !session.metadata?.sessionId) {
      throw new Error(
        "Stripe session metadata is missing for session registration.",
      );
    }

    if (session.metadata.paymentType !== "session_registration") {
      logger.warn("Ignoring non-session Stripe checkout.", {
        checkoutSessionId: session.id,
      });

      return;
    }

    if (!session.payment_intent) {
      throw new Error(
        "Stripe payment intent not found for session registration.",
      );
    }

    const alreadyProcessed =
      await this._paymentRepository.existsByCheckoutSessionId(session.id);

    if (alreadyProcessed) {
      logger.warn("Duplicate session Stripe webhook ignored.", {
        checkoutSessionId: session.id,
      });

      return;
    }

    if (
      !Types.ObjectId.isValid(session.metadata.userId) ||
      !Types.ObjectId.isValid(session.metadata.sessionId)
    ) {
      throw new Error("Invalid user ID or session ID in Stripe metadata.");
    }

    const userId = new Types.ObjectId(session.metadata.userId);

    const sessionId = new Types.ObjectId(session.metadata.sessionId);

    const sessionData = await this._sessionRepository.findById(sessionId);

    if (!sessionData) {
      throw new Error("Session not found.");
    }

    if (sessionData.pricing.type !== "paid") {
      throw new Error(
        "Session registration payment received for a free session.",
      );
    }

    const existingRegistration =
      await this._sessionRegistrationRepository.findBySessionAndUser(
        sessionId,
        userId,
      );

    if (existingRegistration) {
      if (
        existingRegistration.status === "attended" ||
        existingRegistration.status === "absent"
      ) {
        throw new Error("User has already participated in this session.");
      }

      if (
        existingRegistration.status === "registered" &&
        existingRegistration.paymentStatus === "paid"
      ) {
        logger.warn("Session registration already completed.", {
          checkoutSessionId: session.id,
          registrationId: existingRegistration._id.toString(),
        });

        return;
      }
    }

    const participantCount =
      await this._sessionRegistrationRepository.countActiveRegistrations(
        sessionId,
      );

    if (
      !existingRegistration &&
      participantCount >= sessionData.maxParticipants
    ) {
      throw new Error("Session became full before payment was completed.");
    }

    const dbSession = await mongoose.startSession();

    try {
      dbSession.startTransaction();

      let registration;

      if (existingRegistration) {
        registration =
          await this._sessionRegistrationRepository.updateRegistration(
            existingRegistration._id,
            {
              status: "registered",
              paymentStatus: "paid",
              registeredAt: new Date(),
              checkoutSessionId: session.id,
              paymentIntentId: session.payment_intent.toString(),
              $unset: {
                cancelledAt: 1,
                attendedAt: 1,
              },
            },
            dbSession,
          );
      } else {
        registration =
          await this._sessionRegistrationRepository.createWithSession(
            {
              sessionId,
              userId,
              status: "registered",
              paymentStatus: "paid",
              registeredAt: new Date(),
              checkoutSessionId: session.id,
              paymentIntentId: session.payment_intent.toString(),
            },
            dbSession,
          );
      }

      if (!registration) {
        throw new Error("Failed to create session registration.");
      }

      await this._paymentRepository.createWithSession(
        {
          userId,
          sellerId: sessionData.nutritionistId,
          resourceType: "session_registration",
          resourceId: sessionId,
          provider: "stripe",
          status: "paid",
          amount: sessionData.pricing.amount,
          currency: sessionData.pricing.currency,
          checkoutSessionId: session.id,
          paymentIntentId: session.payment_intent.toString(),
          itemSnapshot: {
            title: sessionData.title,
            price: sessionData.pricing.amount,
            currency: sessionData.pricing.currency,
          },
          metadata: {
            registrationId: registration._id.toString(),
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
        sessionData.pricing.amount,
        dbSession,
      );

      await dbSession.commitTransaction();

      logger.info("Session Stripe checkout processed successfully.", {
        checkoutSessionId: session.id,
        sessionId: sessionId.toString(),
        userId: userId.toString(),
        registrationId: registration._id.toString(),
      });
    } catch (error) {
      await dbSession.abortTransaction();

      logger.error("Session Stripe checkout processing failed.", {
        checkoutSessionId: session.id,
        sessionId: sessionId.toString(),
        userId: userId.toString(),
        error,
      });

      throw error;
    } finally {
      await dbSession.endSession();
    }
  }
}
