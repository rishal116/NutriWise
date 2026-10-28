"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Activity, ArrowRight } from "lucide-react";
import Link from "next/link";

import { userDashboardService } from "@/services/user/user-dashboard.service";

import type { UserDashboardOverviewDTO } from "@/dtos/user/dashboard/user-dashboard-overview.dto";
import type { UserDashboardProgramsDTO } from "@/dtos/user/dashboard/user-dashboard-programs.dto";
import type { UserDashboardTodayTrackingDTO } from "@/dtos/user/dashboard/user-dashboard-today-tracking.dto";
import type { UserDashboardWeeklyProgressDTO } from "@/dtos/user/dashboard/user-dashboard-weekly-progress.dto";
import type { UserDashboardConsultationsDTO } from "@/dtos/user/dashboard/user-dashboard-consultations.dto";
import type { UserDashboardPaymentOverviewDTO } from "@/dtos/user/dashboard/user-dashboard-payment-overview.dto";

import DashboardHero from "./DashboardHero";
import DashboardStats from "./DashboardStats";
import DashboardSkeleton from "./DashboardSkeleton";
import { DashboardError } from "./DashboardShared";

const DashboardPrograms = dynamic(() => import("./DashboardPrograms"), {
  loading: () => <DashboardSkeleton />,
});

const DashboardTodayTracking = dynamic(
  () => import("./DashboardTodayTracking"),
  { loading: () => <DashboardSkeleton /> },
);

const DashboardWeeklyProgress = dynamic(
  () => import("./DashboardWeeklyProgress"),
  { loading: () => <DashboardSkeleton /> },
);

const DashboardConsultations = dynamic(
  () => import("./DashboardConsultations"),
  { loading: () => <DashboardSkeleton /> },
);

const DashboardPayment = dynamic(() => import("./DashboardPayment"), {
  loading: () => <DashboardSkeleton />,
});

interface DashboardData {
  overview: UserDashboardOverviewDTO;
  programs: UserDashboardProgramsDTO;
  todayTracking: UserDashboardTodayTrackingDTO;
  weeklyProgress: UserDashboardWeeklyProgressDTO | null;
  consultations: UserDashboardConsultationsDTO;
  paymentOverview: UserDashboardPaymentOverviewDTO | null;
}

const EMPTY_PROGRAMS: UserDashboardProgramsDTO = [];
const EMPTY_TRACKING: UserDashboardTodayTrackingDTO = [];
const EMPTY_CONSULTATIONS: UserDashboardConsultationsDTO = [];

function getDateRange() {
  const now = new Date();
  const startDate = new Date(now);
  const day = startDate.getDay();

  startDate.setDate(startDate.getDate() - ((day + 6) % 7));
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);

  return { startDate, endDate };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while loading your dashboard.";
}

export default function UserDashboardClient() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { startDate, endDate } = getDateRange();

    const paymentStartDate = new Date();
    paymentStartDate.setDate(1);
    paymentStartDate.setHours(0, 0, 0, 0);

    const paymentEndDate = new Date(paymentStartDate);
    paymentEndDate.setMonth(paymentEndDate.getMonth() + 1);

    const [
      overviewResult,
      programsResult,
      trackingResult,
      weeklyResult,
      consultationsResult,
      paymentResult,
    ] = await Promise.allSettled([
      userDashboardService.getOverview(),
      userDashboardService.getActivePrograms(5),
      userDashboardService.getTodayTracking(),
      userDashboardService.getWeeklyProgress(startDate, endDate),
      userDashboardService.getUpcomingConsultations(5),
      userDashboardService.getPaymentOverview(paymentStartDate, paymentEndDate),
    ]);

    if (
      overviewResult.status === "rejected" ||
      (overviewResult.status === "fulfilled" &&
        (!overviewResult.value.success ||
          overviewResult.value.data === undefined))
    ) {
      const message =
        overviewResult.status === "rejected"
          ? getErrorMessage(overviewResult.reason)
          : overviewResult.value.message || "Dashboard data is unavailable.";

      setError(message);
      setLoading(false);
      return;
    }

    const overview = overviewResult.value.data;

    if (!overview) {
      setError("Dashboard overview data is unavailable.");
      setLoading(false);
      return;
    }

    setDashboard({
      overview,
      programs:
        programsResult.status === "fulfilled" &&
        programsResult.value.success &&
        programsResult.value.data !== undefined
          ? programsResult.value.data
          : EMPTY_PROGRAMS,
      todayTracking:
        trackingResult.status === "fulfilled" &&
        trackingResult.value.success &&
        trackingResult.value.data !== undefined
          ? trackingResult.value.data
          : EMPTY_TRACKING,
      weeklyProgress:
        weeklyResult.status === "fulfilled" &&
        weeklyResult.value.success &&
        weeklyResult.value.data !== undefined
          ? weeklyResult.value.data
          : null,
      consultations:
        consultationsResult.status === "fulfilled" &&
        consultationsResult.value.success &&
        consultationsResult.value.data !== undefined
          ? consultationsResult.value.data
          : EMPTY_CONSULTATIONS,
      paymentOverview:
        paymentResult.status === "fulfilled" &&
        paymentResult.value.success &&
        paymentResult.value.data !== undefined
          ? paymentResult.value.data
          : null,
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard, refreshKey]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error || !dashboard) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <DashboardError
            message={error ?? "Your dashboard data is unavailable."}
            onRetry={() => setRefreshKey((current) => current + 1)}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <DashboardHero />

        <DashboardStats overview={dashboard.overview} />

        <DashboardPrograms programs={dashboard.programs} />

        <section className="grid min-w-0 gap-6 xl:grid-cols-2">
          <DashboardTodayTracking tracking={dashboard.todayTracking} />
          <DashboardWeeklyProgress progress={dashboard.weeklyProgress} />
        </section>

        <section className="grid min-w-0 gap-6 xl:grid-cols-2">
          <DashboardConsultations consultations={dashboard.consultations} />
          <DashboardPayment overview={dashboard.paymentOverview} />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">
                  Keep building healthy habits
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Small, consistent actions can help you stay on track with your
                  personalized nutrition goals.
                </p>
              </div>
            </div>

            <Link
              href="/user/programs"
              className="inline-flex w-fit shrink-0 items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Review programs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
