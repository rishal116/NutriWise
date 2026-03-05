import { Types } from "mongoose";
import { IWeeklyCheckIn } from "../../../models/weeklyCheckIn.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface IWeeklyCheckInRepository extends IBaseRepository<IWeeklyCheckIn> {
    upsert(data: Partial<IWeeklyCheckIn>): Promise<IWeeklyCheckIn>;
    findByProgram(userProgramId: Types.ObjectId): Promise<IWeeklyCheckIn[]>;
    findWeek(
        userProgramId: Types.ObjectId,
        weekNumber: number
    ): Promise<IWeeklyCheckIn | null>;
    softDelete(id: Types.ObjectId): Promise<void>;
}