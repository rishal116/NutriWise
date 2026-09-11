import { IUser } from "../../../models/user.model";
import { IBaseRepository } from "../common/IBaseRepository";
import { AdminUserListQueryDto } from "../../../dtos/admin/user/admin-user-list-query.dto";
import { UserRole } from "../../../enums/user.enum";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { AdminUserListItemDto } from "../../../dtos/admin/user/admin-user-list-item.dto";

export interface IAdminUserRepository extends IBaseRepository<IUser> {
  getUsers(
    query: AdminUserListQueryDto,
  ): Promise<CursorPaginationResult<AdminUserListItemDto>>;

  updateBlockStatus(userId: string, isBlocked: boolean): Promise<void>;
  addRole(userId: string, role: UserRole): Promise<void>;
}
