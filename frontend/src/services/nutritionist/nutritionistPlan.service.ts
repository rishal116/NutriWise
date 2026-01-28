import { api } from "@/lib/axios/api";

export const nutritionistPlanService = {
  getPlans: async () => {
    return api.get("/nutritionist/plans");
  },

  getspecializations: async () => {
    const response = await api.get("/nutritionist/specializations");
    return response.data;
  },

  getPricingRules: async () => {
    const response = await api.get("/nutritionist/pricing");
    return response.data;
  },

  savePlan: async (payload: any) => {
    return api.post("/nutritionist/plans", payload);
  },

  getPlanById: async (planId: string) => {
    return api.get(`/nutritionist/plans/${planId}`);
  },
};
