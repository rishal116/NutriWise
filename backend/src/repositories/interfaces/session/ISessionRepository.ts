import { ISession } from "../../../models/session.model";
import { IBaseRepository } from "../common/IBaseRepository";
import { SessionStatus } from "../../../models/session.model";

export interface ISessionRepository extends IBaseRepository<ISession> {
  findByNutritionist(nutritionistId: string): Promise<ISession[]>;
  findByNutritionistPaginated(
    nutritionistId: string,
    page: number,
    limit: number,
  ): Promise<{ data: ISession[]; total: number }>;

  findUpcoming(
    page?: number,
    limit?: number,
  ): Promise<{ data: ISession[]; total: number }>;

  findLiveSessions(): Promise<ISession[]>;
  getSessionById(sessionId: string): Promise<ISession | null>;

  updateStatus(
    sessionId: string,
    status: SessionStatus,
  ): Promise<ISession | null>;
}
