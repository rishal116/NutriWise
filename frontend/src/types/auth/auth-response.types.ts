import { UserRole } from "../user/user.types";

export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface AuthResponse extends ApiResponse {
  activeRole: UserRole;
  isProfileCompleted: boolean;
}

export interface GetMeResponse extends ApiResponse {
  data: import("../user/user.types").User;
}
