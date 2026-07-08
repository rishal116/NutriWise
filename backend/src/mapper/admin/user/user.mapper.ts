import { IUser } from "../../../models/user.model";
import { AdminUserListItemDto } from "../../../dtos/admin/user/admin-user-list-item.dto";

export class UserMapper {
  static toAdminUserListItemDto(user: IUser): AdminUserListItemDto {
    return {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      profileImage: user.profileImage,
      activeRole: user.activeRole,
      isBlocked: user.isBlocked,
      isProfileCompleted: user.isProfileCompleted,
      createdAt: user.createdAt,
    };
  }

  static toAdminUserListItemDtos(users: IUser[]): AdminUserListItemDto[] {
    return users.map(this.toAdminUserListItemDto);
  }
}
