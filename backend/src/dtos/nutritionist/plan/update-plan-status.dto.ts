import { IsIn } from "class-validator";

export const PLAN_MANAGEABLE_STATUSES = ["published", "archived"] as const;

export type PlanManageableStatus = (typeof PLAN_MANAGEABLE_STATUSES)[number];

export class UpdatePlanStatusDTO {
  @IsIn(PLAN_MANAGEABLE_STATUSES)
  status!: PlanManageableStatus;
}
