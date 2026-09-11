import { PlanStatus } from "../../../models/nutritionistPlan.model";
import { Currency } from "../../../constants/currency.constants";

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
  currency: Currency;

  features: string[];

  status: PlanStatus;

  createdAt: Date;
  updatedAt: Date;
}
