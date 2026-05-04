import { CreateSessionDTO } from "../../../dtos/nutritionist/session.dto";
import { SessionResponseDTO } from "../../../dtos/nutritionist/session.dto";

export interface INutriSessionService {
  createSession(
    nutritionistId: string,
    data: CreateSessionDTO,
  ): Promise<SessionResponseDTO>;

  getMySessions(
    nutritionistId: string,
    page: number,
    limit: number,
  ): Promise<{
    data: SessionResponseDTO[];
    total: number;
  }>;

  getSessionDetails(
  nutritionistId: string,
  sessionId: string
): Promise<SessionResponseDTO>;

startSession(
  nutritionistId: string,
  sessionId: string
): Promise<void>;

endSession(
  nutritionistId: string,
  sessionId: string
): Promise<void>;

cancelSession(
  nutritionistId: string,
  sessionId: string
): Promise<void>;
}
