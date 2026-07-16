import { clientApi } from "@/lib/axios/clientApi";
import { ApiResponse } from "@/types/api/apiResponse";
import { CreatePlanDto } from "@/dtos/nutritionist/plan/create-plan.dto";
import { UpdatePlanDto } from "@/dtos/nutritionist/plan/update-plan.dto";
import { PlanDto } from "@/dtos/nutritionist/plan/plan.dto";
import { PlanMetadataDto } from "@/dtos/nutritionist/plan/plan-metadata.dto";
import { GetPlansDto } from "@/dtos/nutritionist/plan/get-plans.dto";
import { NUTRITIONIST_PLAN_ROUTES } from "@/routes/nutritionist";
import { InfiniteScrollResponse } from "@/types/api/infiniteScroll";

export const nutritionistPlanService = {
  async getPlans(
    params?: GetPlansDto,
  ): Promise<InfiniteScrollResponse<PlanDto>> {
    const response = await clientApi.get<
      ApiResponse<InfiniteScrollResponse<PlanDto>>
    >(NUTRITIONIST_PLAN_ROUTES.BASE, {
      params,
    });

    return response.data.data;
  },

  async getPlanById(planId: string): Promise<PlanDto> {
    const response = await clientApi.get<ApiResponse<PlanDto>>(
      NUTRITIONIST_PLAN_ROUTES.BY_ID(planId),
    );

    return response.data.data;
  },

  async createPlan(payload: CreatePlanDto): Promise<PlanDto> {
    const response = await clientApi.post<ApiResponse<PlanDto>>(
      NUTRITIONIST_PLAN_ROUTES.BASE,
      payload,
    );

    return response.data.data;
  },

  async updatePlan(planId: string, payload: UpdatePlanDto): Promise<PlanDto> {
    const response = await clientApi.put<ApiResponse<PlanDto>>(
      NUTRITIONIST_PLAN_ROUTES.BY_ID(planId),
      payload,
    );

    return response.data.data;
  },

  async getPlanMetadata(): Promise<PlanMetadataDto> {
    const response = await clientApi.get<ApiResponse<PlanMetadataDto>>(
      NUTRITIONIST_PLAN_ROUTES.METADATA,
    );

    return response.data.data;
  },
};
