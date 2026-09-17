import type { UserDashboardOverviewDTO } from "../../../dtos/user/dashboard/user-dashboard-overview.dto";

export interface IUserDashboardService {
  getOverview(userId: string): Promise<UserDashboardOverviewDTO>;
}
