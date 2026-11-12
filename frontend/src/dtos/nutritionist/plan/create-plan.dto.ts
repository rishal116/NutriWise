import type { Specialization } from "@/types/nutritionist.types";

export interface CreatePlanDto {
  title: string;
  specialization: Specialization;
  description: string;
  durationDays: number;
  price: number;
  features: string[];
}
