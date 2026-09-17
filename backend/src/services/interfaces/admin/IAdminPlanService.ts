import type { AdminPlanListItemDTO } from "../../../dtos/admin/plan/admin-plan-list-item.dto";
import type { AdminPlanListQueryDTO } from "../../../dtos/admin/plan/admin-plan-list-query.dto";
import type { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

export interface IAdminPlanService {
  browsePlans(
    query: AdminPlanListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<AdminPlanListItemDTO>>;

  archivePlan(planId: string): Promise<AdminPlanListItemDTO>;
}
