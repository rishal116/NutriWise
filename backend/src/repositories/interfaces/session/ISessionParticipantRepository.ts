import { ISessionParticipant } from "../../../models/sessionParticipant.model";

export interface ISessionParticipantRepository {
  getParticipantsBySessionIds(
    sessionIds: string[],
  ): Promise<ISessionParticipant[]>;

  findByUserAndSession(
    userId: string,
    sessionId: string,
  ): Promise<ISessionParticipant | null>;

  createParticipant(
    data: Pick<ISessionParticipant, "userId" | "sessionId" | "status">,
  ): Promise<ISessionParticipant>;

  countApproved(sessionId: string): Promise<number>;
  deleteByUserAndSession(
    userId: string,
    sessionId: string,
  ): Promise<ISessionParticipant | null>;
}
