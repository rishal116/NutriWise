
import type { Request } from "express";
import type { UserRegisterDto } from "../../../../dtos/user/auth/signup.dto";
import type { VerifyOtpDto } from "../../../../dtos/user/auth/verify-otp.dto";
import type { VerifyOtpResponseDto } from "../../../../dtos/user/auth/verify-otp-response.dto";
import type { ResendOtpDto } from "../../../../dtos/user/auth/resend-otp.dto";

export interface ISignupService {
  signup(req: Request, data: UserRegisterDto): Promise<void>;

  verifyOtp(req: Request, data: VerifyOtpDto): Promise<VerifyOtpResponseDto>;

  resendOtp(data: ResendOtpDto): Promise<void>;
}
