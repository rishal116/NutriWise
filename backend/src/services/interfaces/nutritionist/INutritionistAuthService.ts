import { Request } from "express"; 
import { UserRegisterDto, VerifyOtpDto, ResendOtpDto } from "../../../dtos/user/UserAuth.dto";

export interface INutritionistAuthService {
  submitDetails(req: Request, userId: string): Promise<{success:boolean; message: string}>;
  approveNutritionist(userId:string): Promise<void>;
  rejectNutritionist(userId:string, reason:string): Promise<void>;
}
