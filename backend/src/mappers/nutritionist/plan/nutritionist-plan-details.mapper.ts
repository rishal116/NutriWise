import type { PlanDTO } from "../../../dtos/nutritionist/plan/plan.dto";
import type { INutritionistPlan } from "../../../models/nutritionistPlan.model";

export const toPlanDTO = (plan: INutritionistPlan): PlanDTO => ({
  id: plan._id.toString(),
  title: plan.title,
  specialization: plan.specialization,
  description: plan.description,
  durationDays: plan.durationDays,
  price: plan.price,
  features: plan.features,
  status: plan.status,
  createdAt: plan.createdAt,
  updatedAt: plan.updatedAt,
});
