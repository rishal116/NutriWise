import { AdminDocument } from "../../../models/admin.model";

export interface IAdminRepository {
  findByEmail(email: string): Promise<AdminDocument | null>;
  findAdmin(): Promise<AdminDocument | null>;
}


