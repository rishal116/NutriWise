import { clientApi } from "@/lib/axios/clientApi";
import { ADMIN_USER_ROUTES } from "@/routes/admin";
import type { AdminUserListQueryDto } from "@/dtos/admin/user/admin-user-list-query.dto";
import type { AdminUserListItemDto } from "@/dtos/admin/user/admin-user-list-item.dto";
import type { AdminUserDetailsDto } from "@/dtos/admin/user/admin-user-details.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const adminUserService = {
  async getUsers(
    query: AdminUserListQueryDto,
  ): Promise<ApiResponseDTO<InfiniteScrollResponseDTO<AdminUserListItemDto>>> {
    const response = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<AdminUserListItemDto>>
    >(ADMIN_USER_ROUTES.USERS, {
      params: query,
    });

    return response.data;
  },

  async getUserDetails(
    userId: string,
  ): Promise<ApiResponseDTO<AdminUserDetailsDto>> {
    const response = await clientApi.get<ApiResponseDTO<AdminUserDetailsDto>>(
      ADMIN_USER_ROUTES.USER_DETAILS(userId),
    );

    return response.data;
  },

  async updateBlockStatus(userId: string, isBlocked: boolean): Promise<void> {
    await clientApi.patch(ADMIN_USER_ROUTES.BLOCK_STATUS(userId), {
      isBlocked,
    });
  },
};
