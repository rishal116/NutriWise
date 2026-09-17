import type { AdminDashboardOverviewDTO } from "../../../dtos/admin/dashboard/admin-dashboard-overview.dto";

export interface IAdminDashboardService {
  getOverview(): Promise<AdminDashboardOverviewDTO>;
}