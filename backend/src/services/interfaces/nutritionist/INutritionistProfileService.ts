import { INutritionistProfile } from "../../../models/nutritionistProfile.model";

export interface INutritionistProfileService {
  getNutritionistProfile(userId: string): Promise<any>;
  updateNutritionistProfile(userId: string,data: Partial<INutritionistProfile & { user?: any }>): Promise<any>;
  getNutritionistProfileImage(userId: string): Promise<{ profileImage: string } | null>;
  updateNutritionistProfileImage(userId: string,file: Express.Multer.File): Promise<any>;
}
