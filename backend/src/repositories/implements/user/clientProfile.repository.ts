import { injectable } from "inversify";
import { Types } from "mongoose";

import { BaseRepository } from "../../implements/common/base.repository";

import { IClientProfileRepository } from "../../interfaces/user/IClientProfileRepository";

import {
  ClientProfileModel,
  IClientProfile,
} from "../../../models/clientProfile.model";

@injectable()
export class ClientProfileRepository
  extends BaseRepository<IClientProfile>
  implements IClientProfileRepository
{
  constructor() {
    super(ClientProfileModel);
  }

  async findByUserId(userId: string): Promise<IClientProfile | null> {
    return this._model
      .findOne({
        userId: new Types.ObjectId(userId),
      })
      .exec();
  }

  async createProfile(data: Partial<IClientProfile>): Promise<IClientProfile> {
    return await this._model.create(data);
  }

  async updateByUserId(
    userId: string,
    data: Partial<IClientProfile>,
  ): Promise<IClientProfile> {
    return this._model
      .findOneAndUpdate(
        {
          userId: new Types.ObjectId(userId),
        },
        {
          $set: data,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec() as Promise<IClientProfile>;
  }


  async deleteByUserId(userId: string): Promise<boolean> {
    const result = await this._model
      .findOneAndDelete({
        userId: new Types.ObjectId(userId),
      })
      .exec();

    return !!result;
  }
}
