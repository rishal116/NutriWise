export type UserRole = "client" | "nutritionist" | "admin";

export type NutritionistStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "none";

export interface SafeUserDto {
  id: string;
  email: string;
  fullName: string;
  roles: UserRole[];
  activeRole: UserRole;
  isBlocked: boolean;
  nutritionistStatus?: NutritionistStatus;
}

export interface AuthSuccessResponse {
  success: true;
  accessToken: string;
  message: string;
  user: SafeUserDto;
}

export interface AuthErrorResponse {
  success: false;
  message: string;
  statusCode?: number;
}

export type AuthResponse = AuthSuccessResponse | AuthErrorResponse;

export interface GoogleAuthPayload {
  credential: string;
}