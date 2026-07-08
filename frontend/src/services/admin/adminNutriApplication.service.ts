import { clientApi } from "@/lib/axios/clientApi";
import { AdminRoutes } from "@/routes/admin.routes";

import { InfiniteScrollResponseDto } from "@/dtos/common/infinite-scroll-response.dto";
import { AdminNutritionistApplicationListQueryDto } from "@/dtos/admin/nutritionistApplication/admin-nutritionist-application-list-query.dto";
import { AdminNutritionistApplicationListItemDto } from "@/dtos/admin/nutritionistApplication/admin-nutritionist-application-list-item.dto";
import { ApplicationStatus } from "@/types/nutritionist.types";

export const adminNutritionistApplicationService = {
  async getApplications(
    query: AdminNutritionistApplicationListQueryDto,
  ): Promise<
    InfiniteScrollResponseDto<AdminNutritionistApplicationListItemDto>
  > {
    const response = await clientApi.get<
      InfiniteScrollResponseDto<AdminNutritionistApplicationListItemDto>
    >(AdminRoutes.NUTRITIONIST_APPLICATIONS, {
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
      `${AdminRoutes.NUTRITIONIST_APPLICATIONS}/${userId}/status`,
      {
        status,
        rejectionReason,
      },
    );
  },
};
