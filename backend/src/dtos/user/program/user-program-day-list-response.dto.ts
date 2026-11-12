import { DayTrackingStatus } from "../../../constants/user/program/day-tracking-status.constants";


export class UserProgramDayListResponseDTO {
  _id!: string;
  userProgramId!: string;
  dayNumber!: number;
  totalActivities!: number;
  requiredActivities!: number;
  status!: DayTrackingStatus;
  completedActivities!: number;
  skippedActivities!: number;
  completionPercentage!: number;
  isLocked!: boolean;
}
