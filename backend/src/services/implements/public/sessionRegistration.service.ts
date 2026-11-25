import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../types/types";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { toObjectId } from "../../../utils/object-id.util";
import logger from "../../../utils/logger";

import type { ISessionRegistrationService } from "../../interfaces/public/ISessionRegistrationService";
import type { IPublicSessionRepository } from "../../../repositories/interfaces/public/IPublicSessionRepository";
import type { ISessionRegistrationRepository } from "../../../repositories/interfaces/public/ISessionRegistrationRepository";
import type { ISessionCheckoutService } from "../../interfaces/public/ISessionCheckoutService";

import type { SessionRegistrationResponseDTO } from "../../../dtos/public/session-registration/session-registration-response.dto";
import type { SessionRegistrationCheckoutResponseDTO } from "../../../dtos/public/session-registration/session-registration-checkout-response.dto";

import { SessionRegistrationMapper } from "../../../mappers/public/session-registration/session-registration.mapper";

import type { ISessionRegistration } from "../../../models/sessionRegistration.model";

@injectable()
export class SessionRegistrationService implements ISessionRegistrationService {
  constructor(
    @inject(TYPES.IPublicSessionRepository)
    private readonly _sessionRepository: IPublicSessionRepository,

    @inject(TYPES.ISessionRegistrationRepository)
    private readonly _sessionRegistrationRepository: ISessionRegistrationRepository,

    @inject(TYPES.ISessionCheckoutService)
    private readonly _sessionCheckoutService: ISessionCheckoutService,
  ) {}

  async registerForSession(
    userId: string,
    sessionId: string,
  ): Promise<
    SessionRegistrationResponseDTO | SessionRegistrationCheckoutResponseDTO
  > {
    const userObjectId = toObjectId(userId, "user ID");
    const sessionObjectId = toObjectId(sessionId, "session ID");

    const session = await this._sessionRepository.findById(sessionObjectId);

    this.validateSessionAvailability(session, userObjectId);

    const existingRegistration =
      await this._sessionRegistrationRepository.findBySessionAndUser(
        sessionObjectId,
        userObjectId,
      );

    this.validateExistingRegistration(existingRegistration);

    await this.validateSessionCapacity(
      sessionObjectId,
      session.maxParticipants,
    );

    if (session.pricingType === "paid") {
      return this.createPaidRegistrationCheckout(userId, sessionId);
    }

    return this.registerForFreeSession(
      existingRegistration,
      sessionObjectId,
      userObjectId,
    );
  }

  async cancelSessionRegistration(
    userId: string,
    sessionId: string,
  ): Promise<SessionRegistrationResponseDTO> {
    const userObjectId = toObjectId(userId, "user ID");
    const sessionObjectId = toObjectId(sessionId, "session ID");

    const registration =
      await this._sessionRegistrationRepository.findBySessionAndUser(
        sessionObjectId,
        userObjectId,
      );

    this.validateRegistrationCancellation(registration);

    const updatedRegistration =
      await this._sessionRegistrationRepository.updateRegistration(
        registration._id,
        {
          status: "cancelled",
          cancelledAt: new Date(),
        },
      );

    if (!updatedRegistration) {
      throw new CustomError(
        "Failed to cancel session registration.",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    logger.info("Session registration cancelled.", {
      userId,
      sessionId,
      registrationId: registration._id.toString(),
    });

    return SessionRegistrationMapper.toResponse(updatedRegistration);
  }

  private validateSessionAvailability(
    session: Awaited<ReturnType<IPublicSessionRepository["findById"]>>,
    userId: Types.ObjectId,
  ): asserts session is NonNullable<typeof session> {
    if (!session || session.deletedAt) {
      throw new CustomError("Session not found.", StatusCode.NOT_FOUND);
    }

    if (session.nutritionistId.equals(userId)) {
      throw new CustomError(
        "You are the host of this session and do not need to register.",
        StatusCode.BAD_REQUEST,
      );
    }

    if (session.status !== "scheduled" && session.status !== "live") {
      throw new CustomError(
        "Session is not available for registration.",
        StatusCode.BAD_REQUEST,
      );
    }
  }

  private validateExistingRegistration(
    registration: ISessionRegistration | null,
  ): void {
    if (registration?.status === "registered") {
      throw new CustomError(
        "You are already registered for this session.",
        StatusCode.CONFLICT,
      );
    }

    if (
      registration?.status === "attended" ||
      registration?.status === "absent"
    ) {
      throw new CustomError(
        "You have already participated in this session.",
        StatusCode.CONFLICT,
      );
    }
  }

  private async validateSessionCapacity(
    sessionId: Types.ObjectId,
    maxParticipants: number,
  ): Promise<void> {
    const participantCount =
      await this._sessionRegistrationRepository.countActiveRegistrations(
        sessionId,
      );

    if (participantCount >= maxParticipants) {
      throw new CustomError(
        "Session has reached its maximum participant capacity.",
        StatusCode.CONFLICT,
      );
    }
  }

  private async createPaidRegistrationCheckout(
    userId: string,
    sessionId: string,
  ): Promise<SessionRegistrationCheckoutResponseDTO> {
    const checkoutUrl =
      await this._sessionCheckoutService.createCheckoutSession({
        userId,
        sessionId,
      });

    logger.info("Session checkout created.", {
      userId,
      sessionId,
    });

    return { checkoutUrl };
  }

  private async registerForFreeSession(
    existingRegistration: ISessionRegistration | null,
    sessionId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<SessionRegistrationResponseDTO> {
    const registration = await this.createOrRestoreRegistration(
      existingRegistration,
      sessionId,
      userId,
    );

    logger.info("User registered for free session.", {
      userId: userId.toString(),
      sessionId: sessionId.toString(),
      registrationId: registration._id.toString(),
    });

    return SessionRegistrationMapper.toResponse(registration);
  }

  private validateRegistrationCancellation(
    registration: ISessionRegistration | null,
  ): asserts registration is ISessionRegistration {
    if (!registration) {
      throw new CustomError(
        "Session registration not found.",
        StatusCode.NOT_FOUND,
      );
    }

    if (registration.status === "cancelled") {
      throw new CustomError(
        "Session registration is already cancelled.",
        StatusCode.BAD_REQUEST,
      );
    }

    if (
      registration.status === "attended" ||
      registration.status === "absent"
    ) {
      throw new CustomError(
        "You cannot cancel this registration.",
        StatusCode.BAD_REQUEST,
      );
    }
  }

  private async createOrRestoreRegistration(
    existingRegistration: ISessionRegistration | null,
    sessionId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<ISessionRegistration> {
    if (existingRegistration?.status === "cancelled") {
      const registration =
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
        );

      if (!registration) {
        throw new CustomError(
          "Failed to restore session registration.",
          StatusCode.INTERNAL_SERVER_ERROR,
        );
      }

      return registration;
    }

    return this._sessionRegistrationRepository.create({
      sessionId,
      userId,
      status: "registered",
      registeredAt: new Date(),
    });
  }
}
