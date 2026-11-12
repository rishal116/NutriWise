import type { Currency } from "../../../constants/common/currency.constants";
import type { Specialization } from "../../../constants/nutritionist/profile/specialization.constants";
import type { PlanStatus } from "../../../constants/nutritionist/plan/plan-status.constants";

export interface NutritionistPlanListItemDTO {
  id: string;
  slug: string;
  title: string;
  specialization: Specialization;
  description: string;
  durationDays: number;
  price: number;
  currency: Currency;
  features: string[];
  status: PlanStatus;
  configuredDays: number;
  createdAt: Date;
  updatedAt: Date;
}
