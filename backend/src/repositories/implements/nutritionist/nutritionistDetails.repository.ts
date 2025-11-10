import { injectable } from "inversify";
import { BaseRepository } from "../../base.repository";
import { INutritionistDetailsRepository } from "../../interfaces/nutritionist/INutritionistDetailsRepository";
import { NutritionistDetailsModel, INutritionistDetails } from "../../../models/nutritionistDetails.model";
import { Types } from "mongoose";

@injectable()
export class NutritionistDetailsRepository extends BaseRepository<INutritionistDetails> implements INutritionistDetailsRepository {
  constructor() {
    super(NutritionistDetailsModel);
  }

  async createDetails(data: Partial<INutritionistDetails>): Promise<INutritionistDetails> {
    return this.create(data);
  }

  async findByUserId(userId: string): Promise<INutritionistDetails | null> {
    return this.findOne({ userId: new Types.ObjectId(userId) });
  }

  async updateDetails(userId: string, data: Partial<INutritionistDetails>): Promise<INutritionistDetails | null> {
    return NutritionistDetailsModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      data,
      { new: true }
    );
  }
}
