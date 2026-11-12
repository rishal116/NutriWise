import type { Types } from "mongoose";

import type { IBaseRepository } from "../common/IBaseRepository";
import type { INutritionistPlanDay } from "../../../models/nutritionistPlanDay.model";
import type { NutritionistPlanDayListQueryDTO } from "../../../dtos/nutritionist/plan-day/nutritionist-plan-day-list-query.dto";
import type {
  NutritionistPlanDayDetailsProjection,
  NutritionistPlanDayListProjection,
} from "../../../types/nutritionist/plan-day/nutritionist-plan-day.projection";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

export interface INutritionistPlanDayRepository extends IBaseRepository<INutritionistPlanDay> {
  countDaysByPlanIds(planIds: Types.ObjectId[]): Promise<Map<string, number>>;

  browsePlanDays(
    nutritionistId: string | Types.ObjectId,
    planId: string | Types.ObjectId,
    query: NutritionistPlanDayListQueryDTO,
  ): Promise<CursorPaginationResult<NutritionistPlanDayListProjection>>;

  findPlanDayDetails(
    nutritionistId: string | Types.ObjectId,
    planId: string | Types.ObjectId,
    dayNumber: number,
  ): Promise<NutritionistPlanDayDetailsProjection | null>;
}
