import { UserRole } from "../../../enums/userRole.enum";

export interface AuthResponseDto {
  message: string;
  accessToken: string;
  refreshToken: string;
  activeRole: UserRole;
  isProfileCompleted: boolean;
}
