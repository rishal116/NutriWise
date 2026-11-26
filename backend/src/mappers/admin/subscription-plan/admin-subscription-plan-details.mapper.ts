import type { ISubscriptionPlan } from "../../../models/subscriptionPlan.model";
import type { AdminSubscriptionPlanDetailsDTO } from "../../../dtos/admin/subscription-plan/admin-subscription-plan-details.dto";

export const toAdminSubscriptionPlanDetailsDTO = (
  plan: ISubscriptionPlan,
): AdminSubscriptionPlanDetailsDTO => ({
  id: plan._id.toString(),
  name: plan.name,
  slug: plan.slug,
  description: plan.description,
  audience: plan.audience,
  billing: {
    amount: plan.billing.amount,
    currency: plan.billing.currency,
    interval: plan.billing.interval,
  },
  features: plan.features.map((feature) => ({
    key: feature.key,
    enabled: feature.enabled,
  })),
  providerReferences: {
    stripePriceId: plan.providerReferences.stripePriceId,
  },
  status: plan.status,
  createdAt: plan.createdAt,
  updatedAt: plan.updatedAt,
});