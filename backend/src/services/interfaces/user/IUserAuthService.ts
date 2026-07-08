import { Request } from "express";
import { UserRegisterDto } from "../../../dtos/user/auth/signup.dto";
import { MessageResponseDto } from "../../../dtos/user/auth/message-response.dto";
import { VerifyOtpDto } from "../../../dtos/user/auth/verify-otp.dto";
import { VerifyOtpResponseDto } from "../../../dtos/user/auth/verify-otp-response.dto";
import { ResendOtpDto } from "../../../dtos/user/auth/resend-otp.dto";
import { LoginDto } from "../../../dtos/user/auth/login.dto";
import { GoogleAuthDto } from "../../../dtos/user/auth/google-auth.dto";
import { AuthResponseDto } from "../../../dtos/user/auth/auth-response.dto";
import { GetMeResponseDto } from "../../../dtos/user/get-me-response.dto";
import { ForgotPasswordDto } from "../../../dtos/user/auth/forgot-password.dto";
import { ResetPasswordDto } from "../../../dtos/user/auth/reset-password.dto";
import { SwitchRoleDto } from "../../../dtos/user/auth/switch-role.dto";

export interface IUserAuthService {
  signup(req: Request, data: UserRegisterDto): Promise<MessageResponseDto>;
  verifyOtp(req: Request, data: VerifyOtpDto): Promise<VerifyOtpResponseDto>;
  resendOtp(data: ResendOtpDto): Promise<MessageResponseDto>;
  login(data: LoginDto): Promise<AuthResponseDto>;
  googleAuth(payload: GoogleAuthDto): Promise<AuthResponseDto>;
  requestPasswordReset(data: ForgotPasswordDto): Promise<MessageResponseDto>;
  resetPassword(data: ResetPasswordDto): Promise<MessageResponseDto>;
  getMe(userId: string): Promise<GetMeResponseDto>;
  switchRole(
    userId: string,
    dto: SwitchRoleDto,
  ): Promise<{ accessToken: string; refreshToken: string }>;
}
