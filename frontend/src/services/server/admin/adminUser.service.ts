import { cookies } from "next/headers";
import { serverApi } from "@/lib/axios/serverApi";
import { AdminRoutes } from "@/routes/admin.routes";
import { AdminUserListQueryDto } from "@/dtos/admin/user/admin-user-list-query.dto";
import axios from "axios";

export const adminUserServerService = {
  async getUsers(query: AdminUserListQueryDto) {
    const cookieStore = await cookies();

    try {
      const response = await serverApi.get(AdminRoutes.USERS, {
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
