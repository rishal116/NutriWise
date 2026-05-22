import { adminApi } from "@/lib/axios/adminApi";
import { AdminRoutes } from "@/routes/admin.routes";

const buildParams = (page: number, limit: number, search?: string) => {
  return {
    page,
    limit,
    ...(search ? { search } : {}),
  };
};

export const adminUserService = {
  getAllUsers: async (page = 1, limit = 10, search?: string) => {
    const response = await adminApi.get(AdminRoutes.USERS, {
      params: buildParams(page, limit, search),
    });

    return response.data; 
  },

  getAllNutritionists: async (page = 1, limit = 10, search?: string) => {
    const response = await adminApi.get(AdminRoutes.NUTRITIONISTS, {
      params: buildParams(page, limit, search),
    });

    return response.data;
  },

  blockUser: async (userId: string) => {
    const url = AdminRoutes.BLOCK_USER.replace(":userId", userId);
    const response = await adminApi.patch(url);
    return response.data;
  },

  unblockUser: async (userId: string) => {
    const url = AdminRoutes.UNBLOCK_USER.replace(":userId", userId);
    const response = await adminApi.patch(url);
    return response.data;
  },
};
