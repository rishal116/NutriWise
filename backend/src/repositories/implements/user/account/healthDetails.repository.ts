import { injectable } from "inversify";
import { BaseRepository } from "../../common/base.repository";
import { IHealthDetailsRepository } from "../../../interfaces/user/account/IHealthDetailsRepository";
import {
  HealthDetailsModel,
  IHealthDetails,
} from "../../../../models/healthDetails.model";
import { Types, UpdateQuery } from "mongoose";

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
    data: UpdateQuery<IHealthDetails>,
  ): Promise<IHealthDetails | null> {
    return this._model.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $set: data },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );
  }
}
