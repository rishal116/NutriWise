import { injectable } from "inversify";
import { Types } from "mongoose";
import { TaskLogModel, ITaskLog } from "../../../models/taskLog.model";
import { ITaskLogRepository } from "../../interfaces/user/ITaskLogRepository";
import { BaseRepository } from "../common/base.repository";

@injectable()
export class TaskLogRepository
  extends BaseRepository<ITaskLog>
  implements ITaskLogRepository
{
  constructor() {
    super(TaskLogModel);
  }


  async findByUserProgramAndDate(
    userId: Types.ObjectId,
    programId: Types.ObjectId,
    date: Date
  ): Promise<ITaskLog | null> {
    return this._model
      .findOne({
        userId,
        userProgramId: programId,
        date,
      })
      .lean()
      .exec();
  }

  
  async update(id: string, data: Partial<ITaskLog>): Promise<void> {
    await this._model.findByIdAndUpdate(id, data).exec();
  }


  async upsertDailyLog(data: Partial<ITaskLog>): Promise<ITaskLog> {
    const doc = await this._model
      .findOneAndUpdate(
        {
          userId: data.userId,
          userProgramId: data.userProgramId,
          date: data.date,
        },
        data,
        { upsert: true, new: true }
      )
      .lean()
      .exec();

    if (!doc) {
      throw new Error("Failed to upsert daily log");
    }

    return doc;
  }

  async findByDate(
    userId: Types.ObjectId,
    userProgramId: Types.ObjectId,
    date: Date
  ): Promise<ITaskLog | null> {
    return this._model
      .findOne({ userId, userProgramId, date })
      .lean()
      .exec();
  }

  async getLogsByProgram(
    userProgramId: Types.ObjectId
  ): Promise<ITaskLog[]> {
    return this._model
      .find({ userProgramId })
      .sort({ date: -1 })
      .lean()
      .exec();
  }

  async getRecentLogs(
    userProgramId: Types.ObjectId,
    limit: number
  ): Promise<ITaskLog[]> {
    return this._model
      .find({ userProgramId })
      .sort({ date: -1 })
      .limit(limit)
      .lean()
      .exec();
  }
}