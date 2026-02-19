import { Request } from "express";
import { NutritionistNameDTO, NutritionistRejectionDTO, NutritionistDetailsDTO } from "../../../dtos/nutritionist/nutritionistAuth.dto";

export interface INutritionistAuthService {
  submitDetails(req: Request, userId: string): Promise<{ success: boolean; message: string }>;
  getRejectionReason(userId: string):Promise<NutritionistRejectionDTO>;
  getName(userId: string): Promise<NutritionistNameDTO>;
    getMyDetails(
    userId: string
  ): Promise<NutritionistDetailsDTO>;
}
