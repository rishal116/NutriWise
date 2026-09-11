import { NutritionistPlanDTO } from "../../../dtos/user/nutri-browsing/nutri-plan.dto";
import { INutritionistPlan } from "../../../models/nutritionistPlan.model";

export const toNutritionistPlanDTO = (
  plan: INutritionistPlan,
): NutritionistPlanDTO => ({
  id: plan._id.toString(),
  nutritionistId: plan.nutritionistId.toString(),

  slug: plan.slug,
  title: plan.title,
  specialization: plan.specialization,
  description: plan.description,

  durationDays: plan.durationDays,

  price: plan.price,
  currency: plan.currency,

  features: plan.features,

  status: plan.status,

  createdAt: plan.createdAt,
  updatedAt: plan.updatedAt,
});
