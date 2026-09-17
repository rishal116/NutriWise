import type { AdminPlanListQueryDTO } from "../../../dtos/admin/plan/admin-plan-list-query.dto";
import type { IAdminPlanListProjection } from "../../../types/admin/plan/admin-plan-list.projection";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

export interface IAdminPlanRepository {
  findPlans(
    query: AdminPlanListQueryDTO,
  ): Promise<CursorPaginationResult<IAdminPlanListProjection>>;

  archivePlan(
    planId: string,
  ): Promise<IAdminPlanListProjection | null>;
}