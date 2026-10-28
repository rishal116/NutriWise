import type { AdminDashboardOverviewDTO } from "../../../dtos/admin/dashboard/admin-dashboard-overview.dto";
import type { AdminDashboardRegistrationTrendDTO } from "../../../dtos/admin/dashboard/admin-dashboard-registration-trend.dto";
import type { AdminDashboardRevenueTrendDTO } from "../../../dtos/admin/dashboard/admin-dashboard-revenue-trend.dto";
import type { AdminDashboardRecentUserDTO } from "../../../dtos/admin/dashboard/admin-dashboard-recent-user.dto";
import type { AdminDashboardPendingNutritionistDTO } from "../../../dtos/admin/dashboard/admin-dashboard-pending-nutritionist.dto";
import type { AdminDashboardRecentPaymentDTO } from "../../../dtos/admin/dashboard/admin-dashboard-recent-payment.dto";

export interface IAdminDashboardService {
  getOverview(): Promise<AdminDashboardOverviewDTO>;

  getRegistrationTrend(
    startDate: Date,
    endDate: Date,
  ): Promise<AdminDashboardRegistrationTrendDTO[]>;

  getRevenueTrend(
    startDate: Date,
    endDate: Date,
  ): Promise<AdminDashboardRevenueTrendDTO[]>;

  getRecentUsers(limit: number): Promise<AdminDashboardRecentUserDTO[]>;

  getPendingNutritionists(
    limit: number,
  ): Promise<AdminDashboardPendingNutritionistDTO[]>;

  getRecentPayments(limit: number): Promise<AdminDashboardRecentPaymentDTO[]>;
}
