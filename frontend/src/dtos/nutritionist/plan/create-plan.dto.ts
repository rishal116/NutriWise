import { PlanCurrency, PlanStatus } from "@/types/plan.types";
import { Specialization } from "@/types/nutritionist.types";

export interface CreatePlanDto {
  title: string;
  specialization: Specialization;
  description: string;
  durationDays: number;
  price: number;
  currency?: PlanCurrency;
  features: string[];
  status?: PlanStatus;
}