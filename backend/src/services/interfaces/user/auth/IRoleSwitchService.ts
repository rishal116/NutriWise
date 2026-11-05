import type { SwitchRoleDto } from "../../../../dtos/user/auth/switch-role.dto";

export interface IRoleSwitchService {
  switchRole(
    userId: string,
    dto: SwitchRoleDto,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
}
