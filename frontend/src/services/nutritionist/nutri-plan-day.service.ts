import { clientApi } from "@/lib/axios/clientApi";
import { NUTRITIONIST_PLAN_ROUTES } from "@/routes/nutritionist";

import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import type { NutritionistPlanDayListQueryDTO } from "@/dtos/nutritionist/plan-day/nutritionist-plan-day-list-query.dto";
import type { NutritionistPlanDayListItemDTO } from "@/dtos/nutritionist/plan-day/nutritionist-plan-day-list-item.dto";
import type { NutritionistPlanDayDetailsDTO } from "@/dtos/nutritionist/plan-day/nutritionist-plan-day-details.dto";

import type {
  CreateNutritionistPlanDayDTO,
  UpdateNutritionistPlanDayDTO,
} from "@/dtos/nutritionist/plan-day/nutritionist-plan-day-request.dto";

export const nutritionistPlanDayService = {
  async getPlanDays(
    planId: string,
    query?: NutritionistPlanDayListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutritionistPlanDayListItemDTO>> {
    const response = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<NutritionistPlanDayListItemDTO>>
    >(NUTRITIONIST_PLAN_ROUTES.DAYS(planId), {
      params: query,
    });

    if (!response.data.data) {
      throw new Error("Plan days response data is missing");
    }

    return response.data.data;
  },

  async getPlanDayDetails(
    planId: string,
    dayNumber: number,
  ): Promise<NutritionistPlanDayDetailsDTO> {
    const response = await clientApi.get<
      ApiResponseDTO<NutritionistPlanDayDetailsDTO>
    >(NUTRITIONIST_PLAN_ROUTES.DAY_BY_NUMBER(planId, dayNumber));

    if (!response.data.data) {
      throw new Error("Plan day response data is missing");
    }

    return response.data.data;
  },

  async createPlanDay(
    planId: string,
    payload: CreateNutritionistPlanDayDTO,
  ): Promise<void> {
    await clientApi.post<ApiResponseDTO<void>>(
      NUTRITIONIST_PLAN_ROUTES.DAYS(planId),
      payload,
    );
  },

  async updatePlanDay(
    planId: string,
    dayNumber: number,
    payload: UpdateNutritionistPlanDayDTO,
  ): Promise<void> {
    await clientApi.put<ApiResponseDTO<void>>(
      NUTRITIONIST_PLAN_ROUTES.DAY_BY_NUMBER(planId, dayNumber),
      payload,
    );
  },
};
