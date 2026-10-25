import { AdminUserListItemDto } from "../../../dtos/admin/user/admin-user-list-item.dto";
import {
  AdminUserDetailsDto,
  AdminUserHealthDetailsDto,
} from "../../../dtos/admin/user/admin-user-details.dto";
import { IAdminUserListProjection } from "../../../types/admin/user/admin-user-list.projection";
import {
  IAdminUserDetailsProjection,
  IAdminUserHealthDetailsProjection,
} from "../../../types/admin/user/admin-user-details.projection";

export class AdminUserMapper {
  static toUserTableRowDto(
    user: IAdminUserListProjection,
  ): AdminUserListItemDto {
    return {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      profileImage: user.profileImage,
      activeRole: user.activeRole,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
    };
  }

  static toUserTableRowDtos(
    users: IAdminUserListProjection[],
  ): AdminUserListItemDto[] {
    return users.map((user) => this.toUserTableRowDto(user));
  }

  static toUserDetailsDto(
    user: IAdminUserDetailsProjection,
  ): AdminUserDetailsDto {
    return {
      id: user._id.toString(),
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      gender: user.gender,
      profileImage: user.profileImage,
      authProvider: user.authProvider,
      emailVerifiedAt: user.emailVerifiedAt,
      roles: user.roles,
      activeRole: user.activeRole,
      isBlocked: user.isBlocked,
      isProfileCompleted: user.isProfileCompleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      healthDetails: user.healthDetails
        ? this.toHealthDetailsDto(user.healthDetails)
        : null,
    };
  }

  private static toHealthDetailsDto(
    healthDetails: IAdminUserHealthDetailsProjection,
  ): AdminUserHealthDetailsDto {
    return {
      heightCm: healthDetails.heightCm,
      weightKg: healthDetails.weightKg,
      activityLevel: healthDetails.activityLevel,
      dietType: healthDetails.dietType,
      goal: healthDetails.goal,
      targetWeightKg: healthDetails.targetWeightKg,
      preferredTimeline: healthDetails.preferredTimeline,
    };
  }
}
