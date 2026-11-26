import type { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import type { AdminSubscriptionPlanListQueryDTO } from "../../../dtos/admin/subscription-plan/admin-subscription-plan-list-query.dto";
import type { AdminSubscriptionPlanCardDTO } from "../../../dtos/admin/subscription-plan/admin-subscription-plan-card.dto";
import type { CreateSubscriptionPlanDTO } from "../../../dtos/admin/subscription-plan/create-subscription-plan.dto";
import type { UpdateSubscriptionPlanDTO } from "../../../dtos/admin/subscription-plan/update-subscription-plan.dto";
import type { AdminSubscriptionPlanDetailsDTO } from "../../../dtos/admin/subscription-plan/admin-subscription-plan-details.dto";

export interface IAdminSubscriptionPlanService {
  createPlan(data: CreateSubscriptionPlanDTO): Promise<void>;

  browsePlans(
    query: AdminSubscriptionPlanListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<AdminSubscriptionPlanCardDTO>>;

  getPlan(planId: string): Promise<AdminSubscriptionPlanDetailsDTO>;

  updatePlan(planId: string, data: UpdateSubscriptionPlanDTO): Promise<void>;

  publishPlan(planId: string): Promise<void>;

  archivePlan(planId: string): Promise<void>;
}
