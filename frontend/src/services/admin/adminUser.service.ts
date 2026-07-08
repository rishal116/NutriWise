import { clientApi } from "@/lib/axios/clientApi";
import { AdminRoutes } from "@/routes/admin.routes";

import { AdminUserListQueryDto } from "@/dtos/admin/user/admin-user-list-query.dto";
import { AdminUserListItemDto } from "@/dtos/admin/user/admin-user-list-item.dto";
import { InfiniteScrollResponseDto } from "@/dtos/common/infinite-scroll-response.dto";

export const adminUserService = {
  async getUsers(
    query: AdminUserListQueryDto,
  ): Promise<InfiniteScrollResponseDto<AdminUserListItemDto>> {
    const response = await clientApi.get<
      InfiniteScrollResponseDto<AdminUserListItemDto>
    >(AdminRoutes.USERS, {
      params: query,
    });

    return response.data;
  },

  async updateBlockStatus(userId: string, isBlocked: boolean): Promise<void> {
    await clientApi.patch(`${AdminRoutes.USERS}/${userId}/block-status`, {
      isBlocked,
    });
  },
};
