import { injectable } from "inversify";
import { BaseRepository } from "../../implements/common/base.repository";
import { IHealthDetailsRepository } from "../../interfaces/user/IHealthDetailsRepository";
import {
  HealthDetailsModel,
  IHealthDetails,
} from "../../../models/healthDetails.model";
import { Types } from "mongoose";

@injectable()
export class HealthDetailsRepository
  extends BaseRepository<IHealthDetails>
  implements IHealthDetailsRepository
{
  constructor() {
    super(HealthDetailsModel);
  }

  async findByUserId(userId: string): Promise<IHealthDetails | null> {
    return this._model.findOne({ userId: new Types.ObjectId(userId) }).exec();
  }

  async upsertByUserId(
    userId: string,
    data: Partial<IHealthDetails>,
  ): Promise<IHealthDetails> {
    return this._model
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        { $set: data },
        {
          new: true,
          upsert: true,
          runValidators: true,
        },
      )
      .exec() as Promise<IHealthDetails>;
  }
}
