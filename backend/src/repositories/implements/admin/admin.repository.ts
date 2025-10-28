import { AdminModel, AdminDocument } from "../../../models/admin.model";
import { IAdminRepository } from "../../interfaces/admin/IAdminRepository";

export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<AdminDocument | null> {
    return await AdminModel.findOne({ email });
  }
}
