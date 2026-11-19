import { Types } from "mongoose";
import { IBaseRepository } from "../../common/IBaseRepository";
import { type ProgramActivityCategory } from "../../../../constants/user/program/program-activity-category.constants";
import { type ActivityTrackingStatus } from "../../../../constants/user/program/activity-tracking-status.constants";
import {
  CreateUserActivityTrackingData,
  IUserActivityTracking,
} from "../../../../models/userActivityTracking.model";

export interface IUserActivityTrackingRepository extends IBaseRepository<IUserActivityTracking> {
  findByDayTracking(
    userDayTrackingId: string | Types.ObjectId,
  ): Promise<IUserActivityTracking[]>;

  findByProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserActivityTracking[]>;

  findByDayAndActivity(
    userDayTrackingId: string | Types.ObjectId,
    activityId: string | Types.ObjectId,
  ): Promise<IUserActivityTracking | null>;

  findByStatus(
    userProgramId: string | Types.ObjectId,
    status: ActivityTrackingStatus,
  ): Promise<IUserActivityTracking[]>;

  findByCategory(
    userProgramId: string | Types.ObjectId,
    category: ProgramActivityCategory,
  ): Promise<IUserActivityTracking[]>;

  initializeForDay(
    activities: CreateUserActivityTrackingData[],
  ): Promise<IUserActivityTracking[]>;

}
