import { AdminRoutes } from "@/routes/admin.routes";
import { NutritionistLevel } from "@/enum/admin/nutritionist.enum";
import { adminApi } from "@/lib/axios/adminApi";

export const adminNutriService = {
  getNutritionistProfile: async (userId: string) => {
    const res = await adminApi.get(
      AdminRoutes.NUTRITIONIST_PROFILE.replace(":userId", userId)
    );
    return res.data;
  },

  getNutritionistApplications: async (
    page = 1,
    limit = 10,
    search?: string
  ) => {
    const res = await adminApi.get(
      `${AdminRoutes.NUTRITIONIST_APPLICATIONS}?page=${page}&limit=${limit}&search=${search ?? ""}`
    );
    return res.data;
  },

  approveNutritionist: async (userId: string) => {
    const res = await adminApi.patch(
      AdminRoutes.NUTRITIONIST_APPROVE.replace(":userId", userId)
    );
    return res.data;
  },

  rejectNutritionist: async (userId: string, reason: string) => {
    const res = await adminApi.patch(
      AdminRoutes.NUTRITIONIST_REJECT.replace(":userId", userId),
      { reason }
    );
    return res.data;
  },

  updateNutritionistLevel: async (userId: string, level: NutritionistLevel) => {
    const res = await adminApi.patch(
      AdminRoutes.NUTRITIONIST_LEVEL.replace(":userId", userId),
      { level }
    );
    return res.data;
  },
};