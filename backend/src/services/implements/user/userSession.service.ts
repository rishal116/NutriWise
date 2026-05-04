import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { IUserSessionService } from "../../interfaces/user/IUserSessionService";
import { ISessionRepository } from "../../../repositories/interfaces/session/ISessionRepository";
import { ISessionParticipantRepository } from "../../../repositories/interfaces/session/ISessionParticipantRepository";
import { SessionAccessStatus } from "../../../models/sessionParticipant.model";
import { UserSessionDTO } from "../../../dtos/user/session.dto";
import { PopulatedUser } from "../../../types/session.populated";
import logger from "../../../utils/logger";
import { Types } from "mongoose";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class UserSessionService implements IUserSessionService {
  constructor(
    @inject(TYPES.ISessionRepository)
    private _sessionRepository: ISessionRepository,
    @inject(TYPES.ISessionParticipantRepository)
    private _sessionParticipantRepository: ISessionParticipantRepository,
  ) {}

  async getSessions(userId: string): Promise<UserSessionDTO[]> {
    logger.info("Fetching user sessions", { userId });

    const { data: sessions } = await this._sessionRepository.findUpcoming(
      1,
      50,
    );

    logger.debug("Sessions fetched from DB", {
      count: sessions.length,
    });

    const sessionIds = sessions.map((s) => s._id.toString());

    const participants =
      await this._sessionParticipantRepository.getParticipantsBySessionIds(
        sessionIds,
      );

    logger.debug("Participants fetched", {
      sessionCount: sessionIds.length,
      participantCount: participants.length,
    });

    const sessionMap = new Map<string, UserSessionDTO>();

    for (const session of sessions) {
      sessionMap.set(session._id.toString(), {
        id: session._id.toString(),
        title: session.title,
        description: session.description,
        scheduledAt: session.scheduledAt,
        durationInMinutes: session.durationInMinutes,
        type: session.type,
        price: session.price,
        status: session.status,
        users: [],
        joinStatus: "none",
      });
    }

    for (const p of participants) {
      const session = sessionMap.get(p.sessionId.toString());
      if (!session) continue;

      const user = p.userId as PopulatedUser;

      if (!user || !user._id) continue;

      if (p.status === SessionAccessStatus.APPROVED) {
        session.users.push({
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        });
      }

      if (user._id.toString() === userId) {
        session.joinStatus =
          p.status === SessionAccessStatus.APPROVED ? "approved" : "pending";
      }
    }

    const result = Array.from(sessionMap.values());

    logger.info("User sessions response ready", {
      userId,
      sessionCount: result.length,
    });

    return result;
  }

  async joinSession(userId: string, sessionId: string): Promise<void> {
    const existing =
      await this._sessionParticipantRepository.findByUserAndSession(
        userId,
        sessionId,
      );

    if (existing) {
      throw new CustomError(
        "You have already joined or requested this session",
        StatusCode.BAD_REQUEST,
      );
    }

    const session = await this._sessionRepository.getSessionById(sessionId);

    if (!session) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }

    const status =
      session.type === "free"
        ? SessionAccessStatus.APPROVED
        : SessionAccessStatus.PENDING;

    await this._sessionParticipantRepository.createParticipant({
      userId: new Types.ObjectId(userId),
      sessionId: new Types.ObjectId(sessionId),
      status,
    });
  }

  async leaveSession(userId: string, sessionId: string): Promise<void> {
    const existing =
      await this._sessionParticipantRepository.findByUserAndSession(
        userId,
        sessionId,
      );

    if (!existing) {
      throw new CustomError(
        "You are not part of this session",
        StatusCode.BAD_REQUEST,
      );
    }

    await this._sessionParticipantRepository.deleteByUserAndSession(
      userId,
      sessionId,
    );
  }
}
