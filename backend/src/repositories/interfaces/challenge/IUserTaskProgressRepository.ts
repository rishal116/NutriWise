import { IUserTaskProgress } from "../../../models/userTaskProgress.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface IUserTaskProgressRepository
  extends IBaseRepository<IUserTaskProgress> {

  findByUserAndChallenge(
    userId: string,
    challengeId: string
  ): Promise<IUserTaskProgress[]>;

  findByDay(
    userId: string,
    challengeId: string,
    dayNumber: number
  ): Promise<IUserTaskProgress[]>;

  findTaskProgress(
    userId: string,
    taskId: string
  ): Promise<IUserTaskProgress | null>;

  upsertTaskProgress(data: Partial<IUserTaskProgress>): Promise<IUserTaskProgress>;

  markTaskCompleted(
    userId: string,
    taskId: string,
    actualValue?: number
  ): Promise<IUserTaskProgress | null>;

  countCompletedByDay(
    userId: string,
    challengeId: string,
    dayNumber: number
  ): Promise<number>;

  countTotalByDay(
    challengeId: string,
    dayNumber: number
  ): Promise<number>;
}