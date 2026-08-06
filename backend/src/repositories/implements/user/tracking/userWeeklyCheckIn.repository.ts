import { injectable } from "inversify";
import { Types } from "mongoose";
import { BaseRepository } from "../../common/base.repository";
import {
  IUserWeeklyCheckIn,
  UserWeeklyCheckInModel,
} from "../../../../models/userWeeklyCheckIn.model";
import { IUserWeeklyCheckInRepository } from "../../../interfaces/user/tracking/IUserWeeklyCheckInRepository";

@injectable()
export class UserWeeklyCheckInRepository
  extends BaseRepository<IUserWeeklyCheckIn>
  implements IUserWeeklyCheckInRepository
{
  constructor() {
    super(UserWeeklyCheckInModel);
  }

  async findByProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserWeeklyCheckIn[]> {
    return this._model
      .find({
        userProgramId,
      })
      .sort({
        weekNumber: 1,
      })
      .lean<IUserWeeklyCheckIn[]>();
  }

  async findByWeek(
    userProgramId: string | Types.ObjectId,
    weekNumber: number,
  ): Promise<IUserWeeklyCheckIn | null> {
    return this._model
      .findOne({
        userProgramId,
        weekNumber,
      })
      .lean<IUserWeeklyCheckIn | null>();
  }

  async findLatestByProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserWeeklyCheckIn | null> {
    return this._model
      .findOne({
        userProgramId,
      })
      .sort({
        weekNumber: -1,
      })
      .lean<IUserWeeklyCheckIn | null>();
  }

  async updateWeeklyCheckIn(
    id: string | Types.ObjectId,
    update: Partial<IUserWeeklyCheckIn>,
  ): Promise<IUserWeeklyCheckIn | null> {
    return this._model
      .findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      })
      .lean<IUserWeeklyCheckIn | null>();
  }
}
