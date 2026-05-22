import { ISession } from "../../../models/session.model";
import { IBaseRepository } from "../common/IBaseRepository";
import { SessionStatus } from "../../../models/session.model";
import { SessionQueryDTO } from "../../../dtos/nutritionist/session-query.dto";
import { PopulatedSession } from "../../../types/session.populated";

export interface ISessionRepository extends IBaseRepository<ISession> {
  findByNutritionist(nutritionistId: string): Promise<ISession[]>;

  findByNutritionistPaginated(
    nutritionistId: string,
    query: SessionQueryDTO,
  ): Promise<{
    data: ISession[];
    total: number;
  }>;

  findUpcoming(
    page?: number,
    limit?: number,
  ): Promise<{
    data: ISession[];
    total: number;
  }>;

  getAllPublicSessions(
    page?: number,
    limit?: number,
    filters?: {
      status?: string;
      type?: string;
      search?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    },
  ): Promise<{
    data: ISession[];
    total: number;
  }>;

  findLiveSessions(): Promise<ISession[]>;
getSessionById(sessionId: string): Promise<ISession | null>;
 getUserSessionById(
  sessionId: string,
): Promise<PopulatedSession | null>;

  findByRoomId(roomId: string): Promise<ISession | null>;

  updateStatus(
    sessionId: string,
    status: SessionStatus,
  ): Promise<ISession | null>;

  markDeleted(sessionId: string): Promise<ISession | null>;
}
