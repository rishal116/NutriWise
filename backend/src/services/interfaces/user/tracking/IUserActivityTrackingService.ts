import { UpdateActivityTrackingDTO } from "../../../../dtos/user/tracking/update-activity-tracking.dto";
import { CreateUserActivityTrackingDTO } from "../../../../dtos/user/tracking/create-user-activity-tracking.dto";
import { UserActivityTrackingResponseDTO } from "../../../../dtos/user/tracking/user-activity-tracking-response.dto";

export interface IUserActivityTrackingService {
  initializeForDay(
    activities: CreateUserActivityTrackingDTO[],
  ): Promise<UserActivityTrackingResponseDTO[]>;

  startActivity(
    userId: string,
    userProgramId: string,
    userProgramDayId: string,
    activityId: string,
  ): Promise<UserActivityTrackingResponseDTO>;

  updateActivity(
    userId: string,
    userProgramId: string,
    userProgramDayId: string,
    activityId: string,
    data: UpdateActivityTrackingDTO,
  ): Promise<UserActivityTrackingResponseDTO>;

  skipActivity(
    userId: string,
    userProgramId: string,
    userProgramDayId: string,
    activityId: string,
    skippedReason: string,
  ): Promise<UserActivityTrackingResponseDTO>;

  getActivityTracking(
    userId: string,
    userProgramDayId: string,
    activityId: string,
  ): Promise<UserActivityTrackingResponseDTO | null>;

  getDayActivityTracking(
    userId: string,
    userDayTrackingId: string,
  ): Promise<UserActivityTrackingResponseDTO[]>;
}
