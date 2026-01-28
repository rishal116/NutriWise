
import { PlanDTO } from "../../../dtos/nutritionist/nutritionsitPlan.dto";

export interface IAdminPlanService {
  getAllPlans(): Promise<PlanDTO[]>;
  publishPlan(planId: string): Promise<PlanDTO>;
}
