import { injectable } from "inversify";
import { Types } from "mongoose";
import { BaseRepository } from "../../common/base.repository";
import {
  IUserDailyCheckIn,
  UserDailyCheckInModel,
} from "../../../../models/userDailyCheckIn.model";
import { IUserDailyCheckInRepository } from "../../../interfaces/user/tracking/IUserDailyCheckInRepository";

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
    date: Date,
  ): Promise<IUserDailyCheckIn | null> {
    return this._model
      .findOne({
        userId,
        date,
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
        date: -1,
      })
      .lean<IUserDailyCheckIn[]>();
  }

  async findByUserDayTracking(
    userDayTrackingId: string | Types.ObjectId,
  ): Promise<IUserDailyCheckIn | null> {
    return this._model
      .findOne({
        userDayTrackingId,
      })
      .lean<IUserDailyCheckIn | null>();
  }
}
