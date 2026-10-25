import type { ClientSession, UpdateQuery } from "mongoose";

import type { IHealthDetails } from "../../../../models/healthDetails.model";
import type { IBaseRepository } from "../../common/IBaseRepository";

export interface IHealthDetailsRepository
  extends IBaseRepository<IHealthDetails> {
  findByUserId(userId: string): Promise<IHealthDetails | null>;

  upsertByUserId(
    userId: string,
    data: UpdateQuery<IHealthDetails>,
    session?: ClientSession,
  ): Promise<IHealthDetails | null>;
}