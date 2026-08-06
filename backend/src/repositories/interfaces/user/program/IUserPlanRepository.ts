import {
  ClientSession,
  FilterQuery,
  Types,
  UpdateQuery,
  UpdateResult,
} from "mongoose";
import { IUserPlan } from "../../../../models/userPlan.model";
import { IUserPlanPopulated } from "../../../../types/userPlan.populated";
import { IBaseRepository } from "../../common/IBaseRepository";

export interface IUserPlanRepository extends IBaseRepository<IUserPlan> {


  updateByIdWithSession(
    id: string | Types.ObjectId,
    update: UpdateQuery<IUserPlan>,
    session: ClientSession,
  ): Promise<IUserPlan | null>;

  updateOneWithSession(
    filter: FilterQuery<IUserPlan>,
    update: UpdateQuery<IUserPlan>,
    session: ClientSession,
  ): Promise<number>;

  findBySessionId(sessionId: string): Promise<IUserPlan | null>;

  findActiveByUserAndNutritionist(
    userId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserPlan | null>;

  findLatestPlan(
    userId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserPlan | null>;

  findByUserId(userId: string | Types.ObjectId): Promise<IUserPlanPopulated[]>;

  findByNutritionistId(
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserPlanPopulated[]>;

  findOnePopulated(
    filter: FilterQuery<IUserPlan>,
  ): Promise<IUserPlanPopulated | null>;

  activatePlan(id: string | Types.ObjectId): Promise<IUserPlan | null>;

  expireById(
    id: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<void>;

  activateUpcomingPlans(): Promise<UpdateResult>;

  expireActivePlans(): Promise<UpdateResult>;
}
