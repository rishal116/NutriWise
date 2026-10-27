import { clientApi } from "@/lib/axios/clientApi";

import { NUTRITIONIST_DASHBOARD_ROUTES } from "@/routes/nutritionist";

import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import type { NutriDashboardOverviewDTO } from "@/dtos/nutritionist/dashboard/nutri-dashboard-response.dto";
import type { NutriDashboardEarningsChartDTO } from "@/dtos/nutritionist/dashboard/nutri-dashboard-earnings-chart.dto";
import type { NutriDashboardRecentActivityItemDTO } from "@/dtos/nutritionist/dashboard/nutri-dashboard-recent-activities.dto";

export const nutriDashboardService = {
  async getOverview(): Promise<NutriDashboardOverviewDTO> {
    const res = await clientApi.get<ApiResponseDTO<NutriDashboardOverviewDTO>>(
      NUTRITIONIST_DASHBOARD_ROUTES.OVERVIEW,
    );

    if (!res.data.data) {
      throw new Error("Dashboard overview data is missing");
    }

    return res.data.data;
  },

  async getEarningsChart(months = 6): Promise<NutriDashboardEarningsChartDTO> {
    const res = await clientApi.get<
      ApiResponseDTO<NutriDashboardEarningsChartDTO>
    >(NUTRITIONIST_DASHBOARD_ROUTES.EARNINGS_CHART, {
      params: { months },
    });

    if (!res.data.data) {
      throw new Error("Earnings chart data is missing");
    }

    return res.data.data;
  },

  async getRecentActivities(
    limit = 5,
    cursor?: string,
  ): Promise<InfiniteScrollResponseDTO<NutriDashboardRecentActivityItemDTO>> {
    const res = await clientApi.get<
      ApiResponseDTO<
        InfiniteScrollResponseDTO<NutriDashboardRecentActivityItemDTO>
      >
    >(NUTRITIONIST_DASHBOARD_ROUTES.RECENT_ACTIVITIES, {
      params: {
        limit,
        ...(cursor ? { cursor } : {}),
      },
    });

    if (!res.data.data) {
      throw new Error("Recent activities data is missing");
    }

    return res.data.data;
  },
};
