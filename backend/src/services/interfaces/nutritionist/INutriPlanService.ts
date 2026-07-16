import { CreatePlanDTO } from "../../../dtos/nutritionist/plan/create-plan.dto";
import { PlanDTO } from "../../../dtos/nutritionist/plan/plan.dto";
import { UpdatePlanDTO } from "../../../dtos/nutritionist/plan/update-plan.dto";
import { PlanMetadataDTO } from "../../../dtos/nutritionist/plan/plan-metadata.dto";
import { GetPlansDTO } from "../../../dtos/nutritionist/plan/get-plans.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

export interface INutritionistPlanService {
  createPlan(nutritionistId: string, dto: CreatePlanDTO): Promise<PlanDTO>;

  updatePlan(
    nutritionistId: string,
    planId: string,
    dto: UpdatePlanDTO,
  ): Promise<PlanDTO>;

  getPlansByNutritionist(
    nutritionistId: string,
    query: GetPlansDTO,
  ): Promise<InfiniteScrollResponseDTO<PlanDTO>>;

  getPlanById(nutritionistId: string, planId: string): Promise<PlanDTO>;

  getPlanMetadata(nutritionistId: string): Promise<PlanMetadataDTO>;
}
