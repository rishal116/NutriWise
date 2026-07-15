import { cookies } from "next/headers";
import axios from "axios";

import { serverApi } from "@/lib/axios/serverApi";
import { ADMIN_USER_ROUTES } from "@/routes/admin";
import { AdminUserListQueryDto } from "@/dtos/admin/user/admin-user-list-query.dto";

export const adminUserServerService = {
  async getUsers(query: AdminUserListQueryDto) {
    const cookieStore = await cookies();

    try {
      const response = await serverApi.get(ADMIN_USER_ROUTES.USERS, {
        params: query,
        headers: {
          Cookie: cookieStore.toString(),
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Status:", error.response?.status);
        console.log("Data:", error.response?.data);
      }

      throw error;
    }
  },
};