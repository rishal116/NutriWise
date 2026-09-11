import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import { AdminUserListQueryDto } from "../../../dtos/admin/user/admin-user-list-query.dto";

import { AdminUserListItemDto } from "../../../dtos/admin/user/admin-user-list-item.dto";

export interface IAdminUserService {
  getUsers(
    query: AdminUserListQueryDto,
  ): Promise<InfiniteScrollResponseDTO<AdminUserListItemDto>>;

  updateBlockStatus(userId: string, isBlocked: boolean): Promise<void>;
}
