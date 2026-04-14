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
import { TaskLogMapper } from "../../../mapper/user/taskLog.mapper";
import { ITaskLog } from "../../../models/taskLog.model";
import {
  TaskLogResponseDTO,
  UpdateTodayTasksPayload,
} from "../../../dtos/user/taskLog.dto";

@injectable()
export class TaskService implements ITaskService {
  constructor(
    @inject(TYPES.IUserProgramRepository)
    private _userProgramRepo: IUserProgramRepository,

    @inject(TYPES.IProgramDayRepository)
    private _programDayRepo: IProgramDayRepository,

    @inject(TYPES.ITaskLogRepository)
    private _taskLogRepo: ITaskLogRepository,
  ) {}

  async updateTodayTasks(userId: string, payload: UpdateTodayTasksPayload) {
    const { programId, dayNumber } = payload;

    if (!Types.ObjectId.isValid(programId)) {
      throw new CustomError("Invalid programId", StatusCode.BAD_REQUEST);
    }

    const userObjectId = new Types.ObjectId(userId);
    const programObjectId = new Types.ObjectId(programId);

    const program = await this._userProgramRepo.findByIdAndUser(
      userObjectId,
      programObjectId,
    );

    if (!program || program.status !== "ACTIVE") {
      throw new CustomError("Program is not active", StatusCode.BAD_REQUEST);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(program.startDate);
    const diffTime = today.getTime() - startDate.getTime();
    const currentDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (currentDay > program.durationDays) {
      throw new CustomError(
        "Program already completed",
        StatusCode.BAD_REQUEST,
      );
    }

    const programDay = await this._programDayRepo.findByDay(
      program._id,
      currentDay,
    );

    if (!programDay) {
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    const { type, value, title } = payload;

    if (!type || !value) {
      throw new CustomError("Invalid payload", StatusCode.BAD_REQUEST);
    }

    const upsertData: Partial<ITaskLog> = {
      userId: userObjectId,
      userProgramId: program._id,
      programDayId: programDay._id,
      date: today,
    };

    switch (type) {
      case "meals":
        upsertData.mealsCompleted = [
          { mealId: new Types.ObjectId(value), completed: true },
        ];
        break;
      case "workouts":
        upsertData.workoutsCompleted = [
          { workoutId: new Types.ObjectId(value), completed: true },
        ];
        break;
      case "habits":
        upsertData.habitsProgress = [
          { habitId: new Types.ObjectId(value), title: title || "", value: 1 },
        ];
        break;
      default:
        throw new CustomError(
          `Unknown task type: ${type}`,
          StatusCode.BAD_REQUEST,
        );
    }

    const updatedLog = await this._taskLogRepo.upsertDailyLog(upsertData);
    return TaskLogMapper.toResponseDTO(updatedLog, programDay);
  }

  async getTodayTasks(
    userId: string,
    programId: string,
    dayNumber: number,
  ): Promise<TaskLogResponseDTO> {
    if (!programId || dayNumber == null)
      throw new CustomError(
        "ProgramId and dayNumber are required",
        StatusCode.BAD_REQUEST,
      );

    const userObjectId = new Types.ObjectId(userId);
    const programObjectId = new Types.ObjectId(programId);

    const program = await this._userProgramRepo.findByIdAndUser(
      userObjectId,
      programObjectId,
    );
    if (!program)
      throw new CustomError(
        "Program not found for this user",
        StatusCode.NOT_FOUND,
      );

    const programDay = await this._programDayRepo.findByDay(
      program._id,
      dayNumber,
    );
    if (!programDay)
      throw new CustomError(
        `Program day ${dayNumber} not found`,
        StatusCode.NOT_FOUND,
      );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let taskLog = await this._taskLogRepo.findByUserProgramAndDate(
      userObjectId,
      program._id,
      today,
    );
    if (!taskLog) {
      taskLog = {
        _id: new Types.ObjectId(),
        userId: userObjectId,
        userProgramId: program._id,
        programDayId: programDay._id,
        date: today,
        mealsCompleted: [],
        workoutsCompleted: [],
        habitsProgress: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as ITaskLog;
    }

    return TaskLogMapper.toResponseDTO(taskLog, programDay);
  }
}
