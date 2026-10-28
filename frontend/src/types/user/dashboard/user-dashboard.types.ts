
export type UserProgramStatus =
  | "upcoming"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export type UserDayTrackingStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "missed"
  | "skipped";

export type MeetingStatus =
  | "scheduled"
  | "ongoing"
  | "completed"
  | "cancelled";

export interface IUserDashboardStats {
  totalPrograms: number;
  activePrograms: number;
  completedPrograms: number;
  upcomingPrograms: number;
  pausedPrograms: number;
  cancelledPrograms: number;
  upcomingConsultations: number;
  unreadNotifications: number;
  activeChallenges: number;
  completedChallenges: number;
}

export interface IUserDashboardProgram {
  id: string;
  userPlanId: string;
  planId: string;
  nutritionistId: string;
  title: string;
  nutritionist: {
    id: string;
    fullName: string;
    profileImage?: string;
  };
  startDate: string;
  endDate: string;
  durationDays: number;
  status: UserProgramStatus;
  progress: {
    totalDays: number;
    completedDays: number;
    totalActivities: number;
    completedActivities: number;
    completionPercentage: number;
    currentStreak: number;
  } | null;
}

export interface IUserDashboardTodayTracking {
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

export interface IUserDashboardDailyProgress {
  date: string;
  completedActivities: number;
  totalActivities: number;
}

export interface IUserDashboardWeeklyProgress {
  completedDays: number;
  totalTrackedDays: number;
  completedActivities: number;
  totalActivities: number;
  dailyProgress: IUserDashboardDailyProgress[];
}

export interface IUserDashboardConsultation {
  _id: string;
  title: string;
  nutritionistId: string;
  scheduledAt: string;
  durationInMinutes: number;
  status: MeetingStatus;
}

export interface IUserDashboardMonthlySpending {
  year: number;
  month: number;
  amount: number;
}

export interface IUserDashboardPaymentOverview {
  totalSpent: number;
  monthlySpending: IUserDashboardMonthlySpending[];
  currency: string;
}
