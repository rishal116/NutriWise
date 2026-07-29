import { Types } from "mongoose";
import { IBaseRepository } from "../common/IBaseRepository";
import {
  IUserDayTracking,
  UserDayTrackingStatus,
} from "../../../models/userDayTracking.model";

export interface IUserDayTrackingRepository extends IBaseRepository<IUserDayTracking> {
  findByProgramDay(
    userProgramId: string | Types.ObjectId,
    dayNumber: number,
  ): Promise<IUserDayTracking | null>;

  findByUserProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserDayTracking[]>;

  findCurrentDay(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserDayTracking | null>;

  updateStatus(
    id: string | Types.ObjectId,
    status: UserDayTrackingStatus,
  ): Promise<IUserDayTracking | null>;

  updateProgress(
    id: string | Types.ObjectId,
    mealCompletionPercentage: number,
    workoutCompletionPercentage: number,
    habitCompletionPercentage: number,
    overallCompletionPercentage: number,
  ): Promise<IUserDayTracking | null>;
}
