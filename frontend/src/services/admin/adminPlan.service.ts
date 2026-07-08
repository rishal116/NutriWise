import { api } from "@/lib/axios/clientApi";


export const adminPlanService = {
  getAllPlans: async () => {
    const res = await api.get("/admin/plans");
    return res.data;
  },

  publishPlan: async (planId: string) => {
    const res = await api.patch(`/admin/plans/${planId}/publish`);
    return res.data;
  },
};
