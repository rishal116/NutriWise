import { IUser } from "../../../models/user.model";
import { IBaseRepository } from "../common/IBaseRepository";
import { AdminUserListQueryDto } from "../../../dtos/admin/user/admin-user-list-query.dto";
import { UserRole } from "../../../enums/user.enum";

export interface IAdminUserRepository extends IBaseRepository<IUser> {
  getUsers(query: AdminUserListQueryDto): Promise<{
    users: IUser[];
    total: number;
  }>;

  updateBlockStatus(userId: string, isBlocked: boolean): Promise<void>;
  addRole(userId: string, role: UserRole): Promise<void>;
}
