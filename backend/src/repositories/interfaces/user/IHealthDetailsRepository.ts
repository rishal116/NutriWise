import { IHealthDetails } from "../../../models/clientProfile.model";

export interface IHealthDetailsRepository {
  findByUserId(userId: string): Promise<IHealthDetails | null>;
  upsertByUserId(userId: string, data: Partial<IHealthDetails>): Promise<IHealthDetails>;
  updateByUserId(userId: string, data: Partial<IHealthDetails>): Promise<IHealthDetails | null>;
  getProfileImageByUserId(userId: string): Promise<{ profileImage?: string } | null>
}