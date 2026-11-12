import type { PlanCurrency, PlanStatus } from "@/types/plan.types";
import type { Specialization } from "@/types/nutritionist.types";

export interface NutritionistPlanListItemDto {
  id: string;
  slug: string;
  title: string;
  specialization: Specialization;
  description: string;
  durationDays: number;
  price: number;
  currency: PlanCurrency;
  features: string[];
  status: PlanStatus;
  configuredDays: number;
  createdAt: string;
  updatedAt: string;
}
