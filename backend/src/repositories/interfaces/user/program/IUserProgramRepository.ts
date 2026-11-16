import type { ClientSession, FilterQuery, Types, UpdateResult } from "mongoose";

import type { IBaseRepository } from "../../common/IBaseRepository";
import type { IUserProgram } from "../../../../models/userProgram.model";
import type { IUserProgramPopulated } from "../../../../types/userProgram.populated";

export interface IUserProgramRepository extends IBaseRepository<IUserProgram> {
  findActiveByUserAndNutritionist(
    userId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<IUserProgram | null>;

  findCoachingEligibleProgram(
    userId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
    session?: ClientSession,
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

  findExistingPurchase(
    userId: string | Types.ObjectId,
    planId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<IUserProgram | null>;

  activateUpcomingPrograms(): Promise<UpdateResult>;

  completeActivePrograms(): Promise<UpdateResult>;
}
