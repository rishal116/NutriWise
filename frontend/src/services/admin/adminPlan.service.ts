import { clientApi } from "@/lib/axios/clientApi";

import { ADMIN_PLAN_ROUTES } from "@/routes/admin";

import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import type { AdminPlanListItemDTO } from "@/dtos/admin/plan/admin-plan-list-item.dto";

import type { AdminPlanListQueryDTO } from "@/dtos/admin/plan/admin-plan-list-query.dto";

export const adminPlanService = {
  async listPlans(
    query: AdminPlanListQueryDTO,
  ): Promise<ApiResponseDTO<InfiniteScrollResponseDTO<AdminPlanListItemDTO>>> {
    const response = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<AdminPlanListItemDTO>>
    >(ADMIN_PLAN_ROUTES.LIST, {
      params: query,
    });

    return response.data;
  },

  async archivePlan(
    planId: string,
  ): Promise<ApiResponseDTO<AdminPlanListItemDTO>> {
    const response = await clientApi.patch<
      ApiResponseDTO<AdminPlanListItemDTO>
    >(ADMIN_PLAN_ROUTES.ARCHIVE(planId));

    return response.data;
  },
};
