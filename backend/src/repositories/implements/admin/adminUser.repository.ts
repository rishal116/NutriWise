import { BaseRepository } from "../common/base.repository";
import { IAdminUserRepository } from "../../interfaces/admin/IAdminUserRepository";
import { UserModel, IUser } from "../../../models/user.model";
import { FilterQuery, Types, isValidObjectId } from "mongoose";
import { WithRequiredId } from "../../../dtos/admin/user.dto";

export class AdminUserRepository
  extends BaseRepository<IUser>
  implements IAdminUserRepository
{
  constructor() {
    super(UserModel);
  }

  async getAllUsers(
    skip: number,
    limit: number,
    search?: string
  ): Promise<{ users: WithRequiredId<Partial<IUser>>[]; total: number }> {
    const filter: FilterQuery<IUser> = {
      roles: { $in: ["client"] },
      isDeleted: false,
    };

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await this._model
      .find(filter)
      .select("_id fullName email roles isBlocked createdAt")
      .sort({ createdAt: -1 })
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

  const filter: FilterQuery<IUser> = {
    roles: { $in: ["nutritionist"] },
    isDeleted: false,
  };

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const nutritionists = await this._model
    .find(filter)
    .select("_id fullName email roles isBlocked  createdAt")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean<WithRequiredId<Partial<IUser>>[]>();

  const total = await this._model.countDocuments(filter);

  return { nutritionists, total };
}

async getNutritionistApplications(
  skip: number,
  limit: number,
  search?: string
): Promise<{ nutritionists: WithRequiredId<Partial<IUser>>[]; total: number }> {

  const filter: FilterQuery<IUser> = {
    roles: { $in: ["client"] },
    nutritionistStatus: { $in: ["pending", "rejected"] },
    isDeleted: false,
  };

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const nutritionists = await this._model
    .find(filter)
    .select("_id fullName email roles isBlocked nutritionistStatus createdAt")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean<WithRequiredId<Partial<IUser>>[]>();

  const total = await this._model.countDocuments(filter);

  return { nutritionists, total };
}

  async blockUser(userId: string): Promise<void> {
    const id = isValidObjectId(userId)
      ? new Types.ObjectId(userId)
      : userId;

    await this._model.updateOne(
      { _id: id },
      { $set: { isBlocked: true } }
    );
  }

  async unblockUser(userId: string): Promise<void> {
    const id = isValidObjectId(userId)
      ? new Types.ObjectId(userId)
      : userId;

    await this._model.updateOne(
      { _id: id },
      { $set: { isBlocked: false } }
    );
  }
}