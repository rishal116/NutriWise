import { Specialization } from "@/types/nutritionist.types";
import { PlanCurrency, PlanStatus } from "@/types/plan.types";

export interface NutritionistPlanDTO {
  id: string;
  nutritionistId: string;

  slug: string;
  title: string;
  specialization: Specialization;
  description: string;

  durationDays: number;

  price: number;
  currency: PlanCurrency;

  features: string[];

  status: PlanStatus;

  createdAt: Date;
  updatedAt: Date;
}
