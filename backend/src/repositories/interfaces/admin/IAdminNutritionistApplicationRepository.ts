import { ApplicationStatus } from "../../../types/nutritionist.types";
import { AdminNutritionistApplicationListQueryDto } from "../../../dtos/admin/nutritionistApplication/admin-nutritionist-application-list-query.dto";
import { AdminNutritionistApplicationListItemDto } from "../../../dtos/admin/nutritionistApplication/admin-nutritionist-application-list-item.dto";

export interface IAdminNutritionistApplicationRepository {
  getApplications(
    query: AdminNutritionistApplicationListQueryDto,
  ): Promise<{
    applications: AdminNutritionistApplicationListItemDto[];
    total: number;
  }>;

  updateApplicationStatus(
    userId: string,
    status: ApplicationStatus,
    rejectionReason?: string,
  ): Promise<void>;
}