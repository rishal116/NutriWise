import { Types } from "mongoose";
import { IUserProgramDay } from "../../../models/userProgramDay.model";
import { IBaseRepository } from "../common/IBaseRepository";
import {
  IUserProgramDayDetailsProjection,
  IUserProgramDayListProjection,
} from "../../../types/user/program/user-program-day.projection";

export interface IUserProgramDayRepository extends IBaseRepository<IUserProgramDay> {
  browseProgramDays(
    userId: string | Types.ObjectId,
    programId: string | Types.ObjectId,
  ): Promise<IUserProgramDayListProjection[]>;

  findProgramDayDetails(
    userId: string | Types.ObjectId,
    programId: string | Types.ObjectId,
    dayNumber: number,
  ): Promise<IUserProgramDayDetailsProjection | null>;
}
