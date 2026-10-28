import { clientApi } from "@/lib/axios/clientApi";
import { ADMIN_DASHBOARD_ROUTES } from "@/routes/admin";

import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { AdminDashboardOverviewDTO } from "@/dtos/admin/dashboard/admin-dashboard-overview.dto";
import type { AdminDashboardRegistrationTrendDTO } from "@/dtos/admin/dashboard/admin-dashboard-registration-trend.dto";
import type { AdminDashboardRevenueTrendDTO } from "@/dtos/admin/dashboard/admin-dashboard-revenue-trend.dto";
import type { AdminDashboardRecentUserDTO } from "@/dtos/admin/dashboard/admin-dashboard-recent-user.dto";
import type { AdminDashboardPendingNutritionistDTO } from "@/dtos/admin/dashboard/admin-dashboard-pending-nutritionist.dto";
import type { AdminDashboardRecentPaymentDTO } from "@/dtos/admin/dashboard/admin-dashboard-recent-payment.dto";

export const adminDashboardService = {
  async getOverview(): Promise<ApiResponseDTO<AdminDashboardOverviewDTO>> {
    const response = await clientApi.get<
      ApiResponseDTO<AdminDashboardOverviewDTO>
    >(ADMIN_DASHBOARD_ROUTES.OVERVIEW);

    return response.data;
  },

  async getRegistrationTrend(
    startDate: string,
    endDate: string,
  ): Promise<ApiResponseDTO<AdminDashboardRegistrationTrendDTO[]>> {
    const response = await clientApi.get<
      ApiResponseDTO<AdminDashboardRegistrationTrendDTO[]>
    >(ADMIN_DASHBOARD_ROUTES.REGISTRATION_TREND, {
      params: { startDate, endDate },
    });

    return response.data;
  },

  async getRevenueTrend(
    startDate: string,
    endDate: string,
  ): Promise<ApiResponseDTO<AdminDashboardRevenueTrendDTO[]>> {
    const response = await clientApi.get<
      ApiResponseDTO<AdminDashboardRevenueTrendDTO[]>
    >(ADMIN_DASHBOARD_ROUTES.REVENUE_TREND, {
      params: { startDate, endDate },
    });

    return response.data;
  },

  async getRecentUsers(
    limit = 10,
  ): Promise<ApiResponseDTO<AdminDashboardRecentUserDTO[]>> {
    const response = await clientApi.get<
      ApiResponseDTO<AdminDashboardRecentUserDTO[]>
    >(ADMIN_DASHBOARD_ROUTES.RECENT_USERS, {
      params: { limit },
    });

    return response.data;
  },

  async getPendingNutritionists(
    limit = 10,
  ): Promise<ApiResponseDTO<AdminDashboardPendingNutritionistDTO[]>> {
    const response = await clientApi.get<
      ApiResponseDTO<AdminDashboardPendingNutritionistDTO[]>
    >(ADMIN_DASHBOARD_ROUTES.PENDING_NUTRITIONISTS, {
      params: { limit },
    });

    return response.data;
  },

  async getRecentPayments(
    limit = 10,
  ): Promise<ApiResponseDTO<AdminDashboardRecentPaymentDTO[]>> {
    const response = await clientApi.get<
      ApiResponseDTO<AdminDashboardRecentPaymentDTO[]>
    >(ADMIN_DASHBOARD_ROUTES.RECENT_PAYMENTS, {
      params: { limit },
    });

    return response.data;
  },
};
