"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { nutriDashboardService } from "@/services/nutritionist/nutriDashboard.service";
import type { NutriDashboardOverviewDTO } from "@/dtos/nutritionist/dashboard/nutri-dashboard-response.dto";
import { getErrorMessage } from "@/utils/getErrorMessage";

import DashboardKpiGrid from "./DashboardKpiGrid";
import DashboardUpcoming from "./DashboardUpcoming";
import DashboardClientOverview from "./DashboardClientOverview";
import DashboardProgramOverview from "./DashboardProgramOverview";
import DashboardResourceOverview from "./DashboardResourceOverview";
import DashboardRecentActivity from "./DashboardRecentActivity";
import DashboardLoading from "./DashboardLoading";
import DashboardError from "./DashboardError";

export default function NutritionistDashboard() {
  const [dashboard, setDashboard] = useState<NutriDashboardOverviewDTO | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = await nutriDashboardService.getOverview();

      setDashboard(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return <DashboardLoading />;
  }

  // Full-page error only when there is nothing to show.
  if (!dashboard) {
    return (
      <DashboardError
        message={error ?? "Unable to load your dashboard."}
        onRetry={() => void fetchDashboard()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Your practice at a glance
          </h1>

          <p className="mt-1 max-w-2xl text-sm font-medium text-slate-500">
            Monitor your clients, programs, coaching plans, groups, and
            educational resources from one place.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void fetchDashboard(true)}
          disabled={refreshing}
          className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition-colors duration-150 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p className="min-w-0 flex-1">
            Couldn&apos;t refresh your dashboard. Showing the last loaded data.
          </p>
        </div>
      )}

      <DashboardKpiGrid summary={dashboard.summary} />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <DashboardUpcoming className="xl:col-span-2" />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 [&>*]:h-full">
          <DashboardClientOverview
            totalClients={dashboard.summary.totalClients}
            activeClients={dashboard.summary.activeClients}
          />
        </div>

        <div className="[&>*]:h-full">
          <DashboardProgramOverview programs={dashboard.programs} />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="[&>*]:h-full">
          <DashboardResourceOverview resources={dashboard.resources} />
        </div>

        <div className="[&>*]:h-full">
          <DashboardRecentActivity activities={dashboard.recentActivity} />
        </div>
      </section>
    </div>
  );
}
