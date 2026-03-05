import { injectable } from "inversify";
import { Types } from "mongoose";
import {WeeklyCheckInModel,IWeeklyCheckIn,} from "../../../models/weeklyCheckIn.model";
import { IWeeklyCheckInRepository } from "../../interfaces/user/IWeeklyCheckInRepository";
import { BaseRepository } from "../common/base.repository";

@injectable()
export class WeeklyCheckInRepository extends BaseRepository<IWeeklyCheckIn> implements IWeeklyCheckInRepository {
    constructor() {
        super(WeeklyCheckInModel);
    }
    
    async upsert(data: Partial<IWeeklyCheckIn>): Promise<IWeeklyCheckIn> {
        if (!data.userProgramId || !data.weekNumber) {
            throw new Error("Missing required fields for weekly check-in upsert");
        }
        
        const doc = await this._model.findOneAndUpdate(
            {
                userProgramId: data.userProgramId,
                weekNumber: data.weekNumber,
            },
            data,
            { upsert: true, new: true }
        ).lean().exec();
        return doc as IWeeklyCheckIn;
    }
    
    async findByProgram(userProgramId: Types.ObjectId): Promise<IWeeklyCheckIn[]> {
        return this._model.find({userProgramId,isDeleted: false})
        .sort({ weekNumber: 1 }).lean().exec();
    }
    
    async findWeek(userProgramId: Types.ObjectId,weekNumber: number): Promise<IWeeklyCheckIn | null> {
        return this._model.findOne({userProgramId,weekNumber,isDeleted: false })
        .lean().exec();
    }
    
    async softDelete(id: Types.ObjectId): Promise<void> {
        await this._model.findByIdAndUpdate(id, { isDeleted: true }).exec();
    }
}