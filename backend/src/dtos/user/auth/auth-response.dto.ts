import { UserRole } from "../../../enums/user.enum";

export interface AuthResponseDto {
  message: string;
  accessToken: string;
  refreshToken: string;
  activeRole: UserRole;
  isProfileCompleted: boolean;
}
