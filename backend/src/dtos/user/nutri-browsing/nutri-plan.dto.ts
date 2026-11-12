
import { Currency } from "../../../constants/common/currency.constants";
import { PlanStatus } from "../../../constants/nutritionist/plan/plan-status.constants";
import { Specialization } from "../../../constants/nutritionist/profile/specialization.constants";



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
