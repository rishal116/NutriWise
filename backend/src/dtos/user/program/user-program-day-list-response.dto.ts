import type { UserDayTrackingStatus } from "../../../models/userDayTracking.model";

export class UserProgramDayListResponseDTO {
  _id!: string;
  userProgramId!: string;
  dayNumber!: number;
  totalActivities!: number;
  requiredActivities!: number;
  status!: UserDayTrackingStatus;
  completedActivities!: number;
  skippedActivities!: number;
  completionPercentage!: number;
  isLocked!: boolean;
}
