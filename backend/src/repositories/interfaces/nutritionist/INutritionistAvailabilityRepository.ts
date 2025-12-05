import { INutritionistAvailability } from "../../../models/nutritionistAvailability.model";
import { IBaseRepository } from "../IBaseRepository";

export interface INutritionistAvailabilityRepository extends IBaseRepository<INutritionistAvailability> {
  createOrUpdate(
    userId: string,
    payload: Partial<INutritionistAvailability>
  ): Promise<INutritionistAvailability>;

  findByUserId(
    userId: string
  ): Promise<INutritionistAvailability | null>;
}
