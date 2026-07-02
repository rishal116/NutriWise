import { UserRole } from "../../enums/userRole.enum";

export interface GetMeResponseDto {
  id: string;
  fullName: string;
  email: string;
  username: string;
  profileImage: string | null;
  activeRole: UserRole;
  roles: UserRole[];
  isProfileCompleted: boolean;
}
