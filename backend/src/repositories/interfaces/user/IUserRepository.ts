import { IUser } from "../../../models/user.model";

export interface IUserRepository {
  createUser(data: Partial<IUser>): Promise<IUser>;

  findByEmail(email: string): Promise<IUser | null>;

  findById(id: string): Promise<IUser | null>;

  updateUser(id: string, data: Partial<IUser>): Promise<IUser | null>;

  updatePassword(email: string, hashedPassword: string): Promise<void>;

  getAllUsers(skip: number, limit: number, search?:string): Promise<{ users: Partial<IUser>[]; total: number }>;
  getAllNutritionists( skip: number, limit: number, search?: string ): Promise<{ nutritionists: Partial<IUser>[]; total: number }>;
  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
  findByGoogleId(googleId: string): Promise<IUser | null>;
  updateById(id: string, data: Partial<IUser>): Promise<IUser | null>;
  setResetToken(email: string, token: string, expires: Date): Promise<void>;
  findByResetToken(token: string): Promise<IUser | null>;
}
