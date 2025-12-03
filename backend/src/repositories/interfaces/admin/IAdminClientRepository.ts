import { IUser } from "../../../models/user.model";

export interface IAdminClientRepository {
  getAllUsers(skip: number, limit: number, search?:string): Promise<{ users: Partial<IUser>[]; total: number }>;
  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
}
