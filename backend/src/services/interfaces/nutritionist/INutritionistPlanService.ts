import { IPlan } from "../../../models/nutritionistPlan.model";
import { CreatePlanDto } from "../../../dtos/nutritionist/nutritionsitPlan.dto";
import { UpdatePlanDto } from "../../../dtos/nutritionist/nutritionsitPlan.dto";
import { PlanDTO } from "../../../dtos/nutritionist/nutritionsitPlan.dto";

export interface INutritionistPlanService {
  createPlan(nutritionistId: string, data: CreatePlanDto): Promise<IPlan>;
  updatePlan(nutritionistId: string, planId: string, data: UpdatePlanDto): Promise<IPlan>;
  getPlansByNutritionist(nutritionistId: string): Promise<PlanDTO[]>;
}
