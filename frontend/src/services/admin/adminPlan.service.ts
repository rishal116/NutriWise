import { clientApi } from "@/lib/axios/clientApi";

export const adminPlanService = {
  getAllPlans: async () => {
    const res = await clientApi.get("/admin/plans");
    return res.data;
  },

  publishPlan: async (planId: string) => {
    const res = await clientApi.patch(`/admin/plans/${planId}/publish`);
    return res.data;
  },
};
