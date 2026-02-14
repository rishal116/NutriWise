export type UserRole = "client" | "nutritionist" | "admin";

export interface SafeUserDto {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;
}

export interface SignupResponseDto {
  message: string;
}

export interface VerifyOtpResponseDto {
  message: string;
  accessToken: string;
  refreshToken: string;
  role: UserRole;
}

export interface LoginResponseDto {
  user: SafeUserDto;
  accessToken: string;
  refreshToken: string;
}

export interface GoogleLoginRequestDto {
  credential: string;
  role: Exclude<UserRole, "admin">; // "client" | "nutritionist"
}

export interface GoogleLoginResponseDto {
  user: SafeUserDto;
  accessToken: string;
  refreshToken: string;
}

export interface GoogleSigninRequestDto {
  credential: string;
}

export interface GetMeResponseDto {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  nutritionistStatus: "not_submitted" | "submitted" | "approved" | "rejected";
}

export interface MessageResponseDto {
  message: string;
}
