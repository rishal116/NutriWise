import { BaseRepository } from "../common/base.repository";
import { ISessionParticipantRepository } from "../../interfaces/session/ISessionParticipantRepository";
import {
  SessionParticipantModel,
  ISessionParticipant,
  SessionAccessStatus,
  PaymentStatus,
} from "../../../models/sessionParticipant.model";

export class SessionParticipantRepository
  extends BaseRepository<ISessionParticipant>
  implements ISessionParticipantRepository
{
  constructor() {
    super(SessionParticipantModel);
  }
  async findByUserId(userId: string): Promise<ISessionParticipant[]> {
    return this._model.find({
      userId,
    });
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
    return this._model.findOne({
      userId,
      sessionId,
    });
  }

  async updatePaymentStatus(
    userId: string,
    sessionId: string,
    paymentStatus: PaymentStatus,
    status?: SessionAccessStatus,
  ): Promise<ISessionParticipant | null> {
    return this._model.findOneAndUpdate(
      { userId, sessionId },
      {
        paymentStatus,
        ...(status && { status }),
      },
      { new: true },
    );
  }

  async createParticipant(
    data: Pick<
      ISessionParticipant,
      "userId" | "sessionId" | "joinStatus" | "paymentStatus"
    >,
  ): Promise<ISessionParticipant> {
    return this._model.create(data);
  }

  async countApprovedParticipants(sessionId: string): Promise<number> {
    return this._model.countDocuments({
      sessionId,
      joinStatus: SessionAccessStatus.APPROVED,
    });
  }

  async deleteByUserAndSession(
    userId: string,
    sessionId: string,
  ): Promise<ISessionParticipant | null> {
    return this._model.findOneAndDelete({
      userId,
      sessionId,
    });
  }

  async approveParticipant(
    userId: string,
    sessionId: string,
  ): Promise<ISessionParticipant | null> {
    return this._model.findOneAndUpdate(
      { userId, sessionId },
      {
        status: SessionAccessStatus.APPROVED,
      },
      { new: true },
    );
  }

  async markPresent(
    userId: string,
    sessionId: string,
  ): Promise<ISessionParticipant | null> {
    return this._model.findOneAndUpdate(
      { userId, sessionId },
      {
        isPresent: true,
        joinedAt: new Date(),
      },
      { new: true },
    );
  }

  async findByPaymentIntent(
    paymentIntentId: string,
  ): Promise<ISessionParticipant | null> {
    return this._model.findOne({
      paymentIntentId,
    });
  }
}
