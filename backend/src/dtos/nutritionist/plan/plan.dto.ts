import type { PlanStatus } from "../../../constants/nutritionist/plan/plan-status.constants";
import type { Specialization } from "../../../constants/nutritionist/profile/specialization.constants";

export class PlanDTO {
  id!: string;
  title!: string;
  specialization!: Specialization;
  description!: string;
  durationDays!: number;
  price!: number;
  features!: string[];
  status!: PlanStatus;
  createdAt!: Date;
  updatedAt!: Date;
}
