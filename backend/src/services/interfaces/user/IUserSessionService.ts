import {
  UserSessionDTO,
  SessionAccessDTO,
  SessionPaymentDTO,
} from "../../../dtos/user/session.dto";

export interface IUserSessionService {
  getPublicSessions(
    page: number,
    limit: number,
    filters: {
      status?: string;
      type?: string;
      search?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    },
  ): Promise<{
    data: UserSessionDTO[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      hasMore: boolean;
    };
  }>;
  getMySessions(userId: string): Promise<UserSessionDTO[]>;
  getPublicSessionDetails(
    sessionId: string,
    userId?: string,
  ): Promise<UserSessionDTO>;
  getMySessionDetails(
    userId: string,
    sessionId: string,
  ): Promise<UserSessionDTO>;
  joinFreeSession(userId: string, sessionId: string): Promise<void>;
  createPaidSessionPayment(
    userId: string,
    sessionId: string,
  ): Promise<SessionPaymentDTO>;
  verifySessionPayment(sessionId: string): Promise<void>;
  leaveSession(userId: string, sessionId: string): Promise<void>;
  getSessionAccess(
    userId: string,
    sessionId: string,
  ): Promise<SessionAccessDTO>;
  
}
