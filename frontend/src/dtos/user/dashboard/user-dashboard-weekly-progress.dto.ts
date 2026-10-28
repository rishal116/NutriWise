export interface UserDashboardDailyProgressDTO {
  date: string;
  completedActivities: number;
  totalActivities: number;
}

export interface UserDashboardWeeklyProgressDTO {
  completedDays: number;
  totalTrackedDays: number;
  completedActivities: number;
  totalActivities: number;
  dailyProgress: UserDashboardDailyProgressDTO[];
}