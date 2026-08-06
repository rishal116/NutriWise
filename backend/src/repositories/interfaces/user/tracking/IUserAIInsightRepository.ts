import { Types } from "mongoose";
import { IBaseRepository } from "../../common/IBaseRepository";
import {
  IUserAIInsight,
  AIInsightPriority,
  AIInsightType,
  AIInsightStatus,
} from "../../../../models/userAIInsight.model";

export interface IUserAIInsightRepository extends IBaseRepository<IUserAIInsight> {
  findByUser(userId: string | Types.ObjectId): Promise<IUserAIInsight[]>;

  findByUserProgram(
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

  updateStatus(
    id: string | Types.ObjectId,
    status: AIInsightStatus,
  ): Promise<IUserAIInsight | null>;

  archive(id: string | Types.ObjectId): Promise<IUserAIInsight | null>;
}
