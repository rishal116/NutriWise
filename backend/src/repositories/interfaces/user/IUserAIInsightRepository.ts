import { Types } from "mongoose";

import { IBaseRepository } from "../common/IBaseRepository";

import {
  IUserAIInsight,
  AIInsightPriority,
  AIInsightType,
} from "../../../models/userAIInsight.model";

export interface IUserAIInsightRepository extends IBaseRepository<IUserAIInsight> {
  findByUser(userId: string | Types.ObjectId): Promise<IUserAIInsight[]>;

  findByProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserAIInsight[]>;

  findUnreadByUser(userId: string | Types.ObjectId): Promise<IUserAIInsight[]>;

  findByType(
    userId: string | Types.ObjectId,
    type: AIInsightType,
  ): Promise<IUserAIInsight[]>;

  findByPriority(
    userId: string | Types.ObjectId,
    priority: AIInsightPriority,
  ): Promise<IUserAIInsight[]>;

  markAsRead(id: string | Types.ObjectId): Promise<IUserAIInsight | null>;

  updateInsight(
    id: string | Types.ObjectId,
    update: Partial<IUserAIInsight>,
  ): Promise<IUserAIInsight | null>;
}
