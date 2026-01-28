import { IUserPlan } from "../../../models/userPlan.model";
import { IUserPlanPopulated } from "../../../types/userPlan.populated";

export interface IUserPlanRepository {
  create(data: Partial<IUserPlan>): Promise<IUserPlan>;
  findBySessionId(sessionId: string): Promise<IUserPlan | null>;
  findActiveByUser(userId: string): Promise<IUserPlan | null>;
  expireById(id: string): Promise<void>;
  findByUserId(userId: string): Promise<IUserPlanPopulated[]>;
  findByNutritionistId(nutritionistId: string): Promise<IUserPlanPopulated[]>;
  
}
