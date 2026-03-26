import { ClientSession, Types } from "mongoose";
import { IUserPlan } from "../../../models/userPlan.model";
import { IUserPlanPopulated } from "../../../types/userPlan.populated";

export interface IUserPlanRepository {
  create(data: Partial<IUserPlan>, session?: ClientSession): Promise<IUserPlan>;

  findBySessionId(sessionId: string): Promise<IUserPlan | null>;

  findActiveByUserAndNutritionist(
    userId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserPlan | null>;

  findLatestPlan(
    userId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserPlan | null>;

  findByUserId(userId: string | Types.ObjectId): Promise<IUserPlanPopulated[]>;

  findByNutritionistId(
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserPlanPopulated[]>;

  findOnePopulated(
    filter: Partial<IUserPlan>,
  ): Promise<IUserPlanPopulated | null>;

  expireById(
    id: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<void>;

  activatePlan(id: string | Types.ObjectId): Promise<IUserPlan | null>;

  activateUpcomingPlans(): Promise<any>;

  expireActivePlans(): Promise<any>;
}
