import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { AdminUserListQueryDto } from "../../../dtos/admin/user/admin-user-list-query.dto";
import { AdminUserListItemDto } from "../../../dtos/admin/user/admin-user-list-item.dto";
import { AdminUserDetailsDto } from "../../../dtos/admin/user/admin-user-details.dto";

export interface IAdminUserService {
  getUsers(
    query: AdminUserListQueryDto,
  ): Promise<InfiniteScrollResponseDTO<AdminUserListItemDto>>;

  getUserDetails(userId: string): Promise<AdminUserDetailsDto | null>;

  updateBlockStatus(userId: string, isBlocked: boolean): Promise<void>;
}
