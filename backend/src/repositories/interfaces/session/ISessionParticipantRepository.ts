import {
  ISessionParticipant,
  SessionAccessStatus,
  PaymentStatus,
} from "../../../models/sessionParticipant.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface ISessionParticipantRepository extends IBaseRepository<ISessionParticipant> {
  getParticipantsBySessionIds(
    sessionIds: string[],
  ): Promise<ISessionParticipant[]>;
  findByUserId(userId: string): Promise<ISessionParticipant[]>;

  findByUserAndSession(
    userId: string,
    sessionId: string,
  ): Promise<ISessionParticipant | null>;

  updatePaymentStatus(
    userId: string,
    sessionId: string,
    paymentStatus: PaymentStatus,
    status?: SessionAccessStatus,
  ): Promise<ISessionParticipant | null>;

  createParticipant(
    data: Pick<
      ISessionParticipant,
      "userId" | "sessionId" | "joinStatus" | "paymentStatus"
    >,
  ): Promise<ISessionParticipant>;


  countApprovedParticipants(sessionId: string): Promise<number>;

  deleteByUserAndSession(
    userId: string,
    sessionId: string,
  ): Promise<ISessionParticipant | null>;

  approveParticipant(
    userId: string,
    sessionId: string,
  ): Promise<ISessionParticipant | null>;

  markPresent(
    userId: string,
    sessionId: string,
  ): Promise<ISessionParticipant | null>;

  findByPaymentIntent(
    paymentIntentId: string,
  ): Promise<ISessionParticipant | null>;
}
