import { injectable } from "inversify";
import { Types } from "mongoose";

import { BaseRepository } from "../common/base.repository";

import {
  IUserDailyCheckIn,
  UserDailyCheckInModel,
} from "../../../models/userDailyCheckIn.model";

import { IUserDailyCheckInRepository } from "../../interfaces/user/IUserDailyCheckInRepository";

@injectable()
export class UserDailyCheckInRepository
  extends BaseRepository<IUserDailyCheckIn>
  implements IUserDailyCheckInRepository
{
  constructor() {
    super(UserDailyCheckInModel);
  }

  async findByUserAndDate(
    userId: string | Types.ObjectId,
    checkInDate: Date,
  ): Promise<IUserDailyCheckIn | null> {
    return this._model
      .findOne({
        userId,
        checkInDate,
      })
      .lean<IUserDailyCheckIn | null>();
  }

  async findByUserProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserDailyCheckIn[]> {
    return this._model
      .find({
        userProgramId,
      })
      .sort({
        checkInDate: -1,
      })
      .lean<IUserDailyCheckIn[]>();
  }

  async updateCheckIn(
    id: string | Types.ObjectId,
    update: Partial<IUserDailyCheckIn>,
  ): Promise<IUserDailyCheckIn | null> {
    return this._model
      .findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      })
      .lean<IUserDailyCheckIn | null>();
  }
}
