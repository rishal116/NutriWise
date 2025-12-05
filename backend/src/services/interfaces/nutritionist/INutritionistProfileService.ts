import { INutritionistDetails } from "../../../models/nutritionistDetails.model";

export interface INutritionistProfileService {
  getNutritionistProfile(userId: string): Promise<any>;
  updateNutritionistProfile(userId: string,data: Partial<INutritionistDetails & { user?: any }>): Promise<any>;
}
