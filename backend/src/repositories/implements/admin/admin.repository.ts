import { AdminModel, AdminDocument } from "../../../models/admin.model";
import { IAdminAuthRepository } from "../../interfaces/admin/IAdminAuthRepository";

export class AdminAuthRepository implements IAdminAuthRepository {
  async findByEmail(email: string): Promise<AdminDocument | null> {
    return await AdminModel.findOne({ email });
  }
  
  async findAdmin(): Promise<AdminDocument | null> {
    return await AdminModel.findOne({});
  }
}
