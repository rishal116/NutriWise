"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AlertCircle, RefreshCw } from "lucide-react";

import { nutriDashboardService } from "@/services/nutritionist/nutri-dashboard.service";
import type { NutriDashboardOverviewDTO } from "@/dtos/nutritionist/dashboard/nutri-dashboard-response.dto";
import type { NutriDashboardEarningsChartDTO } from "@/dtos/nutritionist/dashboard/nutri-dashboard-earnings-chart.dto";
import type { NutriDashboardRecentActivityItemDTO } from "@/dtos/nutritionist/dashboard/nutri-dashboard-recent-activities.dto";
import { getErrorMessage } from "@/utils/getErrorMessage";

import DashboardKpiGrid from "./DashboardKpiGrid";
import DashboardProgramOverview from "./DashboardProgramOverview";
import DashboardLoading from "./DashboardLoading";
import DashboardError from "./DashboardError";

type Section<T> = { data: T | null; error: string | null; loading: boolean };

function pending<T>(): Section<T> {
  return { data: null, error: null, loading: true };
}

function settle<T>(
  prev: Section<T>,
  result: PromiseSettledResult<T>,
): Section<T> {
  if (result.status === "fulfilled") {
    return { data: result.value, error: null, loading: false };
  }
  return {
    data: prev.data,
    error: getErrorMessage(result.reason),
    loading: false,
  };
}

function WidgetSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="min-h-64 animate-pulse rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6"
    >
      <div className="h-5 w-40 rounded bg-slate-100" />
      <div className="mt-3 h-3 w-56 max-w-full rounded bg-slate-100" />
      <div className="mt-8 h-32 rounded-xl bg-slate-50" />
    </div>
  );
}

function WidgetError({
  label,
  onRetry,
}: {
  label: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center text-sm text-amber-800"
    >
      <p>{label} couldn&apos;t be loaded.</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg bg-white px-3 py-1.5 font-semibold text-amber-900 ring-1 ring-amber-200 transition-colors hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      >
        Retry
      </button>
    </div>
  );
}

const DashboardEarningsChart = dynamic(
  () => import("./DashboardEarningsChart"),
  {
    loading: () => <WidgetSkeleton />,
  },
);

const DashboardRecentActivity = dynamic(
  () => import("./DashboardRecentActivity"),
  { loading: () => <WidgetSkeleton /> },
);

function useNutritionistDashboard() {
  const [overview, setOverview] =
    useState<Section<NutriDashboardOverviewDTO>>(pending);
  const [earnings, setEarnings] =
    useState<Section<NutriDashboardEarningsChartDTO>>(pending);
  const [activities, setActivities] =
    useState<Section<NutriDashboardRecentActivityItemDTO[]>>(pending);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async (isStale: () => boolean) => {
    const [overviewResult, earningsResult, activitiesResult] =
      await Promise.allSettled([
        nutriDashboardService.getOverview(),
        nutriDashboardService.getEarningsChart(),
        nutriDashboardService.getRecentActivities(5).then((res) => res.items),
      ]);

    if (isStale()) return;

    setOverview((prev) => settle(prev, overviewResult));
    setEarnings((prev) => settle(prev, earningsResult));
    setActivities((prev) => settle(prev, activitiesResult));
    setRefreshing(false);
  }, []);

  useEffect(() => {
    let stale = false;
    void fetchAll(() => stale);
    return () => {
      stale = true;
    };
  }, [fetchAll]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    void fetchAll(() => false);
  }, [fetchAll]);

  return { overview, earnings, activities, refreshing, refresh };
}

export default function NutritionistDashboard() {
  const { overview, earnings, activities, refreshing, refresh } =
    useNutritionistDashboard();

  const dashboard = overview.data;

  if (overview.loading || (refreshing && !dashboard)) {
    return <DashboardLoading />;
  }

  if (!dashboard) {
    return (
      <DashboardError
        message={overview.error ?? "Unable to load your dashboard."}
        onRetry={refresh}
      />
    );
  }

  return (
    <div className="space-y-6" aria-busy={refreshing}>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Your practice at a glance
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Clients, earnings, programs and resources in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={refreshing}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {overview.error && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p className="min-w-0 flex-1">{overview.error}</p>
          <button
            type="button"
            onClick={refresh}
            className="shrink-0 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      <DashboardKpiGrid dashboard={dashboard} />

      <section>
        <DashboardProgramOverview programs={dashboard.programs} />
      </section>

      {earnings.loading ? (
        <WidgetSkeleton />
      ) : earnings.data ? (
        <DashboardEarningsChart earnings={earnings.data} />
      ) : (
        <WidgetError label="Earnings" onRetry={refresh} />
      )}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {activities.loading ? (
          <WidgetSkeleton />
        ) : activities.data ? (
          <DashboardRecentActivity activities={activities.data} />
        ) : (
          <WidgetError label="Recent activity" onRetry={refresh} />
        )}
      </section>
    </div>
  );
}
