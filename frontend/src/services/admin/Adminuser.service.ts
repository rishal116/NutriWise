import { api } from "@/lib/axios/api";
import { AdminRoutes } from "@/routes/admin.routes";

export const adminUserService = {
  getAllUsers: async () => {
    const response = await api.get(AdminRoutes.GET_ALL_USERS);
    return response.data;
  },
  
  getAllNutritionists: async () => {
    const response = await api.get(AdminRoutes.NUTRITIONISTS);
    return response.data;
  },

  blockUser: async (userId: string) => {
    const response = await api.patch(`${AdminRoutes.BLOCK_USER}/${userId}`);
    return response.data;
  },

  unblockUser: async (userId: string) => {
    const response = await api.patch(`${AdminRoutes.UNBLOCK_USER}/${userId}`);
    return response.data;
  },
};
