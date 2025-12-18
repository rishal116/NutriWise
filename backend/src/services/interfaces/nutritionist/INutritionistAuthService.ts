import { Request } from "express";
import { NutritionistRejectionDTO } from "../../../dtos/nutritionist/nutritionistAuth.dto";

export interface INutritionistAuthService {
  submitDetails(req: Request, userId: string): Promise<{ success: boolean; message: string }>;
  getRejectionReason(userId: string):Promise<NutritionistRejectionDTO>;
}
