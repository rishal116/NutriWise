import { Types } from "mongoose";

import { IBaseRepository } from "../common/IBaseRepository";

import { IUserDailyCheckIn } from "../../../models/userDailyCheckIn.model";

export interface IUserDailyCheckInRepository extends IBaseRepository<IUserDailyCheckIn> {
  findByUserAndDate(
    userId: string | Types.ObjectId,
    checkInDate: Date,
  ): Promise<IUserDailyCheckIn | null>;

  findByUserProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserDailyCheckIn[]>;

  updateCheckIn(
    id: string | Types.ObjectId,
    update: Partial<IUserDailyCheckIn>,
  ): Promise<IUserDailyCheckIn | null>;
}
