import { api } from "@/lib/axios/api";

export const nutritionistPlanService = {
  getPlans: async () => {
    return api.get("/nutritionist/plans");
  },

  getPlanById: async (planId: string) => {
    return api.get(`/nutritionist/plans/${planId}`);
  },

  savePlan: async (payload: any) => {
    return api.post("/nutritionist/plans", payload);
  },

  updatePlan: async (planId: string, payload: any) => {
    return api.put(`/nutritionist/plans/${planId}`, payload);
  },

  getAllowedCategories: async () => {
    const response = await api.get("/nutritionist/allowed-plan-categories");

    
    return response.data;
  },

  getPricingRules: async () => {
    const response = await api.get("/nutritionist/pricing");
  
    
    return response.data;
  },
};
