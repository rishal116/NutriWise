import { clientApi } from "@/lib/axios/clientApi";

import { DASHBOARD_ROUTES } from "@/routes/user";

import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { UserDashboardOverviewDTO } from "@/dtos/user/dashboard/user-dashboard-overview.dto";
import type { UserDashboardProgramsDTO } from "@/dtos/user/dashboard/user-dashboard-programs.dto";
import type { UserDashboardTodayTrackingDTO } from "@/dtos/user/dashboard/user-dashboard-today-tracking.dto";
import type { UserDashboardWeeklyProgressDTO } from "@/dtos/user/dashboard/user-dashboard-weekly-progress.dto";
import type { UserDashboardConsultationsDTO } from "@/dtos/user/dashboard/user-dashboard-consultations.dto";
import type { UserDashboardPaymentOverviewDTO } from "@/dtos/user/dashboard/user-dashboard-payment-overview.dto";

export const userDashboardService = {
  async getOverview(): Promise<ApiResponseDTO<UserDashboardOverviewDTO>> {
    const res = await clientApi.get(DASHBOARD_ROUTES.OVERVIEW);
    return res.data;
  },

  async getActivePrograms(
    limit = 5,
  ): Promise<ApiResponseDTO<UserDashboardProgramsDTO>> {
    const res = await clientApi.get(DASHBOARD_ROUTES.ACTIVE_PROGRAMS, {
      params: { limit },
    });

    return res.data;
  },

  async getTodayTracking(
    date?: Date,
  ): Promise<ApiResponseDTO<UserDashboardTodayTrackingDTO>> {
    const res = await clientApi.get(DASHBOARD_ROUTES.TODAY_TRACKING, {
      params: date ? { date: date.toISOString() } : undefined,
    });

    return res.data;
  },

  async getWeeklyProgress(
    startDate: Date,
    endDate: Date,
  ): Promise<ApiResponseDTO<UserDashboardWeeklyProgressDTO>> {
    const res = await clientApi.get(DASHBOARD_ROUTES.WEEKLY_PROGRESS, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });

    return res.data;
  },

  async getUpcomingConsultations(
    limit = 5,
  ): Promise<ApiResponseDTO<UserDashboardConsultationsDTO>> {
    const res = await clientApi.get(DASHBOARD_ROUTES.UPCOMING_CONSULTATIONS, {
      params: { limit },
    });

    return res.data;
  },

  async getPaymentOverview(
    startDate: Date,
    endDate: Date,
  ): Promise<ApiResponseDTO<UserDashboardPaymentOverviewDTO>> {
    const res = await clientApi.get(DASHBOARD_ROUTES.PAYMENT_OVERVIEW, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });

    return res.data;
  },
};
