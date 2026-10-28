import type { AdminDashboardRegistrationTrend } from "../../../types/admin/dashboard/admin-dashboard.types";
import { AdminDashboardRegistrationTrendDTO } from "../../../dtos/admin/dashboard/admin-dashboard-registration-trend.dto";

export function mapAdminDashboardRegistrationTrendToDTO(
  trend: AdminDashboardRegistrationTrend,
): AdminDashboardRegistrationTrendDTO {
  return {
    date: trend.date,
    count: trend.count,
  };
}