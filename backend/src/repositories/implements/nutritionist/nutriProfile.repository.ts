import { injectable } from "inversify";
import { Types } from "mongoose";

import { BaseRepository } from "../common/base.repository";

import { INutritionistProfileRepository } from "../../interfaces/nutritionist/INutriProfileRepository";

import {
  NutritionistProfileModel,
  INutritionistProfile,
} from "../../../models/nutritionistProfile.model";

@injectable()
export class NutritionistProfileRepository
  extends BaseRepository<INutritionistProfile>
  implements INutritionistProfileRepository
{
  constructor() {
    super(NutritionistProfileModel);
  }

  async findByUserId(userId: string): Promise<INutritionistProfile | null> {
    return this._model
      .findOne({
        userId: new Types.ObjectId(userId),
      })
      .exec();
  }

  async updateByUserId(
    userId: string,
    data: Partial<INutritionistProfile>,
  ): Promise<INutritionistProfile | null> {
    return this._model
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

  async updateRatingSummary(
    userId: string,
    rating: number,
    totalReviews: number,
  ): Promise<INutritionistProfile | null> {
    return this._model
      .findOneAndUpdate(
        {
          userId: new Types.ObjectId(userId),
        },
        {
          $set: {
            rating,
            totalReviews,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();
  }

  async findCompleteProfile(
    userId: string,
  ): Promise<INutritionistProfile | null> {
    return this._model
      .findOne({
        userId: new Types.ObjectId(userId),
      })
      .populate("userId")
      .exec();
  }
}
