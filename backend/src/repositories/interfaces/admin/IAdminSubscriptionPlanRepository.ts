import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import type { AdminSubscriptionPlanListQueryDTO } from "../../../dtos/admin/subscription-plan/admin-subscription-plan-list-query.dto";
import type { IBaseRepository } from "../common/IBaseRepository";
import type { ISubscriptionPlan } from "../../../models/subscriptionPlan.model";
import type { AdminSubscriptionPlanListItem } from "../../../types/admin/subscription-plan/admin-subscription-plan-list-item.type";

export interface IAdminSubscriptionPlanRepository extends IBaseRepository<ISubscriptionPlan> {
  findPlans(
    query: AdminSubscriptionPlanListQueryDTO,
  ): Promise<CursorPaginationResult<AdminSubscriptionPlanListItem>>;
}
