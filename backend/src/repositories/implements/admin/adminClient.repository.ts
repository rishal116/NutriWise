import { BaseRepository } from "../base.repository";
import { IAdminClientRepository } from "../../interfaces/admin/IAdminClientRepository";
import { UserModel, IUser } from "../../../models/user.model";
import { Types } from "mongoose";

export class AdminClientRepository extends BaseRepository<IUser> implements IAdminClientRepository {
  constructor() {
    super(UserModel);
  }
  
  async getAllUsers(skip: number, limit: number, search?: string): Promise<{ users: Partial<IUser>[]; total: number }> {
    const filter: Record<string, any> = {};
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const users = await this._model
    .find(filter, "_id fullName email role isBlocked")
    .skip(skip)
    .limit(limit)
    .lean<Partial<IUser>[]>();
    const total = await this._model.countDocuments(filter);
    return { users, total };
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
