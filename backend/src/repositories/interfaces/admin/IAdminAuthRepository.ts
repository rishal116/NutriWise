import { AdminDocument } from "../../../models/admin.model";

export interface IAdminAuthRepository {
  findByEmail(email: string): Promise<AdminDocument | null>;
  findAdmin(): Promise<AdminDocument | null>;
}


