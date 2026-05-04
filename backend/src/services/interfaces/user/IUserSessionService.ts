import { UserSessionDTO } from "../../../dtos/user/session.dto";

export interface IUserSessionService {

  getSessions(userId: string): Promise<UserSessionDTO[]>;


  joinSession(userId: string, sessionId: string): Promise<void>;

  
  leaveSession(userId: string, sessionId: string): Promise<void>;
}