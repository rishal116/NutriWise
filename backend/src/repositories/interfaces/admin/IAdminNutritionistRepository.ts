import { INutritionistProfile } from "../../../models/nutritionistProfile.model";
import { NutritionistLevel } from "../../../enums/nutritionist.enum";

export interface IAdminNutritionistRepository {
  findByUserId(userId: string): Promise<INutritionistProfile | null>;
  updateNutritionistLevel(userId: string,level: NutritionistLevel): Promise<INutritionistProfile | null>;
}
