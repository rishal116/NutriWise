"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";

import { nutriDashboardService } from "@/services/nutritionist/nutriDashboard.service";
import type { NutriDashboardOverviewDTO } from "@/dtos/nutritionist/dashboard/nutri-dashboard-response.dto";
import { getErrorMessage } from "@/utils/getErrorMessage";

import DashboardKpiGrid from "./DashboardKpiGrid";
import DashboardClientOverview from "./DashboardClientOverview";
import DashboardProgramOverview from "./DashboardProgramOverview";
import DashboardResourceOverview from "./DashboardResourceOverview";
import DashboardRecentActivity from "./DashboardRecentActivity";
import DashboardWorkspace from "./DashboardWorkspace";
import DashboardLoading from "./DashboardLoading";
import DashboardError from "./DashboardError";

export default function NutritionistDashboard() {
  const [dashboard, setDashboard] = useState<NutriDashboardOverviewDTO | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await nutriDashboardService.getOverview();

      setDashboard(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return <DashboardLoading />;
  }

  if (error || !dashboard) {
    return (
      <DashboardError
        message={error ?? "Unable to load your dashboard."}
        onRetry={fetchDashboard}
      />
    );
  }

  return (
    <main className="min-h-full bg-[#fafbfc]">
      <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Sparkles size={16} />
              </div>

              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                Nutritionist Dashboard
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Your practice at a glance
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Monitor your clients, programs, coaching plans, groups, and
              educational resources from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchDashboard()}
            disabled={loading}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-emerald-200 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </header>

        <DashboardKpiGrid summary={dashboard.summary} />

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <DashboardClientOverview
              totalClients={dashboard.summary.totalClients}
              activeClients={dashboard.summary.activeClients}
            />
          </div>

          <DashboardProgramOverview programs={dashboard.programs} />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <DashboardResourceOverview resources={dashboard.resources} />

          <DashboardRecentActivity activities={dashboard.recentActivity} />
        </section>

        <DashboardWorkspace />
      </div>
    </main>
  );
}
