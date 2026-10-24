import { Types } from "mongoose";
import { IBaseRepository } from "../../common/IBaseRepository";
import {
  IUserDayTracking,
  UserDayTrackingStatus,
} from "../../../../models/userDayTracking.model";

export interface IUserDayTrackingRepository extends IBaseRepository<IUserDayTracking> {
  findByUserProgramDay(
    userProgramId: string | Types.ObjectId,
    dayNumber: number,
  ): Promise<IUserDayTracking | null>;

  findByUserProgram(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserDayTracking[]>;

  findCurrentDay(
    userProgramId: string | Types.ObjectId,
  ): Promise<IUserDayTracking | null>;

  findOrCreateForProgramDay(
    trackingData: Partial<IUserDayTracking> & {
      userProgramId: Types.ObjectId;
      userProgramDayId: Types.ObjectId;
      dayNumber: number;
    },
  ): Promise<IUserDayTracking>;

  updateStatus(
    id: string | Types.ObjectId,
    status: UserDayTrackingStatus,
  ): Promise<IUserDayTracking | null>;

  lock(id: string | Types.ObjectId): Promise<IUserDayTracking | null>;

  unlock(id: string | Types.ObjectId): Promise<IUserDayTracking | null>;

  findByProgramAndProgramDay(
    userProgramId: string | Types.ObjectId,
    userProgramDayId: string | Types.ObjectId,
  ): Promise<IUserDayTracking | null>;
}
