import { AdminDocument } from "../../../models/admin.model";

export interface IAdminRepository {
  findByEmail(email: string): Promise<AdminDocument | null>;
  findById(id: string): Promise<AdminDocument | null>;
  updatePassword(adminId: string, hashedPassword: string): Promise<void>;
  saveRefreshToken(adminId: string, token: string): Promise<void>;
  findByRefreshToken(token: string): Promise<AdminDocument | null>;
}


