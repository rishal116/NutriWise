import { Request } from "express";
import { UserRegisterDto,VerifyOtpDto,ResendOtpDto,LoginDto} from "../../../dtos/user/UserAuth.dto";
import {MessageResponseDto,VerifyOtpResponseDto,LoginResponseDto,
  GoogleLoginRequestDto,GoogleLoginResponseDto,GoogleSigninRequestDto,GetMeResponseDto
} from "../../../dtos/user/userAuth.response.dto";

export interface IUserAuthService {
  signup(req: Request,data: UserRegisterDto): Promise<MessageResponseDto>;
  verifyOtp(req: Request,data: VerifyOtpDto): Promise<VerifyOtpResponseDto>;
  resendOtp(data: ResendOtpDto): Promise<MessageResponseDto>;
  login(data: LoginDto): Promise<LoginResponseDto>;
  googleLogin(payload: GoogleLoginRequestDto): Promise<GoogleLoginResponseDto>;
  googleSignin(payload: GoogleSigninRequestDto): Promise<GoogleLoginResponseDto>;
  requestPasswordReset(email: string): Promise<MessageResponseDto>;
  resetPassword(token: string,newPassword: string): Promise<MessageResponseDto>;
  getMe(userId: string): Promise<GetMeResponseDto>;
}
