import type {
  AdminDashboardOverview,
  AdminDashboardRegistrationTrend,
  AdminDashboardRevenueTrend,
  AdminDashboardRecentUser,
  AdminDashboardPendingNutritionist,
  AdminDashboardRecentPayment,
} from "../../../types/admin/dashboard/admin-dashboard.types";

export interface IAdminDashboardRepository {
  getOverview(startDate: Date): Promise<AdminDashboardOverview>;

  getRegistrationTrend(
    startDate: Date,
    endDate: Date,
  ): Promise<AdminDashboardRegistrationTrend[]>;

  getRevenueTrend(
    startDate: Date,
    endDate: Date,
  ): Promise<AdminDashboardRevenueTrend[]>;

  getRecentUsers(limit: number): Promise<AdminDashboardRecentUser[]>;

  getPendingNutritionists(
    limit: number,
  ): Promise<AdminDashboardPendingNutritionist[]>;

  getRecentPayments(limit: number): Promise<AdminDashboardRecentPayment[]>;
}
