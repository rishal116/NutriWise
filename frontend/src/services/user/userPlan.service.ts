import { api } from "@/lib/axios/api";

export const userPlanService = {
  getMyPlans: async () => {
    const res = await api.get("/plans");
    return res.data;
  },

  getPlanById: async (planId: string) => {
    const res = await api.get(`/plans/${planId}`);
    return res.data;
  },
};
