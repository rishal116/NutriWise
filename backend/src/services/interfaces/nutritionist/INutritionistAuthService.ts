import { Request } from "express";
import { NutritionistProfileDto } from "../../../dtos/nutritionist/nutritionistProfile";

export interface INutritionistAuthService {
  submitDetails(req: Request, userId: string): Promise<{ success: boolean; message: string }>;
  approveNutritionist(userId: string): Promise<void>; 
}
