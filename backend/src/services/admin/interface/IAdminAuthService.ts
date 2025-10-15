import {
  AdminLoginDto,
  AdminChangePasswordDto,
  AdminForgotPasswordDto,
  AdminResetPasswordDto,
  AdminLoginResponseDto,
  AdminResponseDto,
} from "../../../dtos/admin/adminAuth.dtos";

export interface IAdminAuthService {
  login(dto: AdminLoginDto): Promise<AdminLoginResponseDto>;

  getProfile(adminId: string): Promise<AdminResponseDto>;

  changePassword(
    adminId: string,
    dto: AdminChangePasswordDto
  ): Promise<{ message: string }>;

  logout(adminId: string): Promise<{ message: string }>;

  refreshToken(token: string): Promise<{ accessToken: string }>;

  forgotPassword(dto: AdminForgotPasswordDto): Promise<{ message: string }>;

  verifyOtp(email: string, otp: string): Promise<{ message: string }>;

  resetPassword(dto: AdminResetPasswordDto): Promise<{ message: string }>;
}
