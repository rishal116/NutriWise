import { Types } from "mongoose";
import { IBaseRepository } from "../../common/IBaseRepository";
import { ProgramActivityCategory } from "../../../../models/userProgramDay.model";
import {
  CreateUserActivityTrackingData,
  IUserActivityTracking,
  UserActivityTrackingStatus,
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
    status: UserActivityTrackingStatus,
  ): Promise<IUserActivityTracking[]>;

  findByCategory(
    userProgramId: string | Types.ObjectId,
    category: ProgramActivityCategory,
  ): Promise<IUserActivityTracking[]>;

  initializeForDay(
    activities: CreateUserActivityTrackingData[],
  ): Promise<IUserActivityTracking[]>;

}
