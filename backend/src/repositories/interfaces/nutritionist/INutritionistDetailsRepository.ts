import { INutritionistDetails } from "../../../models/nutritionistDetails.model";

export interface INutritionistDetailsRepository {
  createDetails(data: Partial<INutritionistDetails>): Promise<INutritionistDetails>;
  findByUserId(userId: string): Promise<INutritionistDetails | null>;
  updateDetails(userId: string, data: Partial<INutritionistDetails>): Promise<INutritionistDetails | null>;
}