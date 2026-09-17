import type { IUserDashboardOverviewProjection } from "../../../../types/user/dashboard/user-dashboard-overview.projection";

export interface IUserDashboardRepository {
  getOverview(userId: string): Promise<IUserDashboardOverviewProjection | null>;
}
