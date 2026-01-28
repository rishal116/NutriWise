import { IPlan } from "../../../models/nutritionistPlan.model";
import { UpdatePlanDTO, CreatePlanDTO, PlanDTO, NutritionistPricingDTO, GetSpecializationsDTO } from "../../../dtos/nutritionist/nutritionsitPlan.dto";

export interface INutritionistPlanService {
  createPlan(nutritionistId: string, dto: CreatePlanDTO): Promise<{ message: string }>;
  updatePlan(nutritionistId: string, planId: string, data: UpdatePlanDTO): Promise<IPlan>;
  getPlansByNutritionist(nutritionistId: string): Promise<PlanDTO[]>;
  getSpecializations(nutritionistId: string): Promise<GetSpecializationsDTO>;
  getNutritionistPricing(nutritionistId: string): Promise<NutritionistPricingDTO>;
  getPlanById(nutritionistId: string, planId: string): Promise<PlanDTO>;
}
