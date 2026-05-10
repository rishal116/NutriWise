import { AdminLoginResponseDto } from "../../dtos/admin/adminAuth.dto";
import { SafeUserDto } from "../../dtos/user/userAuth.response.dto";

export const toAdminLoginResponseDto = (
  user: SafeUserDto,
  accessToken: string,
  refreshToken: string,
) => {
  return new AdminLoginResponseDto(
    user,
    accessToken,
    refreshToken,
  );
};