import { Types } from "mongoose";
import { IBaseRepository } from "../common/IBaseRepository";
import { IUserProgram } from "../../../models/userProgram.model";
import { IUserProgramPopulated } from "../../../types/userProgram.populated";

export interface IUserProgramRepository extends IBaseRepository<IUserProgram> {
  findActiveByUser(userId: Types.ObjectId): Promise<IUserProgram | null>;

  findByUser(userId: Types.ObjectId): Promise<IUserProgramPopulated[]>;

  findByNutritionist(
    nutritionistId: Types.ObjectId
  ): Promise<IUserProgramPopulated[]>;

  findByUserAndPlan(
    userId: Types.ObjectId,
    planId: Types.ObjectId
  ): Promise<IUserProgram[]>;

  updateProgress(
    programId: Types.ObjectId,
    currentDay: number
  ): Promise<IUserProgram | null>;

  findByIdPopulated(id: string): Promise<IUserProgramPopulated | null>;
}