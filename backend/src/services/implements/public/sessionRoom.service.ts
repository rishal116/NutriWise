import { randomUUID } from "node:crypto";
import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../types/types";
import type { ISessionRoomService } from "../../interfaces/public/ISessionRoomService";
import type { IPublicSessionRepository } from "../../../repositories/interfaces/public/IPublicSessionRepository";
import type { ISessionRegistrationRepository } from "../../../repositories/interfaces/public/ISessionRegistrationRepository";
import type { ILiveKitService } from "../../interfaces/livekit/ILiveKitService";
import type { SessionRoomJoinResponseDTO } from "../../../dtos/public/session/session-room-join-response.dto";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class SessionRoomService implements ISessionRoomService {
  constructor(
    @inject(TYPES.IPublicSessionRepository)
    private readonly _sessionRepository: IPublicSessionRepository,

    @inject(TYPES.ISessionRegistrationRepository)
    private readonly _sessionRegistrationRepository: ISessionRegistrationRepository,

    @inject(TYPES.ILiveKitService)
    private readonly _liveKitService: ILiveKitService,
  ) {}

  async joinSession(
    userId: string,
    sessionId: string,
  ): Promise<SessionRoomJoinResponseDTO> {
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

    const isSessionOwner =
      session.nutritionistId.toString() === userObjectId.toString();

    if (!isSessionOwner) {
      const registration =
        await this._sessionRegistrationRepository.findBySessionAndUser(
          sessionObjectId,
          userObjectId,
        );

      if (!registration) {
        throw new CustomError(
          "You are not registered for this session",
          StatusCode.FORBIDDEN,
        );
      }

      if (registration.status !== "registered") {
        throw new CustomError(
          "Your registration is not active",
          StatusCode.FORBIDDEN,
        );
      }

      if (
        session.pricing.type === "paid" &&
        registration.paymentStatus !== "paid"
      ) {
        throw new CustomError(
          "Payment is required before joining this session",
          StatusCode.FORBIDDEN,
        );
      }
    }

    const serverUrl = process.env.LIVEKIT_URL;

    if (!serverUrl) {
      throw new CustomError(
        "LiveKit server URL is not configured",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const identity = `${isSessionOwner ? "nutritionist" : "user"}:${userId}`;
    const requestId = randomUUID();

    console.info("[LiveKit] Generating participant token", {
      requestId,
      sessionId,
      userId,
      identity,
      roomId: session.roomId,
      role: isSessionOwner ? "host" : "participant",
    });

    const canPublish = true;
    const canSubscribe = true;

    const token = await this._liveKitService.generateParticipantToken({
      identity,
      roomId: session.roomId,
      canPublish,
      canSubscribe,
    });

    return {
      roomId: session.roomId,
      token,
      serverUrl,
      canPublish,
      role: isSessionOwner ? "host" : "participant",
    };
  }

  async startSession(userId: string, sessionId: string): Promise<void> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(sessionId)) {
      throw new CustomError(
        "Invalid user or session ID",
        StatusCode.BAD_REQUEST,
      );
    }

    const sessionObjectId = new Types.ObjectId(sessionId);
    const session = await this._sessionRepository.findById(sessionObjectId);

    if (!session) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }

    if (session.nutritionistId.toString() !== userId) {
      throw new CustomError(
        "Only the session nutritionist can start this session",
        StatusCode.FORBIDDEN,
      );
    }

    const updated = await this._sessionRepository.updateSessionStatus(
      sessionObjectId,
      "scheduled",
      "live",
    );

    if (!updated) {
      throw new CustomError(
        "Session is no longer scheduled or its status has changed",
        StatusCode.CONFLICT,
      );
    }
  }

  async endSession(userId: string, sessionId: string): Promise<void> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(sessionId)) {
      throw new CustomError(
        "Invalid user or session ID",
        StatusCode.BAD_REQUEST,
      );
    }

    const sessionObjectId = new Types.ObjectId(sessionId);
    const session = await this._sessionRepository.findById(sessionObjectId);

    if (!session) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }

    if (session.nutritionistId.toString() !== userId) {
      throw new CustomError(
        "Only the session nutritionist can end this session",
        StatusCode.FORBIDDEN,
      );
    }

    const updated = await this._sessionRepository.updateSessionStatus(
      sessionObjectId,
      "live",
      "completed",
    );

    if (!updated) {
      throw new CustomError(
        "Session is no longer live or its status has changed",
        StatusCode.CONFLICT,
      );
    }
  }
}
