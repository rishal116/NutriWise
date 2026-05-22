import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { INutriSessionService } from "../../interfaces/nutritionist/INutriSessionService";
import { ISessionRepository } from "../../../repositories/interfaces/session/ISessionRepository";
import { SessionType, SessionStatus } from "../../../models/session.model";
import { nanoid } from "nanoid";
import {
  CreateSessionDTO,
  SessionResponseDTO,
} from "../../../dtos/nutritionist/session.dto";
import { SessionMapper } from "../../../mapper/nutritionist/session.mapper";
import { Types } from "mongoose";
import { createSessionSchema } from "../../../validators/session.validator";
import { SessionQueryDTO } from "../../../dtos/nutritionist/session-query.dto";

@injectable()
export class NutriSessionService implements INutriSessionService {
  constructor(
    @inject(TYPES.ISessionRepository)
    private _nutriSessionRepository: ISessionRepository,
  ) {}

  async createSession(
    nutritionistId: string,
    data: CreateSessionDTO,
  ): Promise<SessionResponseDTO> {
    logger.info("Session creation initiated", {
      nutritionistId,
      title: data.title,
    });
    const validatedData = createSessionSchema.parse(data);
    const nutritionistObjectId = new Types.ObjectId(nutritionistId);
    const roomId = nanoid(12);
    const session = await this._nutriSessionRepository.create({
      title: validatedData.title,
      description: validatedData.description,
      nutritionistId: nutritionistObjectId,
      roomId,
      type: validatedData.type === "free" ? SessionType.FREE : SessionType.PAID,
      price: validatedData.type === "free" ? 0 : validatedData.price,
      scheduledAt: new Date(validatedData.scheduledAt),
      durationInMinutes: validatedData.durationInMinutes,
      maxParticipants: validatedData.maxParticipants ?? 60,
      status: SessionStatus.SCHEDULED,
    });
    logger.info("Session created successfully", {
      sessionId: session._id.toString(),
    });
    return SessionMapper.toResponse(session);
  }

  async getMySessions(
    nutritionistId: string,
    query: SessionQueryDTO,
  ): Promise<{
    data: SessionResponseDTO[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      hasMore: boolean;
    };
  }> {
    logger.info("Fetching nutritionist sessions", {
      nutritionistId,
      query,
    });

    const result =
      await this._nutriSessionRepository.findByNutritionistPaginated(
        nutritionistId,
        query,
      );

    logger.info("Nutritionist sessions fetched successfully", {
      nutritionistId,
      totalSessions: result.total,
      fetchedCount: result.data.length,
    });

    return {
      data: SessionMapper.toResponseList(result.data),
      pagination: {
        total: result.total,
        page: query.page,
        limit: query.limit,
        hasMore: query.page * query.limit < result.total,
      },
    };
  }

  async getSessionDetails(nutritionistId: string, sessionId: string) {
    logger.info("Fetching session details", {
      nutritionistId,
      sessionId,
    });
    const session =
      await this._nutriSessionRepository.getSessionById(sessionId);
    if (!session) {
      logger.warn("Session not found", {
        nutritionistId,
        sessionId,
      });
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }
    if (session.nutritionistId.toString() !== nutritionistId) {
      logger.warn("Unauthorized session access attempt", {
        nutritionistId,
        sessionId,
      });
      throw new CustomError("Unauthorized", StatusCode.FORBIDDEN);
    }
    logger.info("Session details fetched successfully", {
      nutritionistId,
      sessionId,
    });
    return SessionMapper.toResponse(session);
  }

  private async validateSessionOwnership(
    nutritionistId: string,
    sessionId: string,
  ) {
    const session =
      await this._nutriSessionRepository.getSessionById(sessionId);
    if (!session) {
      logger.warn("Session not found", {
        nutritionistId,
        sessionId,
      });
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }
    const isOwner = session.nutritionistId.toString() === nutritionistId;
    if (!isOwner) {
      logger.warn("Unauthorized session access attempt", {
        nutritionistId,
        sessionId,
      });
      throw new CustomError("Unauthorized access", StatusCode.FORBIDDEN);
    }
    return session;
  }

  async startSession(nutritionistId: string, sessionId: string): Promise<void> {
    logger.info("Starting session", {
      nutritionistId,
      sessionId,
    });
    const session = await this.validateSessionOwnership(
      nutritionistId,
      sessionId,
    );
    if (session.status !== SessionStatus.SCHEDULED) {
      logger.warn("Invalid session start attempt", {
        sessionId,
        currentStatus: session.status,
      });
      throw new CustomError(
        "Only scheduled sessions can be started",
        StatusCode.BAD_REQUEST,
      );
    }
    await this._nutriSessionRepository.updateStatus(
      sessionId,
      SessionStatus.LIVE,
    );
    logger.info("Session started successfully", {
      nutritionistId,
      sessionId,
    });
  }

  async endSession(nutritionistId: string, sessionId: string): Promise<void> {
    logger.info("Ending session", {
      nutritionistId,
      sessionId,
    });
    const session = await this.validateSessionOwnership(
      nutritionistId,
      sessionId,
    );
    if (session.status !== SessionStatus.LIVE) {
      logger.warn("Invalid session end attempt", {
        sessionId,
        currentStatus: session.status,
      });
      throw new CustomError(
        "Only live sessions can be ended",
        StatusCode.BAD_REQUEST,
      );
    }
    await this._nutriSessionRepository.updateStatus(
      sessionId,
      SessionStatus.ENDED,
    );
    logger.info("Session ended successfully", {
      nutritionistId,
      sessionId,
    });
  }

  async cancelSession(
    nutritionistId: string,
    sessionId: string,
  ): Promise<void> {
    logger.info("Cancelling session", {
      nutritionistId,
      sessionId,
    });
    const session = await this.validateSessionOwnership(
      nutritionistId,
      sessionId,
    );
    if (session.status === SessionStatus.LIVE) {
      logger.warn("Attempt to cancel live session", {
        nutritionistId,
        sessionId,
      });
      throw new CustomError(
        "Live sessions cannot be cancelled",
        StatusCode.BAD_REQUEST,
      );
    }
    await this._nutriSessionRepository.updateStatus(
      sessionId,
      SessionStatus.CANCELLED,
    );
    logger.info("Session cancelled successfully", {
      nutritionistId,
      sessionId,
    });
  }
}
