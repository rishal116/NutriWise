import { UserDayTrackingStatus } from "../../../models/userDayTracking.model";

export interface UserProgramDayListResponseDTO {
  _id: string;
  userProgramId: string;
  dayNumber: number;
  totalActivities: number;
  requiredActivities: number;
  status: UserDayTrackingStatus;
  completedActivities: number;
  skippedActivities: number;
  completionPercentage: number;
  adherenceScore: number;
  isLocked: boolean;
}
