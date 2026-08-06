import { NutritionistPlanDTO } from "../../../../dtos/user/nutri-browsing/nutri-plan.dto";

export interface INutritionistPlanBrowsingService {
  getPlans(username: string): Promise<NutritionistPlanDTO[]>;

  getPlanBySlug(slug: string): Promise<NutritionistPlanDTO>;
}
