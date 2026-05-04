import { CreateTaskDTO } from "../../../dtos/challenge/task.dto";
import { ITask } from "../../../models/task.model";
import { IBaseRepository } from "../common/IBaseRepository";
import { ClientSession } from "mongoose";

export interface ITaskRepository extends IBaseRepository<ITask> {
  findByChallengeId(challengeId: string): Promise<ITask[]>;

  findByChallengeAndDay(
    challengeId: string,
    dayNumber: number,
  ): Promise<ITask[]>;

  insertManyTasks(tasks: CreateTaskDTO[], session?: ClientSession): Promise<ITask[]>;

  deleteByChallengeId(challengeId: string): Promise<void>;

  countByChallenge(challengeId: string): Promise<number>;
  findByCategory(category: string): Promise<ITask[]>;

  searchTasks(query: string): Promise<ITask[]>;

  incrementCompletion(taskId: string): Promise<void>;
}
