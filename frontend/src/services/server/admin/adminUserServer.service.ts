import { cookies } from "next/headers";

import { serverApi } from "@/lib/axios/serverApi";

import { ADMIN_USER_ROUTES } from "@/routes/admin";

import { AdminUserListQueryDto } from "@/dtos/admin/user/admin-user-list-query.dto";

import { AdminUserListItemDto } from "@/dtos/admin/user/admin-user-list-item.dto";

import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const adminUserServerService = {
  async getUsers(
    query: AdminUserListQueryDto,
  ): Promise<
    InfiniteScrollResponseDTO<AdminUserListItemDto>
  > {
    const cookieStore = await cookies();

    const response = await serverApi.get<
      ApiResponseDTO<
        InfiniteScrollResponseDTO<AdminUserListItemDto>
      >
    >(ADMIN_USER_ROUTES.USERS, {
      params: query,
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return response.data.data;
  },
};