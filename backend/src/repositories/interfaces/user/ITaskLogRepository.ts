import { Types } from "mongoose";
import { ITaskLog } from "../../../models/taskLog.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface ITaskLogRepository extends IBaseRepository<ITaskLog> {
  findByUserProgramAndDate(
    userId: Types.ObjectId,
    programId: Types.ObjectId,
    date: Date,
  ): Promise<ITaskLog | null>;

  create(data: Partial<ITaskLog>): Promise<ITaskLog>;

  update(id: string, data: Partial<ITaskLog>): Promise<void>;
  upsertDailyLog(data: Partial<ITaskLog>): Promise<ITaskLog>;
  findByDate(
    userId: Types.ObjectId,
    userProgramId: Types.ObjectId,
    date: Date,
  ): Promise<ITaskLog | null>;
  getLogsByProgram(userProgramId: Types.ObjectId): Promise<ITaskLog[]>;
  getRecentLogs(
    userProgramId: Types.ObjectId,
    limit: number,
  ): Promise<ITaskLog[]>;
}
