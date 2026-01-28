import { api } from "@/lib/axios/api";

export const userPlanService = {
  getMyPlans: async () => {
    const res = await api.get("/plans");
    return res.data;
  },
};
