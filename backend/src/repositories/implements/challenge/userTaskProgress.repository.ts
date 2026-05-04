import { BaseRepository } from "../common/base.repository";
import { IUserTaskProgressRepository } from "../../interfaces/challenge/IUserTaskProgressRepository";
import UserTaskProgressModel, {
  IUserTaskProgress,
} from "../../../models/userTaskProgress.model";
import TaskModel from "../../../models/task.model";

export class UserTaskProgressRepository
  extends BaseRepository<IUserTaskProgress>
  implements IUserTaskProgressRepository
{
  constructor() {
    super(UserTaskProgressModel);
  }

  async findByUserAndChallenge(
    userId: string,
    challengeId: string
  ): Promise<IUserTaskProgress[]> {
    return this._model.find({ userId, challengeId });
  }

  async findByDay(
    userId: string,
    challengeId: string,
    dayNumber: number
  ): Promise<IUserTaskProgress[]> {
    return this._model.find({
      userId,
      challengeId,
      dayNumber,
    });
  }

  async findTaskProgress(
    userId: string,
    taskId: string
  ): Promise<IUserTaskProgress | null> {
    return this._model.findOne({ userId, taskId });
  }

  async upsertTaskProgress(
    data: Partial<IUserTaskProgress>
  ): Promise<IUserTaskProgress> {
    return this._model.findOneAndUpdate(
      {
        userId: data.userId,
        taskId: data.taskId,
      },
      data,
      { upsert: true, new: true }
    );
  }

  async markTaskCompleted(
    userId: string,
    taskId: string,
    actualValue?: number
  ): Promise<IUserTaskProgress | null> {
    return this._model.findOneAndUpdate(
      { userId, taskId },
      {
        completed: true,
        actualValue,
        completedAt: new Date(),
      },
      { new: true }
    );
  }

  async countCompletedByDay(
    userId: string,
    challengeId: string,
    dayNumber: number
  ): Promise<number> {
    return this._model.countDocuments({
      userId,
      challengeId,
      dayNumber,
      completed: true,
    });
  }

  async countTotalByDay(
    challengeId: string,
    dayNumber: number
  ): Promise<number> {
    return TaskModel.countDocuments({
      challengeId,
      dayNumber,
    });
  }
}