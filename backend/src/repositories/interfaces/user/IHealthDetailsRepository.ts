import { IHealthDetails } from "../../../models/healthDetails.model";

export interface IHealthDetailsRepository {
  findByUserId(userId: string): Promise<IHealthDetails | null>;
  upsertByUserId(userId: string, data: Partial<IHealthDetails>): Promise<IHealthDetails>;
}