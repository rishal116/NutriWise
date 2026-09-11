import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

import { AdminNutritionistApplicationListQueryDto } from "../../../dtos/admin/nutritionistApplication/admin-nutritionist-application-list-query.dto";

import { AdminNutritionistApplicationListItemDto } from "../../../dtos/admin/nutritionistApplication/admin-nutritionist-application-list-item.dto";

import { IBaseRepository } from "../common/IBaseRepository";

import { INutritionistProfile } from "../../../models/nutritionistProfile.model";

import { ApplicationStatus } from "../../../types/nutritionist.types";

export interface IAdminNutritionistApplicationRepository extends IBaseRepository<INutritionistProfile> {
  getApplications(
    query: AdminNutritionistApplicationListQueryDto,
  ): Promise<CursorPaginationResult<AdminNutritionistApplicationListItemDto>>;

  updateApplicationStatus(
    userId: string,
    status: ApplicationStatus,
    rejectionReason?: string,
  ): Promise<void>;
}
