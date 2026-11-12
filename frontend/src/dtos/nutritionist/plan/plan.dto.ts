import type { PlanStatus } from "@/types/plan.types";
import type { Specialization } from "@/types/nutritionist.types";

export interface PlanDto {
  id: string;
  title: string;
  specialization: Specialization;
  description: string;
  durationDays: number;
  price: number;
  features: string[];
  status: PlanStatus;
  createdAt: string;
  updatedAt: string;
}
