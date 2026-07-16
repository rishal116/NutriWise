import { Types } from "mongoose";

import { CreatePlanDTO } from "../../../dtos/nutritionist/plan/create-plan.dto";
import { PlanDTO } from "../../../dtos/nutritionist/plan/plan.dto";

import { INutritionistPlan } from "../../../models/nutritionistPlan.model";
import { UpdatePlanDTO } from "../../../dtos/nutritionist/plan/update-plan.dto";

import { CoachLevel } from "../../../types/nutritionist.types";
import { NutritionistPricingDTO } from "../../../dtos/nutritionist/plan/nutritionist-pricing.dto";

export const toNutritionistPlanModel = (
  nutritionistId: string,
  dto: CreatePlanDTO,
): Partial<INutritionistPlan> => ({
  nutritionistId: new Types.ObjectId(nutritionistId),
  title: dto.title,
  specialization: dto.specialization,
  description: dto.description,
  durationDays: dto.durationDays,
  price: dto.price,
  currency: dto.currency ?? "INR",
  features: dto.features,
  status: dto.status ?? "draft",
});

export const toPlanDTO = (plan: INutritionistPlan): PlanDTO => ({
  id: plan._id.toString(),
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
  ...(dto.currency !== undefined && {
    currency: dto.currency,
  }),
  ...(dto.features !== undefined && {
    features: dto.features,
  }),
  ...(dto.status !== undefined && {
    status: dto.status,
  }),
});

export const toNutritionistPricingDTO = (
  coachLevel: CoachLevel,
  minPrice: number,
  maxPrice: number,
): NutritionistPricingDTO => ({
  coachLevel,
  minPrice,
  maxPrice,
});

