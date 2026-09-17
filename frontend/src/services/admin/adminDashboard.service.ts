import { clientApi } from "@/lib/axios/clientApi";

import { ADMIN_DASHBOARD_ROUTES } from "@/routes/admin";

import { AdminDashboardOverviewDTO } from "@/dtos/admin/dashboard/admin-dashboard-overview.dto";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const adminDashboardService = {
  async getOverview(): Promise<ApiResponseDTO<AdminDashboardOverviewDTO>> {
    const response = await clientApi.get<
      ApiResponseDTO<AdminDashboardOverviewDTO>
    >(ADMIN_DASHBOARD_ROUTES.OVERVIEW);

    return response.data;
  },
};
