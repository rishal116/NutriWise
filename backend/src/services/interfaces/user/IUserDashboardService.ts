import type { UserDashboardOverviewDTO } from "../../../dtos/user/dashboard/user-dashboard-overview.dto";
import type { UserDashboardProgramsDTO } from "../../../dtos/user/dashboard/user-dashboard-programs.dto";
import type { UserDashboardTodayTrackingDTO } from "../../../dtos/user/dashboard/user-dashboard-today-tracking.dto";
import type { UserDashboardWeeklyProgressDTO } from "../../../dtos/user/dashboard/user-dashboard-weekly-progress.dto";
import type { UserDashboardConsultationsDTO } from "../../../dtos/user/dashboard/user-dashboard-consultations.dto";
import type { UserDashboardPaymentOverviewDTO } from "../../../dtos/user/dashboard/user-dashboard-payment-overview.dto";

export interface IUserDashboardService {
  getOverview(userId: string): Promise<UserDashboardOverviewDTO>;

  getActivePrograms(
    userId: string,
    limit?: number,
  ): Promise<UserDashboardProgramsDTO>;

  getTodayTracking(
    userId: string,
    date?: Date,
  ): Promise<UserDashboardTodayTrackingDTO>;

  getWeeklyProgress(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<UserDashboardWeeklyProgressDTO>;

  getUpcomingConsultations(
    userId: string,
    limit?: number,
  ): Promise<UserDashboardConsultationsDTO>;

  getPaymentOverview(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<UserDashboardPaymentOverviewDTO>;
}
