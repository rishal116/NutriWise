export enum UserDayTrackingStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  MISSED = "missed",
  SKIPPED = "skipped",
}

export interface UserProgramDayListDTO {
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
