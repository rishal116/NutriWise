import { injectable } from "inversify";
import { Types } from "mongoose";
import { BaseRepository } from "../../common/base.repository";
import {
  AIInsightPriority,
  AIInsightStatus,
  AIInsightType,
  IUserAIInsight,
  UserAIInsightModel,
} from "../../../../models/userAIInsight.model";
import { IUserAIInsightRepository } from "../../../interfaces/user/tracking/IUserAIInsightRepository";

@injectable()
export class UserAIInsightRepository
  extends BaseRepository<IUserAIInsight>
  implements IUserAIInsightRepository
{
  constructor() {
    super(UserAIInsightModel);
  }

  async findByUser(userId: string | Types.ObjectId): Promise<IUserAIInsight[]> {
    return this._model
      .find({
        userId,
        isArchived: false,
      })
      .sort({
        generatedAt: -1,
      })
      .lean<IUserAIInsight[]>();
  }

  async findByUserProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserAIInsight[]> {
    return this._model
      .find({
        userProgramId,
        isArchived: false,
      })
      .sort({
        generatedAt: -1,
      })
      .lean<IUserAIInsight[]>();
  }

  async findUnreadByUser(
    userId: string | Types.ObjectId,
  ): Promise<IUserAIInsight[]> {
    return this._model
      .find({
        userId,
        status: AIInsightStatus.UNREAD,
        isArchived: false,
      })
      .sort({
        generatedAt: -1,
      })
      .lean<IUserAIInsight[]>();
  }

  async findByType(
    userId: string | Types.ObjectId,
    type: AIInsightType,
  ): Promise<IUserAIInsight[]> {
    return this._model
      .find({
        userId,
        type,
        isArchived: false,
      })
      .sort({
        generatedAt: -1,
      })
      .lean<IUserAIInsight[]>();
  }

  async findByPriority(
    userId: string | Types.ObjectId,
    priority: AIInsightPriority,
  ): Promise<IUserAIInsight[]> {
    return this._model
      .find({
        userId,
        priority,
        isArchived: false,
      })
      .sort({
        generatedAt: -1,
      })
      .lean<IUserAIInsight[]>();
  }

  async updateStatus(
    id: string | Types.ObjectId,
    status: AIInsightStatus,
  ): Promise<IUserAIInsight | null> {
    return this._model
      .findByIdAndUpdate(
        id,
        { status },
        {
          new: true,
          runValidators: true,
        },
      )
      .lean<IUserAIInsight | null>();
  }

  async archive(id: string | Types.ObjectId): Promise<IUserAIInsight | null> {
    return this._model
      .findByIdAndUpdate(
        id,
        {
          isArchived: true,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .lean<IUserAIInsight | null>();
  }
}
