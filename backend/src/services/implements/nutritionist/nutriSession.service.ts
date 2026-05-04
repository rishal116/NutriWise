import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { INutriSessionService } from "../../interfaces/nutritionist/INutriSessionService";
import { ISessionRepository } from "../../../repositories/interfaces/session/ISessionRepository";
import { SessionType, SessionStatus } from "../../../models/session.model";
import { nanoid } from "nanoid";
import { CreateSessionDTO } from "../../../dtos/nutritionist/session.dto";
import { SessionResponseDTO } from "../../../dtos/nutritionist/session.dto";
import { SessionMapper } from "../../../mapper/nutritionist/session.mapper";
import { Types } from "mongoose";

@injectable()
export class NutriSessionService implements INutriSessionService {
  constructor(
    @inject(TYPES.ISessionRepository)
    private _nutriSessionRepository: ISessionRepository,
  ) {}

  // 🎯 Create Session (NO any)
  async createSession(
    nutritionistId: string,
    data: CreateSessionDTO,
  ): Promise<SessionResponseDTO> {
    try {
      const {
        title,
        description,
        type,
        price,
        scheduledAt,
        durationInMinutes,
        maxParticipants,
      } = data;

      // 🔍 validations
      if (!title || !scheduledAt || !durationInMinutes) {
        throw new CustomError(
          "Missing required fields",
          StatusCode.BAD_REQUEST,
        );
      }

      const scheduledDate = new Date(scheduledAt);

      if (scheduledDate < new Date()) {
        throw new CustomError(
          "Cannot schedule session in the past",
          StatusCode.BAD_REQUEST,
        );
      }

      const nutritionistObjectId = new Types.ObjectId(nutritionistId);

      const sessionType = type === "free" ? SessionType.FREE : SessionType.PAID;

      if (sessionType === SessionType.PAID && (!price || price <= 0)) {
        throw new CustomError(
          "Paid session must have valid price",
          StatusCode.BAD_REQUEST,
        );
      }

      const roomId = nanoid(12);

      const session = await this._nutriSessionRepository.create({
        title,
        description,
        nutritionistId: nutritionistObjectId,
        roomId,
        type: sessionType,
        price: type === SessionType.FREE ? 0 : price,
        scheduledAt: scheduledDate,
        durationInMinutes,
        maxParticipants: maxParticipants || 100,
        status: SessionStatus.SCHEDULED,
        isDeleted: false,
      });

      return SessionMapper.toResponse(session);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error("Error creating session:", error.message);
      }

      throw error;
    }
  }

  async getMySessions(
    nutritionistId: string,
    page: number,
    limit: number,
  ): Promise<{ data: SessionResponseDTO[]; total: number }> {
    try {
      const result =
        await this._nutriSessionRepository.findByNutritionistPaginated(
          nutritionistId,
          page,
          limit,
        );

      return {
        data: SessionMapper.toResponseList(result.data),
        total: result.total,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error("Error fetching sessions:", error.message);
      }
      throw new CustomError(
        "Failed to fetch sessions",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSessionDetails(nutritionistId: string, sessionId: string) {
    const session =
      await this._nutriSessionRepository.getSessionById(sessionId);

    if (!session) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }

    if (session.nutritionistId.toString() !== nutritionistId) {
      throw new CustomError("Unauthorized", StatusCode.FORBIDDEN);
    }

    return SessionMapper.toResponse(session);
  }

  async startSession(nutritionistId: string, sessionId: string) {
    const session =
      await this._nutriSessionRepository.getSessionById(sessionId);

    if (!session) throw new CustomError("Session not found", 404);

    if (session.nutritionistId.toString() !== nutritionistId) {
      throw new CustomError("Unauthorized", 403);
    }

    if (session.status !== SessionStatus.SCHEDULED) {
      throw new CustomError("Session cannot be started", 400);
    }

    await this._nutriSessionRepository.updateStatus(
      sessionId,
      SessionStatus.LIVE,
    );
  }

  async endSession(nutritionistId: string, sessionId: string) {
    const session =
      await this._nutriSessionRepository.getSessionById(sessionId);

    if (!session) throw new CustomError("Session not found", 404);

    if (session.nutritionistId.toString() !== nutritionistId) {
      throw new CustomError("Unauthorized", 403);
    }

    if (session.status !== SessionStatus.LIVE) {
      throw new CustomError("Session is not live", 400);
    }

    await this._nutriSessionRepository.updateStatus(
      sessionId,
      SessionStatus.ENDED,
    );
  }

  async cancelSession(nutritionistId: string, sessionId: string) {
    const session =
      await this._nutriSessionRepository.getSessionById(sessionId);

    if (!session) throw new CustomError("Session not found", 404);

    if (session.nutritionistId.toString() !== nutritionistId) {
      throw new CustomError("Unauthorized", 403);
    }

    if (session.status === SessionStatus.LIVE) {
      throw new CustomError("Cannot cancel live session", 400);
    }

    await this._nutriSessionRepository.updateStatus(
      sessionId,
      SessionStatus.CANCELLED,
    );
  }
}
