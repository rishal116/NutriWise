import type { AdminSubscriptionPlanCardDTO } from "../../../dtos/admin/subscription-plan/admin-subscription-plan-card.dto";
import type { AdminSubscriptionPlanListItem } from "../../../types/admin/subscription-plan/admin-subscription-plan-list-item.type";

export const toAdminSubscriptionPlanCardDTO = (
  plan: AdminSubscriptionPlanListItem,
): AdminSubscriptionPlanCardDTO => ({
  id: plan.id,
  name: plan.name,
  slug: plan.slug,
  description: plan.description,
  audience: plan.audience,
  billing: {
    amount: plan.billing.amount,
    currency: plan.billing.currency,
    interval: plan.billing.interval,
  },
  featureCount: plan.featureCount,
  status: plan.status,
});
