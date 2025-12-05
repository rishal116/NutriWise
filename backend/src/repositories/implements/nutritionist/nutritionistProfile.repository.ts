import { BaseRepository } from "../../implements/base.repository";
import { INutritionistProfileRepository } from "../../interfaces/nutritionist/INutritionistProfileRepository";
import { NutritionistDetailsModel, INutritionistDetails } from "../../../models/nutritionistDetails.model";
import { UserModel, IUser } from "../../../models/user.model";
import { Types } from "mongoose";

export class NutritionistProfileRepository extends BaseRepository<INutritionistDetails>implements INutritionistProfileRepository {
  constructor() {
    super(NutritionistDetailsModel);
  }
  
  async findCompleteProfile(userId: string | Types.ObjectId): Promise<(INutritionistDetails & { user: IUser }) | null> {
    return this._model.findOne({ userId: new Types.ObjectId(userId) })
    .populate<{ user: IUser }>({ path: "userId", model: UserModel })
    .exec() as any;
  }
  
  async updateByUserId(userId: string | Types.ObjectId,data: Partial<INutritionistDetails>): Promise<INutritionistDetails | null> {
    return this._model.findOneAndUpdate({ userId: new Types.ObjectId(userId) }, data, { new: true })
    .exec();
  }
  
}
