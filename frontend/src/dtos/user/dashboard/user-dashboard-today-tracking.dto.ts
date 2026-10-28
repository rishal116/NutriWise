export type UserDayTrackingStatus =
  "not_started" | "in_progress" | "completed" | "missed" | "skipped";

export interface UserDashboardTodayTrackingItemDTO {
  _id: string;
  userProgramId: string;
  userProgramDayId: string;
  dayNumber: number;
  date: string;
  status: UserDayTrackingStatus;
  totalActivities: number;
  completedActivities: number;
  skippedActivities: number;
  completionPercentage: number;
}

export type UserDashboardTodayTrackingDTO = UserDashboardTodayTrackingItemDTO[];
