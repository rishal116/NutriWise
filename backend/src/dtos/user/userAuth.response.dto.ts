// ==========================================
// Shared Types
// ==========================================
export type UserRole = "client" | "nutritionist" | "admin";

export type NutritionistStatus = "none" | "pending" | "approved" | "rejected";

// ==========================================
// Safe User DTO
// ==========================================
export interface SafeUserDto {
  id: string;
  email: string;
  fullName: string;
  roles: UserRole[];
  activeRole: UserRole;
  profileImageUrl?: string;
  isBlocked: boolean;
  nutritionistStatus?: NutritionistStatus;
}

// ==========================================
// Generic Message Response
// ==========================================
export interface MessageResponseDto {
  success: boolean;
  message: string;
}

// ==========================================
// Auth Success Response
// ==========================================
export interface AuthSuccessResponse {
  success: true;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: SafeUserDto;
}

// ==========================================
// Auth Error Response
// ==========================================
export interface AuthErrorResponse {
  success: false;
  message: string;
  statusCode?: number;
}

// ==========================================
// Union Auth Response
// ==========================================
export type AuthResponse = AuthSuccessResponse | AuthErrorResponse;

// ==========================================
// Signup Response
// (Use alias instead of empty interface)
// ==========================================
export type SignupResponseDto = MessageResponseDto;

// ==========================================
// Google Signup Request
// ==========================================
export interface GoogleLoginRequestDto {
  credential: string;
}

// ==========================================
// Get Current User Response
// ==========================================
export interface GetMeResponseDto {
  success: boolean;
  user: SafeUserDto;
}

// ==========================================
// Switch Role Response
// ==========================================
export interface SwitchRoleResponseDto {
  success: boolean;
  message: string;
  activeRole: UserRole;
}
