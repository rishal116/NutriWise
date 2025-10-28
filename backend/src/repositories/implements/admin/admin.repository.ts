import { AdminModel, AdminDocument } from "../../../models/admin.model";
import { IAdminRepository } from "../../interfaces/admin/IAdminRepository";

export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<AdminDocument | null> {
    return await AdminModel.findOne({ email });
  }

  async findById(id: string): Promise<AdminDocument | null> {
    return await AdminModel.findById(id);
  }

  async updatePassword(adminId: string, hashedPassword: string): Promise<void> {
    await AdminModel.findByIdAndUpdate(adminId, { password: hashedPassword });
  }

  async saveRefreshToken(adminId: string, token: string): Promise<void> {
    await AdminModel.findByIdAndUpdate(adminId, { refreshToken: token });
  }

  async findByRefreshToken(token: string): Promise<AdminDocument | null> {
    return await AdminModel.findOne({ refreshToken: token });
  }
}
