import { clientApi } from "@/lib/axios/clientApi";

import { ADMIN_NUTRITIONIST_APPLICATION_ROUTES } from "@/routes/admin";

import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import { AdminNutritionistApplicationListQueryDto } from "@/dtos/admin/nutritionistApplication/admin-nutritionist-application-list-query.dto";

import { AdminNutritionistApplicationListItemDto } from "@/dtos/admin/nutritionistApplication/admin-nutritionist-application-list-item.dto";

import { ApplicationStatus } from "@/types/nutritionist.types";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const adminNutritionistApplicationService = {
  async getApplications(
    query: AdminNutritionistApplicationListQueryDto,
  ): Promise<
    ApiResponseDTO<
      InfiniteScrollResponseDTO<AdminNutritionistApplicationListItemDto>
    >
  > {
    const response = await clientApi.get<
      ApiResponseDTO<
        InfiniteScrollResponseDTO<AdminNutritionistApplicationListItemDto>
      >
    >(ADMIN_NUTRITIONIST_APPLICATION_ROUTES.APPLICATIONS, {
      params: query,
    });

    return response.data;
  },

  async updateApplicationStatus(
    userId: string,
    status: ApplicationStatus,
    rejectionReason?: string,
  ): Promise<void> {
    await clientApi.patch(
      ADMIN_NUTRITIONIST_APPLICATION_ROUTES.STATUS(userId),
      {
        status,
        rejectionReason,
      },
    );
  },
};
