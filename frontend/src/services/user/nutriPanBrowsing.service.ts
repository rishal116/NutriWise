import { clientApi } from "@/lib/axios/clientApi";

import { NUTRITIONIST_PLAN_BROWSING_ROUTES } from "@/routes/user";

import { NutritionistPlanDTO } from "@/dtos/user/nutri-plan-browsing/nutri-plan.dto";

export const nutritionistPlanBrowsingService = {
  async getPlans(username: string): Promise<NutritionistPlanDTO[]> {
    const { data } = await clientApi.get(
      NUTRITIONIST_PLAN_BROWSING_ROUTES.LIST(username),
    );

    return data.data;
  },

  async getPlanBySlug(slug: string): Promise<NutritionistPlanDTO> {
    const { data } = await clientApi.get(
      NUTRITIONIST_PLAN_BROWSING_ROUTES.DETAILS(slug),
    );

    return data.data;
  },
};
