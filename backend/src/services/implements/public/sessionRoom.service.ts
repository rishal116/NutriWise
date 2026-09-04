import { inject, injectable } from "inversify";

import { Types } from "mongoose";

import { TYPES } from "../../../types/types";

import { ISessionRoomService } from "../../interfaces/public/ISessionRoomService";

import { ISessionRepository } from "../../../repositories/interfaces/public/ISessionRepository";

import { ISessionRegistrationRepository } from "../../../repositories/interfaces/public/ISessionRegistrationRepository";

import { ILiveKitService } from "../../interfaces/livekit/ILiveKitService";

import { SessionRoomJoinResponseDTO } from "../../../dtos/public/session/session-room-join-response.dto";

import { CustomError } from "../../../utils/customError";

import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class SessionRoomService implements ISessionRoomService {
  constructor(
    @inject(TYPES.ISessionRepository)
    private readonly _sessionRepository: ISessionRepository,

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

    // 1. Find session
    const session = await this._sessionRepository.findById(sessionObjectId);

    if (!session) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }

    // 2. Find user's registration
    const registration =
      await this._sessionRegistrationRepository.findBySessionAndUser(
        sessionObjectId,
        userObjectId,
      );

    if (!registration) {
      throw new CustomError(
        "You are not registered for this session",
        StatusCode.NOT_FOUND,
      );
    }

    // 3. Registration must be active
    if (registration.status !== "registered") {
      throw new CustomError(
        "Your registration is not active",
        StatusCode.BAD_REQUEST,
      );
    }

    // 4. Paid sessions must have successful payment
    if (
      session.pricing.type === "paid" &&
      registration.paymentStatus !== "paid"
    ) {
      throw new CustomError(
        "Payment is required before joining this session",
        StatusCode.BAD_REQUEST,
      );
    }

    // 5. Determine participant permissions

    const canPublish = true;
    const canSubscribe = true;

    // 6. Generate LiveKit token
    const token = await this._liveKitService.generateParticipantToken({
      identity: `user:${userId}`,
      roomId: session.roomId,
      canPublish,
      canSubscribe,
    });

    const serverUrl = process.env.LIVEKIT_URL;

    if (!serverUrl) {
      throw new Error("LIVEKIT_URL is not configured");
    }

    return {
      roomId: session.roomId,
      token,
      serverUrl,
      canPublish,
    };
  }

  private canUserPublish(sessionType: string): boolean {
    switch (sessionType) {
      case "workshop":
      case "group_consultation":
        return true;

      case "webinar":
      case "seminar":
      case "qna":
      default:
        return false;
    }
  }
}
