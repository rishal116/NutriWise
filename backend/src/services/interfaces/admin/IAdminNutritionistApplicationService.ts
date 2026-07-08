import { ApplicationStatus } from "../../../types/nutritionist.types";
import { AdminNutritionistApplicationListItemDto } from "../../../dtos/admin/nutritionistApplication/admin-nutritionist-application-list-item.dto";
import { AdminNutritionistApplicationListQueryDto } from "../../../dtos/admin/nutritionistApplication/admin-nutritionist-application-list-query.dto";

export interface IAdminNutritionistApplicationService {
  getApplications(
    query: AdminNutritionistApplicationListQueryDto,
  ): Promise<{
    data: AdminNutritionistApplicationListItemDto[];
    total: number;
    skip: number;
    limit: number;
    hasMore: boolean;
  }>;

  updateApplicationStatus(
    userId: string,
    status: ApplicationStatus,
    rejectionReason?: string,
  ): Promise<void>;
}