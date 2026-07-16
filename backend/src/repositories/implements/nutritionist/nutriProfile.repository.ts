import { injectable } from "inversify";
import { BaseRepository } from "../common/base.repository";
import { INutritionistProfileRepository } from "../../interfaces/nutritionist/INutriProfileRepository";
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

  async findByUserId(userId: string): Promise<INutritionistProfile | null> {
    return this._model.findOne({ userId: new Types.ObjectId(userId) }).exec();
  }

  async updateByUserId(
    userId: string,
    data: Partial<INutritionistProfile>,
  ): Promise<INutritionistProfile | null> {
    return this._model
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        { $set: data },
        { new: true, runValidators: true },
      )
      .exec();
  }
  async getProfileImageByUserId(
    userId: string,
  ): Promise<{ profileImage?: string } | null> {
    return this._model
      .findOne({ userId }, { profileImage: 1, _id: 0 })
      .lean<{ profileImage?: string }>();
  }

  async findCompleteProfile(
    userId: string,
  ): Promise<INutritionistProfile | null> {
    return this._model
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate("userId")
      .exec();
  }
}
