import type { AdminDashboardRevenueTrend } from "../../../types/admin/dashboard/admin-dashboard.types";
import { AdminDashboardRevenueTrendDTO } from "../../../dtos/admin/dashboard/admin-dashboard-revenue-trend.dto";

export function mapAdminDashboardRevenueTrendToDTO(
  trend: AdminDashboardRevenueTrend,
): AdminDashboardRevenueTrendDTO {
  return {
    date: trend.date,
    grossRevenue: trend.grossRevenue,
    refundedAmount: trend.refundedAmount,
    netRevenue: trend.netRevenue,
    commissionEarned: trend.commissionEarned,
    paymentCount: trend.paymentCount,
  };
}