import { injectable } from "inversify";
import { Types, type ClientSession, type UpdateQuery } from "mongoose";

import {
  HealthDetailsModel,
  type IHealthDetails,
} from "../../../../models/healthDetails.model";
import type { IHealthDetailsRepository } from "../../../interfaces/user/account/IHealthDetailsRepository";
import { BaseRepository } from "../../common/base.repository";

@injectable()
export class HealthDetailsRepository
  extends BaseRepository<IHealthDetails>
  implements IHealthDetailsRepository
{
  constructor() {
    super(HealthDetailsModel);
  }

  async findByUserId(userId: string): Promise<IHealthDetails | null> {
    if (!Types.ObjectId.isValid(userId)) {
      return null;
    }

    return this._model.findOne({ userId: new Types.ObjectId(userId) }).exec();
  }

  async upsertByUserId(
    userId: string,
    data: UpdateQuery<IHealthDetails>,
    session?: ClientSession,
  ): Promise<IHealthDetails | null> {
    if (!Types.ObjectId.isValid(userId)) {
      return null;
    }

    return this._model
      .findOneAndUpdate({ userId: new Types.ObjectId(userId) }, data, {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
        session,
      })
      .exec();
  }
}
