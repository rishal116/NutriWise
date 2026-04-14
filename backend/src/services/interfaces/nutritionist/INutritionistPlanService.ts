import { IPlan } from "../../../models/nutritionistPlan.model";
import { UpdatePlanDTO, CreatePlanDTO, PlanDTO, NutritionistPricingDTO, GetAllowedPlanCategoriesDTO } from "../../../dtos/nutritionist/nutritionsitPlan.dto";

export interface INutritionistPlanService {
  createPlan(nutritionistId: string,dto: CreatePlanDTO): Promise<{ message: string }>;
  updatePlan(nutritionistId: string, planId: string, data: UpdatePlanDTO): Promise<IPlan>;
  getPlansByNutritionist(nutritionistId: string): Promise<PlanDTO[]>;
  getAllowedPlanCategories(nutritionistId: string): Promise<GetAllowedPlanCategoriesDTO>;
  getNutritionistPricing(nutritionistId: string): Promise<NutritionistPricingDTO>;
  getPlanById(nutritionistId: string, planId: string): Promise<PlanDTO>;
}
