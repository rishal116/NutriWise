import { UserRole } from "../../../enums/user.enum";

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  activeRole: UserRole;
  isProfileCompleted: boolean;
}
