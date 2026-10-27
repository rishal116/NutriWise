import type { NutriDashboardOverviewDTO } from "../../../dtos/nutritionist/dashboard/nutri-dashboard-overview.dto";
import type { NutriDashboardEarningsChartDTO } from "../../../dtos/nutritionist/dashboard/nutri-dashboard-earnings-chart.dto";
import type { NutriDashboardRecentActivityItemDTO } from "../../../dtos/nutritionist/dashboard/nutri-dashboard-recent-activities.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

export interface INutriDashboardService {
  getOverview(nutritionistId: string): Promise<NutriDashboardOverviewDTO>;

  getEarningsChart(
    nutritionistId: string,
    months?: number,
  ): Promise<NutriDashboardEarningsChartDTO>;

  getRecentActivities(
    nutritionistId: string,
    limit?: number,
    cursor?: string,
  ): Promise<InfiniteScrollResponseDTO<NutriDashboardRecentActivityItemDTO>>;
}
