import { clientApi } from "@/lib/axios/clientApi";

import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import type { CreatePlanDto } from "@/dtos/nutritionist/plan/create-plan.dto";
import type { UpdatePlanDto } from "@/dtos/nutritionist/plan/update-plan.dto";
import type { UpdatePlanStatusDto } from "@/dtos/nutritionist/plan/update-plan-status.dto";
import type { PlanDto } from "@/dtos/nutritionist/plan/plan.dto";
import type { PlanMetadataDto } from "@/dtos/nutritionist/plan/plan-metadata.dto";
import type { GetPlansDto } from "@/dtos/nutritionist/plan/get-plans.dto";

import { NUTRITIONIST_PLAN_ROUTES } from "@/routes/nutritionist";
import { NutritionistPlanListItemDto } from "@/dtos/nutritionist/plan/nutritionist-plan-list-item.dto";

export const nutritionistPlanService = {
  async getPlans(
    params?: GetPlansDto,
  ): Promise<InfiniteScrollResponseDTO<NutritionistPlanListItemDto>> {
    const response = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<NutritionistPlanListItemDto>>
    >(NUTRITIONIST_PLAN_ROUTES.BASE, { params });

    return response.data.data!;
  },

  async getPlanById(planId: string): Promise<PlanDto> {
    const response = await clientApi.get<ApiResponseDTO<PlanDto>>(
      NUTRITIONIST_PLAN_ROUTES.BY_ID(planId),
    );

    return response.data.data!;
  },

  async createPlan(payload: CreatePlanDto): Promise<PlanDto> {
    const response = await clientApi.post<ApiResponseDTO<PlanDto>>(
      NUTRITIONIST_PLAN_ROUTES.BASE,
      payload,
    );

    return response.data.data!;
  },

  async updatePlan(planId: string, payload: UpdatePlanDto): Promise<PlanDto> {
    const response = await clientApi.put<ApiResponseDTO<PlanDto>>(
      NUTRITIONIST_PLAN_ROUTES.BY_ID(planId),
      payload,
    );

    return response.data.data!;
  },

  async updatePlanStatus(
    planId: string,
    payload: UpdatePlanStatusDto,
  ): Promise<ApiResponseDTO> {
    const response = await clientApi.patch<ApiResponseDTO>(
      NUTRITIONIST_PLAN_ROUTES.STATUS(planId),
      payload,
    );

    return response.data;
  },

  async getPlanMetadata(): Promise<PlanMetadataDto> {
    const response = await clientApi.get<ApiResponseDTO<PlanMetadataDto>>(
      NUTRITIONIST_PLAN_ROUTES.METADATA,
    );

    return response.data.data!;
  },
};
