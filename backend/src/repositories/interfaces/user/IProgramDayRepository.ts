import { Types } from "mongoose";
import { IBaseRepository } from "../common/IBaseRepository";
import { IProgramDay } from "../../../models/programDay.model";

export interface IProgramDayRepository extends IBaseRepository<IProgramDay> {
  findByUserProgram(userProgramId: Types.ObjectId): Promise<IProgramDay[]>;
  findByDay(
    userProgramId: Types.ObjectId,
    dayNumber: number
  ): Promise<IProgramDay | null>;
  bulkCreate(days: Partial<IProgramDay>[]): Promise<IProgramDay[]>;
  deleteByUserProgram(userProgramId: Types.ObjectId): Promise<void>;
  existsByDayNumber(
    userProgramId: Types.ObjectId,
    dayNumber: number
  ): Promise<boolean>;
}