import { IUser } from "../../../models/user.model";

export interface IUserRepository {
  createUser(data: Partial<IUser>): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  updatePassword(email: string, hashedPassword: string): Promise<void>;
  verifyUser(email: string): Promise<void>;
}
