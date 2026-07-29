import {
  UserDayTrackingDTO,
  UserDayTrackingDetailsDTO,
  UpdateUserDayTrackingDTO,
} from "../../../dtos/user/tracking/userDayTracking.dto";

export interface IUserDayTrackingService {
  initializeDayTracking(
    userId: string,
    userProgramId: string,
    dayNumber: number,
  ): Promise<UserDayTrackingDetailsDTO>;

  getDayTracking(
    userId: string,
    userProgramId: string,
    dayNumber: number,
  ): Promise<UserDayTrackingDetailsDTO>;

  getProgramTracking(
    userId: string,
    userProgramId: string,
  ): Promise<UserDayTrackingDTO[]>;

  updateDayTracking(
    userId: string,
    trackingId: string,
    dto: UpdateUserDayTrackingDTO,
  ): Promise<UserDayTrackingDTO>;

  recalculateDayProgress(
    trackingId: string,
  ): Promise<void>;

  completeDay(
    userId: string,
    trackingId: string,
  ): Promise<void>;

  reopenDay(
    userId: string,
    trackingId: string,
  ): Promise<void>;
}