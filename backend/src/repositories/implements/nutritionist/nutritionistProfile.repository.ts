import { injectable } from "inversify";
import { BaseRepository } from "../common/base.repository";
import { INutritionistProfileRepository } from "../../interfaces/nutritionist/INutritionistProfileRepository";
import {
  NutritionistProfileModel,
  INutritionistProfile,
} from "../../../models/nutritionistProfile.model";
import { Types } from "mongoose";

@injectable()
export class NutritionistProfileRepository
  extends BaseRepository<INutritionistProfile>
  implements INutritionistProfileRepository
{
  constructor() {
    super(NutritionistProfileModel);
  }

  async create(
    data: Partial<INutritionistProfile>,
  ): Promise<INutritionistProfile> {
    return await this._model.create(data);
  }

  async findByUserId(userId: string): Promise<INutritionistProfile | null> {
    return await this._model
      .findOne({
        userId: new Types.ObjectId(userId),
      })
      .exec();
  }

  async updateByUserId(
    userId: string,
    data: Partial<INutritionistProfile>,
  ): Promise<INutritionistProfile | null> {
    return await this._model
      .findOneAndUpdate(
        {
          userId: new Types.ObjectId(userId),
        },
        {
          $set: data,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();
  }
}
