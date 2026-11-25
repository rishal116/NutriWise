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
import logger from "../../../utils/logger";
import { SessionRoomDetailsResponseDTO } from "../../../dtos/public/session/session-room-details-response.dto";
import { SessionRoomMapper } from "../../../mappers/public/session/session-room.mapper";

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

  async getSessionRoomDetails(
    userId: string,
    roomId: string,
  ): Promise<SessionRoomDetailsResponseDTO> {
    this.validateIds(userId, roomId);

    const userObjectId = new Types.ObjectId(userId);
    const session = await this.findSessionByRoomId(roomId);

    const isSessionOwner = session.nutritionistId.equals(userObjectId);

    if (!isSessionOwner) {
      const registration =
        await this._sessionRegistrationRepository.findBySessionAndUser(
          session._id,
          userObjectId,
        );

      if (!registration || registration.status !== "registered") {
        throw new CustomError(
          "You are not registered for this session",
          StatusCode.FORBIDDEN,
        );
      }
    }

    const sessionDetails =
      await this._sessionRepository.findPublicSessionDetails(session._id);

    if (!sessionDetails) {
      throw new CustomError("Session details not found", StatusCode.NOT_FOUND);
    }

    return SessionRoomMapper.toResponse(sessionDetails);
  }

  async joinSession(
    userId: string,
    roomId: string,
  ): Promise<SessionRoomJoinResponseDTO> {
    this.validateIds(userId, roomId);

    const userObjectId = new Types.ObjectId(userId);
    const session = await this.findSessionByRoomId(roomId);

    if (session.status !== "scheduled" && session.status !== "live") {
      throw new CustomError(
        "This session is not available to join",
        StatusCode.BAD_REQUEST,
      );
    }

    const sessionObjectId = session._id;
    const isSessionOwner = session.nutritionistId.equals(userObjectId);

    if (!isSessionOwner) {
      const registration =
        await this._sessionRegistrationRepository.findBySessionAndUser(
          sessionObjectId,
          userObjectId,
        );

      if (!registration || registration.status !== "registered") {
        throw new CustomError(
          "You are not registered for this session",
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

    const role = isSessionOwner ? "host" : "participant";
    const identity = `${isSessionOwner ? "nutritionist" : "user"}:${userId}`;
    const requestId = randomUUID();

    logger.info("[LiveKit] Generating participant token", {
      requestId,
      sessionId: sessionObjectId.toString(),
      userId,
      identity,
      roomId: session.roomId,
      role,
    });

    const canPublish = true;
    const canSubscribe = true;

    const token = await this._liveKitService.generateParticipantToken({
      identity,
      roomId: session.roomId,
      canPublish,
      canSubscribe,
    });

    console.log(token);
    

    return {
      roomId: session.roomId,
      token,
      serverUrl,
      canPublish,
      role,
    };
  }

  async startSession(userId: string, roomId: string): Promise<void> {
    this.validateIds(userId, roomId);

    const userObjectId = new Types.ObjectId(userId);
    const session = await this.findSessionByRoomId(roomId);

    if (!session.nutritionistId.equals(userObjectId)) {
      throw new CustomError(
        "Only the session nutritionist can start this session",
        StatusCode.FORBIDDEN,
      );
    }

    const updatedCount = await this._sessionRepository.updateOne(
      {
        _id: session._id,
        deletedAt: null,
        status: "scheduled",
      },
      {
        $set: { status: "live" },
      },
    );

    if (updatedCount === 0) {
      throw new CustomError(
        "Session is no longer scheduled or its status has changed",
        StatusCode.CONFLICT,
      );
    }

    logger.info("[Session] Session started", {
      sessionId: session._id.toString(),
      roomId,
      nutritionistId: userId,
    });
  }

  async endSession(userId: string, roomId: string): Promise<void> {
    this.validateIds(userId, roomId);

    const userObjectId = new Types.ObjectId(userId);
    const session = await this.findSessionByRoomId(roomId);

    if (!session.nutritionistId.equals(userObjectId)) {
      throw new CustomError(
        "Only the session nutritionist can end this session",
        StatusCode.FORBIDDEN,
      );
    }

    const updatedCount = await this._sessionRepository.updateOne(
      {
        _id: session._id,
        deletedAt: null,
        status: "live",
      },
      {
        $set: { status: "completed" },
      },
    );

    if (updatedCount === 0) {
      throw new CustomError(
        "Session is no longer live or its status has changed",
        StatusCode.CONFLICT,
      );
    }

    logger.info("[Session] Session ended", {
      sessionId: session._id.toString(),
      roomId,
      nutritionistId: userId,
    });
  }

  private async findSessionByRoomId(roomId: string) {
    const session = await this._sessionRepository.findByRoomId(roomId);

    if (!session || session.deletedAt) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }

    return session;
  }

  private validateIds(userId: string, roomId: string): void {
    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID", StatusCode.BAD_REQUEST);
    }

    if (!roomId.trim()) {
      throw new CustomError("Invalid room ID", StatusCode.BAD_REQUEST);
    }
  }
}
