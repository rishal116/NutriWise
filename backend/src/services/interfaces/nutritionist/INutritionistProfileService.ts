import { INutritionistProfile } from "../../../models/nutritionistProfile.model";

export interface INutritionistProfileService {
  getNutritionistProfile(userId: string): Promise<any>;
  updateNutritionistProfile(userId: string,data: Partial<INutritionistProfile & { user?: any }>): Promise<any>;
}
