import { ITask } from "../../../models/task.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface ITaskRepository extends IBaseRepository<ITask> {
  findByChallengeId(challengeId: string): Promise<ITask[]>;
  findByChallengeAndDay(
    challengeId: string,
    dayNumber: number,
  ): Promise<ITask[]>;
  deleteByChallengeId(challengeId: string): Promise<void>;
  softDelete(id: string): Promise<void>;
}