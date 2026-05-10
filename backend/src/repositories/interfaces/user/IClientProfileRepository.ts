

import { IClientProfile } from "../../../models/clientProfile.model";

export interface IClientProfileRepository {
  findByUserId(userId: string): Promise<IClientProfile | null>;

  createProfile(
    data: Partial<IClientProfile>,
  ): Promise<IClientProfile>;

  updateByUserId(
    userId: string,
    data: Partial<IClientProfile>,
  ): Promise<IClientProfile>;

  deleteByUserId(userId: string): Promise<boolean>;
}