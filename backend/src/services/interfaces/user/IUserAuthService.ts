import { Request } from "express";
import {
  UserRegisterDto,
  VerifyOtpDto,
  ResendOtpDto,
  LoginDto,
} from "../../../dtos/user/UserAuth.dto";
import {
  MessageResponseDto,
  GoogleLoginRequestDto,
  GetMeResponseDto,
  AuthSuccessResponse,
  SignupResponseDto,
} from "../../../dtos/user/userAuth.response.dto";
import { UserRole } from "../../../models/user.model";

export interface IUserAuthService {
  signup(req: Request, data: UserRegisterDto): Promise<SignupResponseDto>;
  verifyOtp(req: Request, data: VerifyOtpDto): Promise<AuthSuccessResponse>;
  resendOtp(data: ResendOtpDto): Promise<MessageResponseDto>;
  login(data: LoginDto): Promise<AuthSuccessResponse>;
  googleAuth(payload: GoogleLoginRequestDto): Promise<AuthSuccessResponse>;
  requestPasswordReset(email: string): Promise<MessageResponseDto>;
  resetPassword(
    token: string,
    newPassword: string,
  ): Promise<MessageResponseDto>;
  getMe(userId: string): Promise<GetMeResponseDto>;
  switchRole(
    userId: string,
    activeRole: UserRole,
  ): Promise<AuthSuccessResponse>;
}
