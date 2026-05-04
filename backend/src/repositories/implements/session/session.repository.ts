import { BaseRepository } from "../common/base.repository";
import { ISessionRepository } from "../../interfaces/session/ISessionRepository";
import { SessionModel, ISession } from "../../../models/session.model";
import { SessionStatus } from "../../../models/session.model";

export class SessionRepository
  extends BaseRepository<ISession>
  implements ISessionRepository
{
  constructor() {
    super(SessionModel);
  }

  async findByNutritionist(nutritionistId: string): Promise<ISession[]> {
    return this._model
      .find({
        nutritionistId,
        isDeleted: false,
      })
      .sort({ scheduledAt: -1 });
  }

  async findByNutritionistPaginated(
    nutritionistId: string,
    page: number,
    limit: number,
  ): Promise<{ data: ISession[]; total: number }> {
    const skip = (page - 1) * limit;

    const query = {
      nutritionistId,
      isDeleted: false,
    };

    const [data, total] = await Promise.all([
      this._model.find(query).sort({ scheduledAt: -1 }).skip(skip).limit(limit),

      this._model.countDocuments(query),
    ]);

    return { data, total };
  }

  async findUpcoming(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: ISession[]; total: number }> {
    const skip = (page - 1) * limit;

    const query = {
      scheduledAt: { $gte: new Date() },
      status: SessionStatus.SCHEDULED,
      isDeleted: false,
    };

    const [data, total] = await Promise.all([
      this._model.find(query).sort({ scheduledAt: 1 }).skip(skip).limit(limit),

      this._model.countDocuments(query),
    ]);

    return { data, total };
  }

  async findLiveSessions(): Promise<ISession[]> {
    return this._model.find({
      status: SessionStatus.LIVE,
      isDeleted: false,
    });
  }

  async updateStatus(sessionId: string, status: string) {
    return this._model.findByIdAndUpdate(sessionId, { status }, { new: true });
  }
  async getSessionById(sessionId: string): Promise<ISession | null> {
    return this._model.findOne({
      _id: sessionId,
      isDeleted: false,
    });
  }
}
