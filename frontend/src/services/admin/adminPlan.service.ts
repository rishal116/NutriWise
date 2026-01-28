import { adminApi } from "@/lib/axios/adminApi";


export const adminPlanService = {
  getAllPlans: async () => {
    const res = await adminApi.get("/admin/plans");
    return res.data;
  },

  publishPlan: async (planId: string) => {
    const res = await adminApi.patch(`/admin/plans/${planId}/publish`);
    return res.data;
  },
};
