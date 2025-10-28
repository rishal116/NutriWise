import {
  AdminLoginDto,
  AdminForgotPasswordDto,
  AdminLoginResponseDto,
} from "../../../dtos/admin/adminAuth.dtos";

export interface IAdminAuthService {
  login(dto: AdminLoginDto): Promise<AdminLoginResponseDto>;
  forgotPassword(dto: AdminForgotPasswordDto): Promise<{ message: string }>;
}
