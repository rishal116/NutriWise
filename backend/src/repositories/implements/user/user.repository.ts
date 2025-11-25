import { BaseRepository } from "../../base.repository";
import { IUserRepository } from "../../interfaces/user/IUserRepository";
import { UserModel, IUser } from "../../../models/user.model";
import { Types } from "mongoose";

export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this._model.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return this._model.findById(id); 
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    return this._model.create(data);
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return this.updateById(id, data); 
  }

  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    await this._model.updateOne({ email }, { password: hashedPassword });
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
  
  
  async getAllNutritionists(skip: number, limit: number, search?: string): Promise<{ nutritionists: Partial<IUser>[]; total: number }> {
    const filter: any = { role: "nutritionist" };
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

  async blockUser(userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid userId");
    await this._model.updateOne({ _id: userId }, { isBlocked: true });
  }

  async unblockUser(userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid userId");
    await this._model.updateOne({ _id: userId }, { isBlocked: false });
  }
  
  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return this._model.findOne({ googleId });
  }
  
  async updateById(userId: string, data: Partial<IUser>): Promise<IUser | null> {
    return this._model.findByIdAndUpdate(userId, data, { new: true });
  }

  async setResetToken(email: string, token: string, expires: Date): Promise<void> {
    await this._model.updateOne(
      { email },
      { resetPasswordToken: token, resetPasswordExpires: expires }
    );
  }

  async findByResetToken(token: string): Promise<IUser | null> {
    return this._model.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }, 
    });
  }
}
