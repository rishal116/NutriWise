import { FilterQuery, Types } from "mongoose";

import { IBaseRepository } from "../../common/IBaseRepository";
import { IUserPlan } from "../../../../models/userPlan.model";
import { IUserPlanPopulated } from "../../../../types/userPlan.populated";

export interface IUserPlanRepository extends IBaseRepository<IUserPlan> {
  findByUserId(userId: string | Types.ObjectId): Promise<IUserPlanPopulated[]>;

  findByNutritionistId(
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserPlanPopulated[]>;

  findOnePopulated(
    filter: FilterQuery<IUserPlan>,
  ): Promise<IUserPlanPopulated | null>;
}
