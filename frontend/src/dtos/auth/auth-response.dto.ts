import type { UserRole } from "@/types/user/user.types";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export interface AuthResponseData {
  accessToken: string;
  activeRole: UserRole;
  isProfileCompleted: boolean;
}

export type AuthResponse = Omit<ApiResponseDTO<AuthResponseData>, "data"> & {
  data: AuthResponseData;
};
