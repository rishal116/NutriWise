import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { INutritionistAvailabilityService } from "../../interfaces/nutritionist/INutritionistAvailabilityService";
import { INutritionistAvailabilityRepository } from "../../../repositories/interfaces/nutritionist/INutritionistAvailabilityRepository";
import { INutritionistAvailability } from "../../../models/nutritionistAvailability.model";

@injectable()
export class NutritionistAvailabilityService implements INutritionistAvailabilityService {
  constructor(
    @inject(TYPES.INutritionistAvailabilityRepository)
    private  _nutritionistAvailabilityRepository: INutritionistAvailabilityRepository
  ) {}

  async saveAvailability(userId: string, data: Partial<INutritionistAvailability>) {
    return this._nutritionistAvailabilityRepository.createOrUpdate(userId, data);
  }

  async getAvailability(userId: string) {
    return this._nutritionistAvailabilityRepository.findByUserId(userId);
  }
}
