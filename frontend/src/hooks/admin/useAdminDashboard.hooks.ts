"use client";

import { useCallback, useEffect, useState } from "react";

import { adminDashboardService } from "@/services/admin/admin-dashboard.service";
import type { AdminDashboardOverviewDTO } from "@/dtos/admin/dashboard/admin-dashboard-overview.dto";
import type { AdminDashboardRegistrationTrendDTO } from "@/dtos/admin/dashboard/admin-dashboard-registration-trend.dto";
import type { AdminDashboardRevenueTrendDTO } from "@/dtos/admin/dashboard/admin-dashboard-revenue-trend.dto";
import type { AdminDashboardRecentUserDTO } from "@/dtos/admin/dashboard/admin-dashboard-recent-user.dto";
import type { AdminDashboardPendingNutritionistDTO } from "@/dtos/admin/dashboard/admin-dashboard-pending-nutritionist.dto";
import type { AdminDashboardRecentPaymentDTO } from "@/dtos/admin/dashboard/admin-dashboard-recent-payment.dto";
import { getErrorMessage } from "@/utils/getErrorMessage";

export interface DashboardData {
  overview: AdminDashboardOverviewDTO | null;
  registrationTrend: AdminDashboardRegistrationTrendDTO[];
  revenueTrend: AdminDashboardRevenueTrendDTO[];
  users: AdminDashboardRecentUserDTO[];
  nutritionists: AdminDashboardPendingNutritionistDTO[];
  payments: AdminDashboardRecentPaymentDTO[];
}

export type DashboardSection = keyof DashboardData;

export const SECTION_LABELS: Record<DashboardSection, string> = {
  overview: "Overview",
  registrationTrend: "User growth chart",
  revenueTrend: "Revenue chart",
  users: "Recent users",
  nutritionists: "Pending nutritionists",
  payments: "Recent payments",
};

interface DateRange {
  startDate: string;
  endDate: string;
}

interface ApiResult<T> {
  success: boolean;
  message: string;
  data?: T;
}

const INITIAL_DASHBOARD: DashboardData = {
  overview: null,
  registrationTrend: [],
  revenueTrend: [],
  users: [],
  nutritionists: [],
  payments: [],
};

const ALL_PENDING: Record<DashboardSection, boolean> = {
  overview: true,
  registrationTrend: true,
  revenueTrend: true,
  users: true,
  nutritionists: true,
  payments: true,
};

const LOADERS: {
  [K in DashboardSection]: (
    range: DateRange,
  ) => Promise<ApiResult<NonNullable<DashboardData[K]>>>;
} = {
  overview: () => adminDashboardService.getOverview(),
  registrationTrend: ({ startDate, endDate }) =>
    adminDashboardService.getRegistrationTrend(startDate, endDate),
  revenueTrend: ({ startDate, endDate }) =>
    adminDashboardService.getRevenueTrend(startDate, endDate),
  users: () => adminDashboardService.getRecentUsers(10),
  nutritionists: () => adminDashboardService.getPendingNutritionists(10),
  payments: () => adminDashboardService.getRecentPayments(10),
};

const SECTIONS = Object.keys(LOADERS) as DashboardSection[];

function getDateRange(): DateRange {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 30);

  return { startDate: start.toISOString(), endDate: end.toISOString() };
}

export function useAdminDashboard() {
  const [dashboard, setDashboard] = useState(INITIAL_DASHBOARD);
  const [pending, setPending] = useState(ALL_PENDING);
  const [errors, setErrors] = useState<
    Partial<Record<DashboardSection, string>>
  >({});

  const loadSection = useCallback(
    async <K extends DashboardSection>(
      section: K,
      range: DateRange,
    ): Promise<void> => {
      try {
        const response = await LOADERS[section](range);

        if (!response.success) {
          throw new Error(response.message || "Request failed.");
        }

        const { data } = response;

        if (data === undefined || data === null) {
          throw new Error(response.message || "Response data is missing.");
        }

        setDashboard((previous) => ({ ...previous, [section]: data }));
      } catch (error: unknown) {
        console.error(`Admin dashboard ${section} failed:`, error);

        setErrors((previous) => ({
          ...previous,
          [section]: getErrorMessage(error),
        }));
      } finally {
        // Each section is marked ready as soon as it settles.
        setPending((previous) => ({ ...previous, [section]: false }));
      }
    },
    [],
  );

  const refetch = useCallback(async () => {
    setPending(ALL_PENDING);
    setErrors({});

    const range = getDateRange();

    await Promise.all(SECTIONS.map((section) => loadSection(section, range)));
  }, [loadSection]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return {
    dashboard,
    pending,
    errors,
    refetch,
    isRefreshing: Object.values(pending).some(Boolean),
  };
}
