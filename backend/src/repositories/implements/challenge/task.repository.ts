import { BaseRepository } from "../common/base.repository";
import { ITaskRepository } from "../../interfaces/challenge/ITaskRepository";
import TaskModel, { ITask } from "../../../models/task.model";

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

  async deleteByChallengeId(challengeId: string): Promise<void> {
    await this._model.updateMany(
      { challengeId },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
    );
  }

  async softDelete(id: string): Promise<void> {
    await this._model.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  }
}

