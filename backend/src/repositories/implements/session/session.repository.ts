import { BaseRepository } from "../common/base.repository";
import { ISessionRepository } from "../../interfaces/session/ISessionRepository";
import {
  SessionModel,
  ISession,
  SessionStatus,
} from "../../../models/session.model";
import { SessionQueryDTO } from "../../../dtos/nutritionist/session-query.dto";
import { FilterQuery, SortOrder } from "mongoose";
import { PopulatedSession } from "../../../types/session.populated";

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
      .sort({
        scheduledAt: -1,
      });
  }

  async findByNutritionistPaginated(
    nutritionistId: string,
    query: SessionQueryDTO,
  ): Promise<{
    data: ISession[];
    total: number;
  }> {
    const {
      page,
      limit,
      search,
      status,
      type,
      sortBy = "scheduledAt",
      sortOrder = "desc",
    } = query;
    const skip = (page - 1) * limit;
    const filter: FilterQuery<ISession> = {
      nutritionistId,
      isDeleted: false,
    };
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }
    if (status) {
      filter.status = status;
    }
    if (type) {
      filter.type = type;
    }
    const sort: Record<string, SortOrder> = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };
    const [data, total] = await Promise.all([
      this._model.find(filter).sort(sort).skip(skip).limit(limit),
      this._model.countDocuments(filter),
    ]);
    return {
      data,
      total,
    };
  }

  async getAllPublicSessions(
    page = 1,
    limit = 10,
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
  }> {
    const skip = (page - 1) * limit;
    const {
      status,
      type,
      search,
      sortBy = "scheduledAt",
      sortOrder = "asc",
    } = filters || {};
    const query: Record<string, unknown> = {
      isDeleted: false,

      status: {
        $in: [SessionStatus.SCHEDULED, SessionStatus.LIVE],
      },
    };
    if (status) {
      query.status = status;
    }
    if (type) {
      query.type = type;
    }
    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }
    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };
    const [data, total] = await Promise.all([
      this._model.find(query).sort(sort).skip(skip).limit(limit).lean(),
      this._model.countDocuments(query),
    ]);
    return {
      data,
      total,
    };
  }

  async findUpcoming(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: ISession[];
    total: number;
  }> {
    const skip = (page - 1) * limit;

    const query = {
      scheduledAt: {
        $gte: new Date(),
      },
      status: SessionStatus.SCHEDULED,
      isDeleted: false,
    };

    const [data, total] = await Promise.all([
      this._model
        .find(query)
        .sort({
          scheduledAt: 1,
        })
        .skip(skip)
        .limit(limit),

      this._model.countDocuments(query),
    ]);

    return {
      data,
      total,
    };
  }

  async findLiveSessions(): Promise<ISession[]> {
    return this._model.find({
      status: SessionStatus.LIVE,
      isDeleted: false,
    });
  }

  async getUserSessionById(
    sessionId: string,
  ): Promise<PopulatedSession | null> {
    return this._model
      .findOne({
        _id: sessionId,
        isDeleted: false,
      })
      .populate("nutritionistId", "fullName email")
      .lean<PopulatedSession | null>();
  }

  async getSessionById(sessionId: string): Promise<ISession | null> {
    return this._model.findOne({ _id: sessionId, isDeleted: false });
  }

  async findByRoomId(roomId: string): Promise<ISession | null> {
    return this._model.findOne({
      roomId,
      isDeleted: false,
    });
  }

  async updateStatus(
    sessionId: string,
    status: SessionStatus,
  ): Promise<ISession | null> {
    return this._model.findByIdAndUpdate(
      sessionId,
      {
        status,
      },
      {
        new: true,
      },
    );
  }

  async markDeleted(sessionId: string): Promise<ISession | null> {
    return this._model.findByIdAndUpdate(
      sessionId,
      {
        isDeleted: true,
      },
      {
        new: true,
      },
    );
  }
}
