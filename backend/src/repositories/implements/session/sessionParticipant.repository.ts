import { BaseRepository } from "../common/base.repository";
import { ISessionParticipantRepository } from "../../interfaces/session/ISessionParticipantRepository";
import {
  SessionParticipantModel,
  ISessionParticipant,
  SessionAccessStatus,
} from "../../../models/sessionParticipant.model";

export class SessionParticipantRepository
  extends BaseRepository<ISessionParticipant>
  implements ISessionParticipantRepository
{
  constructor() {
    super(SessionParticipantModel);
  }

  async getParticipantsBySessionIds(
    sessionIds: string[],
  ): Promise<ISessionParticipant[]> {
    return this._model
      .find({
        sessionId: { $in: sessionIds },
        status: SessionAccessStatus.APPROVED,
      })
      .populate("userId", "fullName email")
      .lean<ISessionParticipant[]>();
  }

  async findByUserAndSession(
    userId: string,
    sessionId: string,
  ): Promise<ISessionParticipant | null> {
    return this._model.findOne({ userId, sessionId });
  }

  async createParticipant(
    data: Pick<ISessionParticipant, "userId" | "sessionId" | "status">,
  ): Promise<ISessionParticipant> {
    return this._model.create(data);
  }

  async countApproved(sessionId: string): Promise<number> {
    return this._model.countDocuments({
      sessionId,
      status: SessionAccessStatus.APPROVED,
    });
  }
  async deleteByUserAndSession(userId: string, sessionId: string) {
    return this._model.findOneAndDelete({ userId, sessionId });
  }
}
