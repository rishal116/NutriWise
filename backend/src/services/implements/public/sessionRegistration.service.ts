import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../types/types";

import { ISessionRegistrationService } from "../../interfaces/public/ISessionRegistrationService";

import { ISessionRepository } from "../../../repositories/interfaces/public/ISessionRepository";

import { ISessionRegistrationRepository } from "../../../repositories/interfaces/public/ISessionRegistrationRepository";

import { SessionRegistrationResponseDTO } from "../../../dtos/public/session-registration/session-registration-response.dto";

import { SessionRegistrationCheckoutResponseDTO } from "../../../dtos/public/session-registration/session-registration-checkout-response.dto";

import { SessionRegistrationMapper } from "../../../mappers/public/session-registration/session-registration.mapper";

import { CustomError } from "../../../utils/customError";

import { StatusCode } from "../../../enums/statusCode.enum";

import logger from "../../../utils/logger";

import { ISessionCheckoutService } from "../../interfaces/public/ISessionCheckoutService";

@injectable()
export class SessionRegistrationService implements ISessionRegistrationService {
  constructor(
    @inject(TYPES.ISessionRepository)
    private readonly _sessionRepository: ISessionRepository,

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
    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID", StatusCode.BAD_REQUEST);
    }

    if (!Types.ObjectId.isValid(sessionId)) {
      throw new CustomError("Invalid session ID", StatusCode.BAD_REQUEST);
    }

    const userObjectId = new Types.ObjectId(userId);
    const sessionObjectId = new Types.ObjectId(sessionId);

    const session = await this._sessionRepository.findById(sessionObjectId);

    if (!session) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }

    if (session.status !== "scheduled" && session.status !== "live") {
      throw new CustomError(
        "Session is not available for registration",
        StatusCode.BAD_REQUEST,
      );
    }

    const existingRegistration =
      await this._sessionRegistrationRepository.findBySessionAndUser(
        sessionObjectId,
        userObjectId,
      );

    if (existingRegistration?.status === "registered") {
      throw new CustomError(
        "You are already registered for this session",
        StatusCode.BAD_REQUEST,
      );
    }

    if (
      existingRegistration?.status === "attended" ||
      existingRegistration?.status === "absent"
    ) {
      throw new CustomError(
        "You have already participated in this session",
        StatusCode.BAD_REQUEST,
      );
    }

    const participantCount =
      await this._sessionRegistrationRepository.countActiveRegistrations(
        sessionObjectId,
      );

    if (participantCount >= session.maxParticipants) {
      throw new CustomError("Session is full", StatusCode.BAD_REQUEST);
    }

    if (session.pricing.type === "paid") {
      const checkoutUrl =
        await this._sessionCheckoutService.createCheckoutSession({
          userId,
          sessionId,
        });

      logger.info("Session checkout created", {
        userId,
        sessionId,
      });

      return {
        checkoutUrl,
      };
    }

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
          "Failed to register for session",
          StatusCode.INTERNAL_SERVER_ERROR,
        );
      }

      logger.info("User re-registered for free session", {
        userId,
        sessionId,
        registrationId: registration._id.toString(),
      });

      return SessionRegistrationMapper.toResponse(registration);
    }

    const registration = await this._sessionRegistrationRepository.create({
      sessionId: sessionObjectId,
      userId: userObjectId,
      status: "registered",
      registeredAt: new Date(),
    });

    logger.info("User registered for free session", {
      userId,
      sessionId,
      registrationId: registration._id.toString(),
    });

    return SessionRegistrationMapper.toResponse(registration);
  }

  async getMySessionRegistration(
    userId: string,
    sessionId: string,
  ): Promise<SessionRegistrationResponseDTO> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID", StatusCode.BAD_REQUEST);
    }

    if (!Types.ObjectId.isValid(sessionId)) {
      throw new CustomError("Invalid session ID", StatusCode.BAD_REQUEST);
    }

    const registration =
      await this._sessionRegistrationRepository.findBySessionAndUser(
        new Types.ObjectId(sessionId),
        new Types.ObjectId(userId),
      );

    if (!registration) {
      throw new CustomError(
        "Session registration not found",
        StatusCode.NOT_FOUND,
      );
    }

    return SessionRegistrationMapper.toResponse(registration);
  }

  async cancelSessionRegistration(
    userId: string,
    sessionId: string,
  ): Promise<SessionRegistrationResponseDTO> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID", StatusCode.BAD_REQUEST);
    }

    if (!Types.ObjectId.isValid(sessionId)) {
      throw new CustomError("Invalid session ID", StatusCode.BAD_REQUEST);
    }

    const registration =
      await this._sessionRegistrationRepository.findBySessionAndUser(
        new Types.ObjectId(sessionId),
        new Types.ObjectId(userId),
      );

    if (!registration) {
      throw new CustomError(
        "Session registration not found",
        StatusCode.NOT_FOUND,
      );
    }

    if (registration.status === "cancelled") {
      throw new CustomError(
        "Session registration is already cancelled",
        StatusCode.BAD_REQUEST,
      );
    }

    if (
      registration.status === "attended" ||
      registration.status === "absent"
    ) {
      throw new CustomError(
        "You cannot cancel this registration",
        StatusCode.BAD_REQUEST,
      );
    }

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
        "Failed to cancel session registration",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    logger.info("Session registration cancelled", {
      userId,
      sessionId,
      registrationId: registration._id.toString(),
    });

    return SessionRegistrationMapper.toResponse(updatedRegistration);
  }
}
