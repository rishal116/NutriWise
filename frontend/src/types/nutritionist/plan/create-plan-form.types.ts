
import type { Specialization } from "@/types/nutritionist.types";

export interface CreatePlanForm {
  title: string;
  specialization: Specialization | "";
  durationDays: string;
  price: string;
  description: string;
  features: string[];
}

export type CreatePlanFormErrors = Partial<
  Record<keyof CreatePlanForm, string>
>;

export interface PlanOption {
  id: string;
  label: string;
}

export interface PlanPriceLimits {
  min: number;
  maxPerDay: number;
}
