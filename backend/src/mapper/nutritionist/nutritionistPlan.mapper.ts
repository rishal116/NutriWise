import { INutritionistProfile } from "../../models/nutritionistProfile.model";
import { PlanDTO } from "../../dtos/nutritionist/nutritionsitPlan.dto";
import { IPlan } from "../../models/nutritionistPlan.model";



export function toPlanDTO(plan: IPlan): PlanDTO {
  return {
    _id: plan._id.toString(),
    nutritionistId: plan.nutritionistId.toString(),
    title: plan.title,
    category: plan.category,
    durationInDays: plan.durationInDays,
    price: plan.price,
    description: plan.description,
    features: plan.features || [],
    status: plan.status,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  };
}

import { NutritionistPricingDTO } from "../../dtos/nutritionist/nutritionsitPlan.dto";

export const toNutritionistPricingDTO = (
  status: string,
  minPrice: number,
  maxPrice: number
): NutritionistPricingDTO => ({
  status,
  minPrice,
  maxPrice,
});