import { UpdateQuery } from "mongoose";
import { IHealthDetails } from "../../../../models/healthDetails.model";
import { IBaseRepository } from "../../common/IBaseRepository"; 

export interface IHealthDetailsRepository extends IBaseRepository<IHealthDetails> {
  findByUserId(userId: string): Promise<IHealthDetails | null>;

  upsertByUserId(
    userId: string,
    data: UpdateQuery<IHealthDetails>,
  ): Promise<IHealthDetails | null>;
}
