import { AdminRoutes } from "@/routes/admin.routes";
import { NutritionistLevel } from "@/enum/admin/nutritionist.enum";
import { adminApi } from "@/lib/axios/adminApi";

export const adminNutriService = {
    getNutritionistProfile: async (userId: string) => {
        const res = await adminApi.get(`/admin/nutritionist/${userId}`);
        return res.data;
    },
    
    approveNutritionist: async (userId: string) => {
        const res = await adminApi.patch(`/admin/nutritionist/approve/${userId}`);
        return res.data;
    },
    
    rejectNutritionist: async (userId: string, reason: string) => {
        const res = await adminApi.patch(`/admin/nutritionist/reject/${userId}`, { reason });
        return res.data;
    },
    updateNutritionistLevel:async (userId: string,level: NutritionistLevel) => {
        const res = await adminApi.patch(`/admin/nutritionist/${userId}/level`, { level });
        return res.data;
    },
    
};
