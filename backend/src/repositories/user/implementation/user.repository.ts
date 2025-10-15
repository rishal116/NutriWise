import { IUserRepository } from "../interface/IUserRepository";
import { UserModel, IUser } from "../../../models/user.model";

export class UserRepository implements IUserRepository {
  
  async createUser(data: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(data);
    return await user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id).exec();
  }

  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    await UserModel.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    ).exec();
  }

  async verifyUser(email: string): Promise<void> {
    await UserModel.updateOne(
      { email },
      { $set: { isVerified: true } }
    ).exec();
  }
}
