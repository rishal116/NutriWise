import { Types } from "mongoose";

import type { CreatePlanDTO } from "../../../dtos/nutritionist/plan/create-plan.dto";
import type { UpdatePlanDTO } from "../../../dtos/nutritionist/plan/update-plan.dto";
import type { INutritionistPlan } from "../../../models/nutritionistPlan.model";

export const toNutritionistPlanModel = (
  nutritionistId: string,
  dto: CreatePlanDTO,
  slug: string,
): Partial<INutritionistPlan> => ({
  nutritionistId: new Types.ObjectId(nutritionistId),
  slug,
  title: dto.title,
  specialization: dto.specialization,
  description: dto.description,
  durationDays: dto.durationDays,
  price: dto.price,
  features: dto.features,
  status: "draft",
});

export const toNutritionistPlanUpdateModel = (
  dto: UpdatePlanDTO,
): Partial<INutritionistPlan> => ({
  ...(dto.title !== undefined && { title: dto.title }),
  ...(dto.specialization !== undefined && {
    specialization: dto.specialization,
  }),
  ...(dto.description !== undefined && {
    description: dto.description,
  }),
  ...(dto.durationDays !== undefined && {
    durationDays: dto.durationDays,
  }),
  ...(dto.price !== undefined && {
    price: dto.price,
  }),
  ...(dto.features !== undefined && {
    features: dto.features,
  }),
});
