import type { IAdminDashboardOverviewProjection } from "../../../types/admin/dashboard/admin-dashboard-overview.projection";

export interface IAdminDashboardRepository {
  getOverview(): Promise<IAdminDashboardOverviewProjection>;
}
