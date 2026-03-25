import { IPlan } from "../../models/nutritionistPlan.model";
import { NutritionistPlanDTO } from "../../dtos/user/nutritionistUser.dto";

export const toNutritionistPlanDTO = (plan: IPlan): NutritionistPlanDTO => {
  return {
    id: plan._id.toString(),
    nutritionistId: plan.nutritionistId.toString(), 
    title: plan.title,
    category: plan.category,
    durationInDays: plan.durationInDays,
    price: plan.price,
    description: plan.description,
    features: plan.features ?? [],
    tags: plan.tags ?? [], 
    status: plan.status,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  };
};