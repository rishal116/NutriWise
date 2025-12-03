import { BaseRepository } from "../base.repository";
import { IAdminNutritionistRepository } from "../../interfaces/admin/IAdminNutritionistRepository";
import { UserModel, IUser } from "../../../models/user.model";
import { Types, FilterQuery } from "mongoose";

export class AdminNutritionistRepository extends BaseRepository<IUser> implements IAdminNutritionistRepository {
  constructor() {
    super(UserModel);
  }

  
  async getAllNutritionists(skip: number, limit: number, search?: string): Promise<{ nutritionists: Partial<IUser>[]; total: number }> {
    const filter: FilterQuery<IUser> = { role: "nutritionist" };
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const nutritionists = await this._model.find(filter, "_id fullName email role isBlocked")
    .skip(skip)
    .limit(limit)
    .lean<Partial<IUser>[]>();
    const total = await this._model.countDocuments(filter);
    return { nutritionists, total };
  }

  private async toggleBlock(userId: string, state: boolean) {
    if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid userId");
    await this._model.updateOne({ _id: userId }, { $set: { isBlocked: state } });
  }
  
  blockUser(userId: string) {
    return this.toggleBlock(userId, true);
  }

  unblockUser(userId: string) {
    return this.toggleBlock(userId, false);
  }


}
