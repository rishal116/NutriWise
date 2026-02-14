import { BaseRepository } from "../common/base.repository";
import { IAdminNutritionistRepository } from "../../interfaces/admin/IAdminNutritionistRepository";
import { NutritionistDetailsModel, INutritionistProfile } from "../../../models/nutritionistProfile.model";
import { Types } from "mongoose";
import { NutritionistLevel } from "../../../enums/nutritionist.enum";

export class AdminNutritionistRepository extends BaseRepository<INutritionistProfile>
implements IAdminNutritionistRepository {
  constructor() {
    super(NutritionistDetailsModel);
  }

  async findByUserId(userId: string): Promise<INutritionistProfile | null> {
    return this._model.findOne({ userId: new Types.ObjectId(userId) }).exec();
  }
  
  async updateNutritionistLevel(userId: string,level: NutritionistLevel):Promise<INutritionistProfile | null> {
    return this._model.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $set: { nutritionistStatus: level } },
      { new: true }
    ).exec();
  }
  
}
