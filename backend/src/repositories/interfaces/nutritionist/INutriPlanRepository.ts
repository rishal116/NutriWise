import type { IBaseRepository } from "../common/IBaseRepository";
import type { INutritionistPlan } from "../../../models/nutritionistPlan.model";
import type { GetPlansDTO } from "../../../dtos/nutritionist/plan/get-plans.dto";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

export interface INutritionistPlanRepository extends IBaseRepository<INutritionistPlan> {
  findByNutritionistId(
    nutritionistId: string,
    query: GetPlansDTO,
  ): Promise<CursorPaginationResult<INutritionistPlan>>;

  findDetailsById(
    planId: string,
    nutritionistId: string,
  ): Promise<INutritionistPlan | null>;
}
