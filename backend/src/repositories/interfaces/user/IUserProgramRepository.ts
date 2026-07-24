import { ClientSession, FilterQuery, Types, UpdateResult } from "mongoose";
import { IBaseRepository } from "../common/IBaseRepository";
import { IUserProgram } from "../../../models/userProgram.model";
import { IUserProgramPopulated } from "../../../types/userProgram.populated";


export interface IUserProgramRepository extends IBaseRepository<IUserProgram> {
  createWithSession(
    data: Partial<IUserProgram>,
    session: ClientSession,
  ): Promise<IUserProgram>;

  findActiveByUserAndNutritionist(
    userId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserProgram | null>;

  findLatestProgram(
    userId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserProgram | null>;

  findByUserId(
    userId: string | Types.ObjectId,
  ): Promise<IUserProgramPopulated[]>;

  findByNutritionistId(
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserProgramPopulated[]>;

  findOnePopulated(
    filter: FilterQuery<IUserProgram>,
  ): Promise<IUserProgramPopulated | null>;

  findByUserAndPlan(
    userId: string | Types.ObjectId,
    planId: string | Types.ObjectId,
  ): Promise<IUserProgram[]>;

  findByIdAndUser(
    userId: string | Types.ObjectId,
    programId: string | Types.ObjectId,
  ): Promise<IUserProgram | null>;

  updateProgress(
    programId: string | Types.ObjectId,
    currentDay: number,
    completionPercentage: number,
    session?: ClientSession,
  ): Promise<IUserProgram | null>;

  activateUpcomingPrograms(): Promise<UpdateResult>;

  completeActivePrograms(): Promise<UpdateResult>;
}
