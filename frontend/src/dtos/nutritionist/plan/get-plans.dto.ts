import { PlanSort } from "@/types/plan.types";
import { Specialization } from "@/types/nutritionist.types";

export interface GetPlansDto {
  cursor?: string;
  limit?: number;
  search?: string;
  specialization?: Specialization;
  minPrice?: number;
  maxPrice?: number;
  sort?: PlanSort;
}
