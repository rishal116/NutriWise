import { INutritionistAvailability } from "../../../models/nutritionistAvailability.model";

export interface INutritionistAvailabilityService {
  saveAvailability(userId: string, data: Partial<INutritionistAvailability>): Promise<INutritionistAvailability>;
  getAvailability(userId: string): Promise<INutritionistAvailability | null>;
}
