import { Types } from "mongoose";

import { IBaseRepository } from "../common/IBaseRepository";

import {
  IUserMealTracking,
  UserMealTrackingStatus,
} from "../../../models/userMealTracking.model";

export interface IUserMealTrackingRepository extends IBaseRepository<IUserMealTracking> {
  findByDay(
    userProgramDayId: string | Types.ObjectId,
  ): Promise<IUserMealTracking[]>;

  findByMeal(
    userProgramDayId: string | Types.ObjectId,
    mealId: string | Types.ObjectId,
  ): Promise<IUserMealTracking | null>;

  findByUserProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserMealTracking[]>;

  updateStatus(
    id: string | Types.ObjectId,
    status: UserMealTrackingStatus,
  ): Promise<IUserMealTracking | null>;

  updateTracking(
    id: string | Types.ObjectId,
    update: Partial<IUserMealTracking>,
  ): Promise<IUserMealTracking | null>;
}
