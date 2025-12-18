import { api } from "@/lib/axios/api";

export const nutritionistPlanService = {
  getPlans: async () => {
    return api.get("/nutritionist/plans");
  },
  
  savePlan: async (payload: any) => {
    return api.post("/nutritionist/plans", payload);
  },
};
