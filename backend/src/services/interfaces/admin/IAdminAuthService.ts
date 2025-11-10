import {
  AdminLoginDto,
  AdminForgotPasswordDto,
  AdminLoginResponseDto,
} from "../../../dtos/admin/adminAuth.dto";

export interface IAdminAuthService {
  login(dto: AdminLoginDto): Promise<AdminLoginResponseDto>;
  forgotPassword(dto: AdminForgotPasswordDto): Promise<{ message: string }>;
}
