import { UserRole } from "../../../enums/userRole.enum";

export interface AdminUserListItemDto {
  id: string;
  fullName: string;
  email: string;
  username: string;
  profileImage?: string;
  activeRole: UserRole;
  isBlocked: boolean;
  isProfileCompleted: boolean;
  createdAt: Date;
}
