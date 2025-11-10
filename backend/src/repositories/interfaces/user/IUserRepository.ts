import { IUser } from "../../../models/user.model";

export interface IUserRepository {
  createUser(data: Partial<IUser>): Promise<IUser>;

  findByEmail(email: string): Promise<IUser | null>;

  findById(id: string): Promise<IUser | null>;

  updateUser(id: string, data: Partial<IUser>): Promise<IUser | null>;

  updatePassword(email: string, hashedPassword: string): Promise<void>;

  getAllClients(): Promise<Partial<IUser>[]>;
  getAllNutritionists(): Promise<Partial<IUser>[]>;
  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
  findByGoogleId(googleId: string): Promise<IUser | null>;
  updateById(id: string, data: Partial<IUser>): Promise<IUser | null>;
  
}
