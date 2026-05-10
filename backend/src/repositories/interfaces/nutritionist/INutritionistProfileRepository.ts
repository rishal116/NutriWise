import { INutritionistProfile } from "../../../models/nutritionistProfile.model";

export interface INutritionistProfileRepository {
  create(data: Partial<INutritionistProfile>): Promise<INutritionistProfile>;
  findByUserId(userId: string): Promise<INutritionistProfile | null>;
  updateByUserId(
    userId: string,
    data: Partial<INutritionistProfile>,
  ): Promise<INutritionistProfile | null>;
}
