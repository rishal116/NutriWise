import type { Types } from "mongoose";

import type { INutriDashboardOverviewProjection } from "../../../types/nutritionist/dashboard/nutri-dashboard-overview.projection";
import type { INutriDashboardEarningsChartProjection } from "../../../types/nutritionist/dashboard/nutri-dashboard-earnings-chart.projection";
import type { INutriDashboardRecentActivityItemProjection } from "../../../types/nutritionist/dashboard/nutri-dashboard-recent-activity.projection";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

export interface INutriDashboardRepository {
  getOverview(
    nutritionistId: string | Types.ObjectId,
  ): Promise<INutriDashboardOverviewProjection>;

  getEarningsChart(
    nutritionistId: string | Types.ObjectId,
    months?: number,
  ): Promise<INutriDashboardEarningsChartProjection>;

  getRecentActivities(
    nutritionistId: string | Types.ObjectId,
    limit?: number,
    cursor?: string,
  ): Promise<
    CursorPaginationResult<INutriDashboardRecentActivityItemProjection>
  >;
}
