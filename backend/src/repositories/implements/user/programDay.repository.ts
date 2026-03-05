import { injectable } from "inversify";
import { Types } from "mongoose";
import { BaseRepository } from "../common/base.repository"; 
import {ProgramDayModel,IProgramDay,} from "../../../models/programDay.model";
import { IProgramDayRepository } from "../../interfaces/user/IProgramDayRepository";

@injectable()
export class ProgramDayRepository
  extends BaseRepository<IProgramDay>
  implements IProgramDayRepository
{
  constructor() {
    super(ProgramDayModel);
  }

  async findByUserProgram(
    userProgramId: Types.ObjectId
  ): Promise<IProgramDay[]> {
    return this._model
      .find({ userProgramId })
      .sort({ dayNumber: 1 })
      .lean()
      .exec();
  }

  async findByDay(
    userProgramId: Types.ObjectId,
    dayNumber: number
  ): Promise<IProgramDay | null> {
    return this._model
      .findOne({ userProgramId, dayNumber })
      .lean()
      .exec();
  }

  
  async existsByDayNumber(
    userProgramId: Types.ObjectId,
    dayNumber: number
  ): Promise<boolean> {
    const exists = await this._model.exists({ userProgramId, dayNumber });
    return !!exists;
  }

  async bulkCreate(days: Partial<IProgramDay>[]): Promise<IProgramDay[]> {
    const docs = await this._model.insertMany(days, { ordered: false });
    return docs.map((doc) => doc.toObject());
  }

  async deleteByUserProgram(userProgramId: Types.ObjectId): Promise<void> {
    await this._model.deleteMany({ userProgramId }).exec();
  }
}