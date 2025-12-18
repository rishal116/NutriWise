import { IUser } from "../../../models/user.model";
import {UpdateQuery} from "mongoose";

export interface IAdminNutritionistRepository {
  getAllNutritionists( skip: number, limit: number, search?: string ): Promise<{ nutritionists: Partial<IUser>[]; total: number }>;
  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
  updateById(userId: string, update: UpdateQuery<IUser>): Promise<IUser | null>;
  findById(userId: string): Promise<IUser | null>;
}
