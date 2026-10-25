import { IUser } from "../../../models/user.model";
import { IBaseRepository } from "../common/IBaseRepository";
import { AdminUserListQueryDto } from "../../../dtos/admin/user/admin-user-list-query.dto";
import { UserRole } from "../../../enums/user.enum";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { IAdminUserListProjection } from "../../../types/admin/user/admin-user-list.projection";
import { IAdminUserDetailsProjection } from "../../../types/admin/user/admin-user-details.projection";

export interface IAdminUserRepository extends IBaseRepository<IUser> {
  getUsers(
    query: AdminUserListQueryDto,
  ): Promise<CursorPaginationResult<IAdminUserListProjection>>;

  getUserDetailsById(
    userId: string,
  ): Promise<IAdminUserDetailsProjection | null>;

  updateBlockStatus(userId: string, isBlocked: boolean): Promise<void>;

  addRole(userId: string, role: UserRole): Promise<void>;
}
