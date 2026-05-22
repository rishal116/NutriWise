import { CreateSessionDTO } from "../../../dtos/nutritionist/session.dto";
import { SessionResponseDTO } from "../../../dtos/nutritionist/session.dto";
import { SessionQueryDTO } from "../../../dtos/nutritionist/session-query.dto";

export interface INutriSessionService {
  createSession(
    nutritionistId: string,
    data: CreateSessionDTO,
  ): Promise<SessionResponseDTO>;
  getMySessions(
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
  }>;
  getSessionDetails(
    nutritionistId: string,
    sessionId: string,
  ): Promise<SessionResponseDTO>;
  startSession(nutritionistId: string, sessionId: string): Promise<void>;
  endSession(nutritionistId: string, sessionId: string): Promise<void>;
  cancelSession(nutritionistId: string, sessionId: string): Promise<void>;
}
