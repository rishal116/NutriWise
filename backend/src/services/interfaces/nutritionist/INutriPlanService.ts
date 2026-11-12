import type { CreatePlanDTO } from "../../../dtos/nutritionist/plan/create-plan.dto";
import type { PlanDTO } from "../../../dtos/nutritionist/plan/plan.dto";
import type { UpdatePlanDTO } from "../../../dtos/nutritionist/plan/update-plan.dto";
import type { PlanMetadataDTO } from "../../../dtos/nutritionist/plan/plan-metadata.dto";
import type { GetPlansDTO } from "../../../dtos/nutritionist/plan/get-plans.dto";
import type { NutritionistPlanListItemDTO } from "../../../dtos/nutritionist/plan/nutritionist-plan-list-item.dto";
import type { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { UpdatePlanStatusDTO } from "../../../dtos/nutritionist/plan/update-plan-status.dto";

export interface INutritionistPlanService {
  createPlan(nutritionistId: string, dto: CreatePlanDTO): Promise<void>;

  updatePlan(
    nutritionistId: string,
    planId: string,
    dto: UpdatePlanDTO,
  ): Promise<void>;

  updatePlanStatus(
    nutritionistId: string,
    planId: string,
    dto: UpdatePlanStatusDTO,
  ): Promise<void>;

  getNutritionistPlans(
    nutritionistId: string,
    query: GetPlansDTO,
  ): Promise<InfiniteScrollResponseDTO<NutritionistPlanListItemDTO>>;

  getPlanById(nutritionistId: string, planId: string): Promise<PlanDTO>;

  getPlanMetadata(nutritionistId: string): Promise<PlanMetadataDTO>;
}
