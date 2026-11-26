import { clientApi } from "@/lib/axios/clientApi";

import { ADMIN_SUBSCRIPTION_PLAN_ROUTES } from "@/routes/admin";

import type { AdminSubscriptionPlanListQueryDTO } from "@/dtos/admin/subscription-plan/admin-subscription-plan-list-query.dto";
import type { AdminSubscriptionPlanCardDTO } from "@/dtos/admin/subscription-plan/admin-subscription-plan-card.dto";
import type { AdminSubscriptionPlanDetailsDTO } from "@/dtos/admin/subscription-plan/admin-subscription-plan-details.dto";
import type { CreateSubscriptionPlanDTO } from "@/dtos/admin/subscription-plan/create-subscription-plan.dto";
import type { UpdateSubscriptionPlanDTO } from "@/dtos/admin/subscription-plan/update-subscription-plan.dto";

import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const adminSubscriptionPlanService = {
  async createPlan(data: CreateSubscriptionPlanDTO): Promise<ApiResponseDTO> {
    const response = await clientApi.post<ApiResponseDTO>(
      ADMIN_SUBSCRIPTION_PLAN_ROUTES.SUBSCRIPTION_PLANS,
      data,
    );

    return response.data;
  },

  async browsePlans(
    query?: AdminSubscriptionPlanListQueryDTO,
  ): Promise<
    ApiResponseDTO<InfiniteScrollResponseDTO<AdminSubscriptionPlanCardDTO>>
  > {
    const response = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<AdminSubscriptionPlanCardDTO>>
    >(ADMIN_SUBSCRIPTION_PLAN_ROUTES.SUBSCRIPTION_PLANS, {
      params: query,
    });

    return response.data;
  },

  async getPlanDetails(
    planId: string,
  ): Promise<ApiResponseDTO<AdminSubscriptionPlanDetailsDTO>> {
    const response = await clientApi.get<
      ApiResponseDTO<AdminSubscriptionPlanDetailsDTO>
    >(ADMIN_SUBSCRIPTION_PLAN_ROUTES.SUBSCRIPTION_PLAN_DETAILS(planId));

    return response.data;
  },

  async updatePlan(
    planId: string,
    data: UpdateSubscriptionPlanDTO,
  ): Promise<ApiResponseDTO> {
    const response = await clientApi.patch<ApiResponseDTO>(
      ADMIN_SUBSCRIPTION_PLAN_ROUTES.SUBSCRIPTION_PLAN_DETAILS(planId),
      data,
    );

    return response.data;
  },

  async publishPlan(planId: string): Promise<ApiResponseDTO> {
    const response = await clientApi.patch<ApiResponseDTO>(
      ADMIN_SUBSCRIPTION_PLAN_ROUTES.PUBLISH_SUBSCRIPTION_PLAN(planId),
    );

    return response.data;
  },

  async archivePlan(planId: string): Promise<ApiResponseDTO> {
    const response = await clientApi.patch<ApiResponseDTO>(
      ADMIN_SUBSCRIPTION_PLAN_ROUTES.ARCHIVE_SUBSCRIPTION_PLAN(planId),
    );

    return response.data;
  },
};
