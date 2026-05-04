import { BaseRepository } from "../common/base.repository";
import { ITaskRepository } from "../../interfaces/challenge/ITaskRepository";
import TaskModel, { ITask } from "../../../models/task.model";
import { CreateTaskDTO } from "../../../dtos/challenge/task.dto";
import { ClientSession } from "mongoose";

export class TaskRepository
  extends BaseRepository<ITask>
  implements ITaskRepository
{
  constructor() {
    super(TaskModel);
  }

  async findByChallengeId(challengeId: string): Promise<ITask[]> {
    return this._model
      .find({
        challengeId,
        isDeleted: false,
      })
      .sort({ dayNumber: 1, order: 1 });
  }

  async findByChallengeAndDay(
    challengeId: string,
    dayNumber: number,
  ): Promise<ITask[]> {
    return this._model
      .find({
        challengeId,
        dayNumber,
        isDeleted: false,
      })
      .sort({ order: 1 });
  }

  async insertManyTasks(
    tasks: CreateTaskDTO[],
    session?: ClientSession,
  ): Promise<ITask[]> {
    const docs = await this._model.insertMany(tasks, { session });
    return docs;
  }

  async deleteByChallengeId(challengeId: string): Promise<void> {
    await this._model.updateMany(
      { challengeId },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
    );
  }
  async findByCategory(category: string): Promise<ITask[]> {
    return this._model.find({
      category,
      isDeleted: false,
    });
  }

  async searchTasks(query: string): Promise<ITask[]> {
    return this._model.find({
      $text: { $search: query },
      isDeleted: false,
    });
  }
  async countByChallenge(challengeId: string): Promise<number> {
    return this._model.countDocuments({ challengeId });
  }

  async incrementCompletion(taskId: string): Promise<void> {
    await this._model.findByIdAndUpdate(taskId, {
      $inc: { completionCount: 1 },
    });
  }
}
