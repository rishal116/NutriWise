import { clientApi } from "@/lib/axios/clientApi";
import { ADMIN_USER_ROUTES } from "@/routes/admin";

import { AdminUserListQueryDto } from "@/dtos/admin/user/admin-user-list-query.dto";
import { AdminUserListItemDto } from "@/dtos/admin/user/admin-user-list-item.dto";
import { InfiniteScrollResponseDto } from "@/dtos/common/infinite-scroll-response.dto";

export const adminUserService = {
  async getUsers(
    query: AdminUserListQueryDto,
  ): Promise<InfiniteScrollResponseDto<AdminUserListItemDto>> {
    const response = await clientApi.get<
      InfiniteScrollResponseDto<AdminUserListItemDto>
    >(ADMIN_USER_ROUTES.USERS, {
      params: query,
    });

    return response.data;
  },

  async updateBlockStatus(
    userId: string,
    isBlocked: boolean,
  ): Promise<void> {
    await clientApi.patch(
      ADMIN_USER_ROUTES.BLOCK_STATUS(userId),
      {
        isBlocked,
      },
    );
  },
};