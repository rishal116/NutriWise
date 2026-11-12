import type { NutritionistPlanListItemDTO } from "../../../dtos/nutritionist/plan/nutritionist-plan-list-item.dto";
import { INutritionistPlan } from "../../../models/nutritionistPlan.model";

export const toNutritionistPlanListItemDTO = (
  plan: INutritionistPlan,
  configuredDays: number,
): NutritionistPlanListItemDTO => ({
  id: plan._id.toString(),
  slug: plan.slug,
  title: plan.title,
  specialization: plan.specialization,
  description: plan.description,
  durationDays: plan.durationDays,
  price: plan.price,
  currency: plan.currency,
  features: plan.features,
  status: plan.status,
  configuredDays,
  createdAt: plan.createdAt,
  updatedAt: plan.updatedAt,
});
