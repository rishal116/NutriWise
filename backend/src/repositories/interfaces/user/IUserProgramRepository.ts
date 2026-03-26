import { IBaseRepository } from "../common/IBaseRepository";
import { IUserProgram } from "../../../models/userProgram.model";
import { IUserProgramPopulated } from "../../../types/userProgram.populated";
import { Types, ClientSession } from "mongoose";

export interface IUserProgramRepository extends IBaseRepository<IUserProgram> {
  create(
    data: Partial<IUserProgram>,
    session?: ClientSession,
  ): Promise<IUserProgram>;

  findActiveByUserAndNutritionist(
    userId: Types.ObjectId,
    nutritionistId: Types.ObjectId,
  ): Promise<IUserProgram | null>;

  findLatestProgram(
    userId: Types.ObjectId,
    nutritionistId: Types.ObjectId,
  ): Promise<IUserProgram | null>;

  findByUser(userId: Types.ObjectId): Promise<IUserProgramPopulated[]>;

  findByNutritionist(
    nutritionistId: Types.ObjectId,
  ): Promise<IUserProgramPopulated[]>;

  findByUserAndPlan(
    userId: Types.ObjectId,
    planId: Types.ObjectId,
  ): Promise<IUserProgram[]>;

  findByIdAndUser(
    userId: Types.ObjectId,
    programId: Types.ObjectId,
  ): Promise<IUserProgram | null>;

  updateProgress(
    programId: Types.ObjectId,
    currentDay: number,
    session?: ClientSession,
  ): Promise<IUserProgram | null>;

  findByIdPopulated(id: string): Promise<IUserProgramPopulated | null>;

  activatePrograms(): Promise<any>;

  completePrograms(): Promise<any>;
}
