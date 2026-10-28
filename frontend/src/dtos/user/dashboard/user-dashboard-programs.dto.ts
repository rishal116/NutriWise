export type UserProgramStatus =
  | "upcoming"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export interface UserDashboardProgramDTO {
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

export type UserDashboardProgramsDTO = UserDashboardProgramDTO[];