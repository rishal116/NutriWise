import { BaseRepository } from "../../implements/base.repository";
import { INutritionistAvailabilityRepository } from "../../interfaces/nutritionist/INutritionistAvailabilityRepository";
import { NutritionistAvailabilityModel, INutritionistAvailability } from "../../../models/nutritionistAvailability.model";
import { Types } from "mongoose";

export class NutritionistAvailabilityRepository extends BaseRepository<INutritionistAvailability> 
implements INutritionistAvailabilityRepository {
  constructor() {
    super(NutritionistAvailabilityModel);
  }

  async createOrUpdate(
    userId: string | Types.ObjectId,
    payload: Partial<INutritionistAvailability>
  ): Promise<INutritionistAvailability> {
    return this._model.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { ...payload, userId },
      { new: true, upsert: true }
    ).lean<INutritionistAvailability>() as any;
  }

  async findByUserId(
    userId: string | Types.ObjectId
  ): Promise<INutritionistAvailability | null> {
    return this._model.findOne({ userId }).lean<INutritionistAvailability | null>();
  }
}
