import { Types } from "mongoose";
import { IBaseRepository } from "../../common/IBaseRepository";
import { IUserWeeklyCheckIn } from "../../../../models/userWeeklyCheckIn.model";

export interface IUserWeeklyCheckInRepository extends IBaseRepository<IUserWeeklyCheckIn> {
  findByProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserWeeklyCheckIn[]>;

  findByWeek(
    userProgramId: string | Types.ObjectId,
    weekNumber: number,
  ): Promise<IUserWeeklyCheckIn | null>;

  findLatestByProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserWeeklyCheckIn | null>;

  updateWeeklyCheckIn(
    id: string | Types.ObjectId,
    update: Partial<IUserWeeklyCheckIn>,
  ): Promise<IUserWeeklyCheckIn | null>;
}
