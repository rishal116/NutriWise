import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { ITaskService } from "../../interfaces/user/ITaskService";
import { IUserProgramRepository } from "../../../repositories/interfaces/user/IUserProgramRepository";
import { IProgramDayRepository } from "../../../repositories/interfaces/user/IProgramDayRepository";
import { ITaskLogRepository } from "../../../repositories/interfaces/user/ITaskLogRepository";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { Types } from "mongoose";
import logger from "../../../utils/logger";

@injectable()
export class TaskService implements ITaskService {
    constructor(
        @inject(TYPES.IUserProgramRepository)
        private _userProgramRepo: IUserProgramRepository,
        
        @inject(TYPES.IProgramDayRepository)
        private _programDayRepo: IProgramDayRepository,

        @inject(TYPES.ITaskLogRepository)
        private _taskLogRepo: ITaskLogRepository
    ) {}
    
async getTodayTasks(userId: string) {
  logger.debug("Fetching today tasks for userId: %s", userId);

  const userObjectId = new Types.ObjectId(userId);

 
  const program = await this._userProgramRepo.findActiveByUser(userObjectId);

  if (!program) {
    logger.warn("No active program for userId: %s", userId);
    throw new CustomError("No active program", StatusCode.NOT_FOUND);
  }

  logger.debug(
    "Active program found. programId: %s, currentDay: %d",
    program._id,
    program.currentDay
  );

  
  const programDay = await this._programDayRepo.findByDay(
    program._id,
    program.currentDay
  );

  if (!programDay) {
    logger.error(
      "Program day not found. programId: %s, day: %d",
      program._id,
      program.currentDay
    );
    throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
  }

 
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  logger.debug(
    "Looking for task log. userId: %s, programId: %s, date: %s",
    userId,
    program._id,
    today.toISOString()
  );

 
  let taskLog = await this._taskLogRepo.findByUserProgramAndDate(
    userObjectId,
    program._id,
    today
  );

 
  if (!taskLog) {
    logger.info(
      "Task log not found. Creating new log for userId: %s, programId: %s",
      userId,
      program._id
    );

    taskLog = await this._taskLogRepo.create({
      userId: userObjectId,
      userProgramId: program._id,
      programDayId: programDay._id,
      date: today,
    });
  } else {
    logger.debug("Existing task log found. taskLogId: %s", taskLog._id);
  }

  logger.info(
    "Today tasks ready for userId: %s (programId: %s, day: %d)",
    userId,
    program._id,
    program.currentDay
  );

  return {
    program,
    programDay,
    taskLog,
  };
}

async updateTodayTasks(userId: string, payload: any) {
  logger.debug("Updating today tasks for userId: %s", userId);

  const userObjectId = new Types.ObjectId(userId);

  const program = await this._userProgramRepo.findActiveByUser(userObjectId);
  if (!program) {
    logger.warn("No active program while updating tasks. userId: %s", userId);
    throw new CustomError("No active program", StatusCode.NOT_FOUND);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskLog = await this._taskLogRepo.findByUserProgramAndDate(
    userObjectId,
    program._id,
    today
  );

  if (!taskLog) {
    logger.error(
      "Task log missing during update. userId: %s, programId: %s",
      userId,
      program._id
    );
    throw new CustomError("Task log not found", StatusCode.NOT_FOUND);
  }

  await this._taskLogRepo.update(taskLog._id.toString(), payload);

  logger.info(
    "Today tasks updated successfully. userId: %s, taskLogId: %s",
    userId,
    taskLog._id
  );
}
}