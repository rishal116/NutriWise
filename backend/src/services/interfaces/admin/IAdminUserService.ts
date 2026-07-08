import { AdminUserListQueryDto } from "../../../dtos/admin/user/admin-user-list-query.dto";
import { AdminUserListItemDto } from "../../../dtos/admin/user/admin-user-list-item.dto";

export interface IAdminUserService {
  getUsers(query: AdminUserListQueryDto): Promise<{
    data: AdminUserListItemDto[];
    total: number;
    skip: number;
    limit: number;
    hasMore: boolean;
  }>;

  updateBlockStatus(userId: string, isBlocked: boolean): Promise<void>;
}
