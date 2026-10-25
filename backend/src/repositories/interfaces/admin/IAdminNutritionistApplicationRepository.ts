import type { ApplicationStatus } from "../../../types/nutritionist.types";
import type { AdminNutritionistApplicationListQueryDto } from "../../../dtos/admin/nutritionistApplication/admin-nutritionist-application-list-query.dto";
import type { IAdminNutritionistApplicationListProjection } from "../../../types/admin/nutri-application/admin-nutritionist-application-list.projection";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

export interface IAdminNutritionistApplicationRepository {
  getApplications(
    query: AdminNutritionistApplicationListQueryDto,
  ): Promise<
    CursorPaginationResult<IAdminNutritionistApplicationListProjection>
  >;

  updateApplicationStatus(
    userId: string,
    status: ApplicationStatus,
    rejectionReason?: string,
  ): Promise<boolean>;
}
