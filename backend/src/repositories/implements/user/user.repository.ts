import { BaseRepository } from "../../base.repository";
import { IUserRepository } from "../../interfaces/user/IUserRepository";
import { UserModel, IUser } from "../../../models/user.model";

export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return this.model.findById(id); 
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    return this.model.create(data);
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return this.updateById(id, data); 
  }

  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    await this.model.updateOne({ email }, { password: hashedPassword });
  }

  async verifyUser(email: string): Promise<void> {
    await this.model.updateOne({ email }, { isVerified: true });
  }
}
