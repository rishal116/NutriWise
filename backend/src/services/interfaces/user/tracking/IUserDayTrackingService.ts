import { Types } from "mongoose";
import { UserDayTrackingDetailsDTO } from "../../../../dtos/user/tracking/user-day-tracking-details.dto";

export interface IUserDayTrackingService {
  initializeDayTracking(
    programId: string | Types.ObjectId,
    programDayId: string | Types.ObjectId,
    dayNumber: number,
    totalActivities: number,
  ): Promise<UserDayTrackingDetailsDTO>;
}
