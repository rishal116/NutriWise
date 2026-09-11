import { AdminUserListItemDto } from "../../../dtos/admin/user/admin-user-list-item.dto";

export class UserMapper {
  static toAdminUserListItemDto(
    user: AdminUserListItemDto,
  ): AdminUserListItemDto {
    return {
      id: user.id,
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

  static toAdminUserListItemDtos(
    users: AdminUserListItemDto[],
  ): AdminUserListItemDto[] {
    return users.map((user) => this.toAdminUserListItemDto(user));
  }
}
