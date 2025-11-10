import { Request } from "express"; 
import { UserRegisterDto, VerifyOtpDto, ResendOtpDto } from "../../../dtos/user/UserAuth.dto";

export interface INutritionistAuthService {
  signup(req: Request, data: UserRegisterDto): Promise<{ message: string }>;
  verifyOtp(req: Request, data: VerifyOtpDto): Promise<{ message: string; accessToken: string; refreshToken:string}>;
  resendOtp(data: ResendOtpDto): Promise<{ message: string }>;
  submitDetails(req: Request, userId: string): Promise<{ message: string; data: any }>;
}
