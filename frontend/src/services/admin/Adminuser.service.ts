import { server } from "@/lib/axios/server";
import { AdminRoutes } from "@/routes/admin.routes";

export const adminUserService = {
  getAllUsers: async (page: number = 1, limit: number = 10, search?: string) => {
    const params: Record<string, any> = { page, limit };
    if (search) params.search = search;
    const response = await server.get(AdminRoutes.GET_ALL_USERS, { params });
    
    return response.data;
  },
  
  getAllNutritionists: async (page: number = 1, limit: number = 10, search?: string) => {
    const params: Record<string, any> = { page, limit };
    if (search) params.search = search;
    const response = await server.get(AdminRoutes.NUTRITIONISTS, { params });
    console.log(response);
    return response.data;
  },

  blockUser: async (userId: string) => {
    const response = await server.patch(`${AdminRoutes.BLOCK_USER}/${userId}`);
    return response.data;
  },

  unblockUser: async (userId: string) => {
    const response = await server.patch(`${AdminRoutes.UNBLOCK_USER}/${userId}`);
    return response.data;
  },
};
