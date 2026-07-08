import { clientApi } from "@/lib/axios/clientApi";

export const userPlanService = {
  getMyPlans: async () => {
    const res = await clientApi.get("/plans");
    return res.data;
  },

  getPlanById: async (planId: string) => {
    const res = await clientApi.get(`/plans/${planId}`);
    return res.data;
  },
};
