import { clientApi } from "@/lib/axios/clientApi";

import { DASHBOARD_ROUTES } from "@/routes/user";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";

import { UserDashboardOverviewDTO } from "@/dtos/user/dashboard/user-dashboard-overview.dto";

export const userDashboardService = {
  async getOverview(): Promise<ApiResponseDTO<UserDashboardOverviewDTO>> {
    const res = await clientApi.get(DASHBOARD_ROUTES.OVERVIEW);

    return res.data;
  },
};
