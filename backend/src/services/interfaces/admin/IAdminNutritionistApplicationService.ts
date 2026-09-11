import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import { AdminNutritionistApplicationListQueryDto } from "../../../dtos/admin/nutritionistApplication/admin-nutritionist-application-list-query.dto";

import { AdminNutritionistApplicationListItemDto } from "../../../dtos/admin/nutritionistApplication/admin-nutritionist-application-list-item.dto";

import { ApplicationStatus } from "../../../types/nutritionist.types";

export interface IAdminNutritionistApplicationService {
  getApplications(
    query: AdminNutritionistApplicationListQueryDto,
  ): Promise<
    InfiniteScrollResponseDTO<AdminNutritionistApplicationListItemDto>
  >;

  updateApplicationStatus(
    userId: string,
    status: ApplicationStatus,
    rejectionReason?: string,
  ): Promise<void>;
}
