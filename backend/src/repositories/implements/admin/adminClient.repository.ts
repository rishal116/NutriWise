import { BaseRepository } from "../common/base.repository";
import { IAdminClientRepository } from "../../interfaces/admin/IAdminClientRepository";
import { UserModel, IUser } from "../../../models/user.model";
import { FilterQuery } from "mongoose";
import { WithRequiredId } from "../../../dtos/admin/user.dto";

export class AdminClientRepository
  extends BaseRepository<IUser>
  implements IAdminClientRepository {

  constructor() {
    super(UserModel);
  }
  
  async getAllUsers(skip: number,limit: number,search?: string): 
  Promise<{ users: WithRequiredId<Partial<IUser>>[]; total: number }> {
    const filter: FilterQuery<IUser> = {};

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await this._model
      .find(filter)
      .select("_id fullName email role isBlocked")
      .skip(skip)
      .limit(limit)
      .lean<WithRequiredId<Partial<IUser>>[]>();

    const total = await this._model.countDocuments(filter);

    return { users, total };
  }

async getAllNutritionists(
  skip: number,
  limit: number,
  search?: string
): Promise<{ nutritionists: WithRequiredId<Partial<IUser>>[]; total: number }> {

    const filter: FilterQuery<IUser> = { role: "nutritionist" };

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const nutritionists = await this._model
      .find(filter)
      .select("_id fullName email role isBlocked nutritionistStatus")
      .skip(skip)
      .limit(limit)
       .lean<WithRequiredId<Partial<IUser>>[]>();

    const total = await this._model.countDocuments(filter);

    return { nutritionists, total };
  }

  async blockUser(userId: string): Promise<void> {
    await this._model.updateOne({ _id: userId }, { $set: { isBlocked: true } });
  }

  async unblockUser(userId: string): Promise<void> {
    await this._model.updateOne({ _id: userId }, { $set: { isBlocked: false } });
  }
}
