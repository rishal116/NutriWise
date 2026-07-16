import { FilterQuery } from "mongoose";

import { IBaseRepository } from "../common/IBaseRepository";

import { INutritionistPlan } from "../../../models/nutritionistPlan.model";
import { GetPlansDTO } from "../../../dtos/nutritionist/plan/get-plans.dto";

export interface INutritionistPlanRepository extends IBaseRepository<INutritionistPlan> {
  findByNutritionistId(
    nutritionistId: string,
    query: GetPlansDTO,
  ): Promise<{
    items: INutritionistPlan[];
    nextCursor: string | null;
    hasMore: boolean;
  }>;

  findMany(
    filter: FilterQuery<INutritionistPlan>,
  ): Promise<INutritionistPlan[]>;
}
