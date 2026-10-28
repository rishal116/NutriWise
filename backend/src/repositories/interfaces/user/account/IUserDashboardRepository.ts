import type {
  IUserDashboardStats,
  IUserDashboardProgramProjection,
  IUserDashboardTodayTrackingProjection,
  IUserDashboardWeeklyProgressProjection,
  IUserDashboardConsultationProjection,
  IUserDashboardPaymentOverviewProjection,
} from "../../../../types/user/dashboard/user-dashboard.projection";

export interface IUserDashboardRepository {
  getOverview(userId: string): Promise<IUserDashboardStats | null>;

  getActivePrograms(
    userId: string,
    limit: number,
  ): Promise<IUserDashboardProgramProjection[]>;

  getTodayTracking(
    userId: string,
    date: Date,
  ): Promise<IUserDashboardTodayTrackingProjection[]>;

  getWeeklyProgress(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<IUserDashboardWeeklyProgressProjection>;

  getUpcomingConsultations(
    userId: string,
    limit: number,
  ): Promise<IUserDashboardConsultationProjection[]>;

  getPaymentOverview(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<IUserDashboardPaymentOverviewProjection | null>;
}
