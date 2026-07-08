import { INutritionistProfile } from "../../../models/nutritionistProfile.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface INutritionistProfileRepository extends IBaseRepository<INutritionistProfile> {
  findByUserId(userId: string): Promise<INutritionistProfile | null>;

  updateByUserId(
    userId: string,
    data: Partial<INutritionistProfile>,
  ): Promise<INutritionistProfile | null>;

  findCompleteProfile(userId: string): Promise<INutritionistProfile | null>;
}
