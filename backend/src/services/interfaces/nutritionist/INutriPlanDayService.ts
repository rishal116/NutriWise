import type { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import type {
  CreateNutritionistPlanDayDTO,
  UpdateNutritionistPlanDayDTO,
} from "../../../dtos/nutritionist/plan-day/nutritionist-plan-day-request.dto";

import type { NutritionistPlanDayListQueryDTO } from "../../../dtos/nutritionist/plan-day/nutritionist-plan-day-list-query.dto";

import type { NutritionistPlanDayListItemDTO } from "../../../dtos/nutritionist/plan-day/nutritionist-plan-day-list-item.dto";

import type { NutritionistPlanDayDetailsDTO } from "../../../dtos/nutritionist/plan-day/nutritionist-plan-day-details.dto";

export interface INutritionistPlanDayService {
  createPlanDay(
    nutritionistId: string,
    planId: string,
    dto: CreateNutritionistPlanDayDTO,
  ): Promise<void>;

  updatePlanDay(
    nutritionistId: string,
    planId: string,
    dayNumber: number,
    dto: UpdateNutritionistPlanDayDTO,
  ): Promise<void>;

  browsePlanDays(
    nutritionistId: string,
    planId: string,
    query: NutritionistPlanDayListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutritionistPlanDayListItemDTO>>;

  getPlanDayDetails(
    nutritionistId: string,
    planId: string,
    dayNumber: number,
  ): Promise<NutritionistPlanDayDetailsDTO>;
}
