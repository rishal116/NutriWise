import { api } from "@/lib/axios/api";

export const nutritionistPlanService = {
  getPlans: async () => api.get("/nutritionist/plans"),

  getPlanById: async (planId: string) =>
    api.get(`/nutritionist/plans/${planId}`),

  // ✅ Create Plan (JSON)
  savePlan: async (data: any) =>
    api.post("/nutritionist/plans", data),

  // ✅ Update Plan (JSON)
  updatePlan: async (planId: string, data: any) =>
    api.put(`/nutritionist/plans/${planId}`, data),

  getAllowedCategories: async () => {
    const res = await api.get("/nutritionist/allowed-plan-categories");
    return res.data;
  },

  getPricingRules: async () => {
    const res = await api.get("/nutritionist/pricing");
    return res.data;
  },
};