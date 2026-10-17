import type { UserRole } from "@/types/user/user.types";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export interface AuthResponse extends ApiResponseDTO {
  accessToken: string;
  activeRole: UserRole;
  isProfileCompleted: boolean;
}
