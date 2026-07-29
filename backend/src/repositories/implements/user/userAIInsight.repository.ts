import { injectable } from "inversify";
import { Types } from "mongoose";

import { BaseRepository } from "../common/base.repository";

import {
  IUserAIInsight,
  UserAIInsightModel,
  AIInsightPriority,
  AIInsightType,
} from "../../../models/userAIInsight.model";

import { IUserAIInsightRepository } from "../../interfaces/user/IUserAIInsightRepository";

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
      })
      .sort({
        generatedAt: -1,
      })
      .lean<IUserAIInsight[]>();
  }

  async findByProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserAIInsight[]> {
    return this._model
      .find({
        userProgramId,
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
        isRead: false,
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
      })
      .sort({
        generatedAt: -1,
      })
      .lean<IUserAIInsight[]>();
  }

  async markAsRead(
    id: string | Types.ObjectId,
  ): Promise<IUserAIInsight | null> {
    return this._model
      .findByIdAndUpdate(
        id,
        {
          isRead: true,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .lean<IUserAIInsight | null>();
  }

  async updateInsight(
    id: string | Types.ObjectId,
    update: Partial<IUserAIInsight>,
  ): Promise<IUserAIInsight | null> {
    return this._model
      .findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      })
      .lean<IUserAIInsight | null>();
  }
}
