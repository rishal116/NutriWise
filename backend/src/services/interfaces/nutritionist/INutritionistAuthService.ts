import { Request } from "express"; 
import { UserRegisterDto, VerifyOtpDto, ResendOtpDto } from "../../../dtos/user/UserAuth.dto";

export interface INutritionistAuthService {
  submitDetails(req: Request, userId: string): Promise<{ message: string; data: any }>;
}
