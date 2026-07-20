import {
  PlanCurrency,
  PlanStatus,
} from "../../../models/nutritionistPlan.model";

import { Specialization } from "../../../types/nutritionist.types";

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
