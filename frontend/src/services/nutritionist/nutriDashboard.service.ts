import { clientApi } from "@/lib/axios/clientApi";

import { NUTRITIONIST_DASHBOARD_ROUTES } from "@/routes/nutritionist/dashboard.routes";

import type { ApiResponse } from "@/types/api/apiResponse";

import type { NutriDashboardOverviewDTO } from "@/dtos/nutritionist/dashboard/nutri-dashboard-response.dto";

export const nutriDashboardService = {
  async getOverview(): Promise<NutriDashboardOverviewDTO> {
    const res = await clientApi.get<ApiResponse<NutriDashboardOverviewDTO>>(
      NUTRITIONIST_DASHBOARD_ROUTES.OVERVIEW,
    );

    return res.data.data;
  },
};
