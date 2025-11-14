import { Request } from "express"; 
import { UserRegisterDto, VerifyOtpDto, ResendOtpDto, LoginDto } from "../../../dtos/user/UserAuth.dto";

export interface IUserAuthService {
  signup(req: Request, data: UserRegisterDto): Promise<{ message: string }>;
  verifyOtp(req: Request, data: VerifyOtpDto): Promise<{ message: string; accessToken: string; refreshToken:string , role:string }>;
  resendOtp(data: ResendOtpDto): Promise<{ message: string }>;
  login(data: LoginDto): Promise<{ user: any; accessToken: string; refreshToken: string }>;
  googleLogin(payload: {credential: string; role: "client" | "nutritionist" | "admin";}): Promise<{user: any; accessToken: string; refreshToken: string}>;
  requestPasswordReset(email: string): Promise<{ message: string }>;
  resetPassword(token: string, newPassword: string): Promise<{ message: string }>;
}
