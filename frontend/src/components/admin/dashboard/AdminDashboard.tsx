"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";

import { adminDashboardService } from "@/services/admin/admin-dashboard.service";
import type { AdminDashboardOverviewDTO } from "@/dtos/admin/dashboard/admin-dashboard-overview.dto";
import type { AdminDashboardRegistrationTrendDTO } from "@/dtos/admin/dashboard/admin-dashboard-registration-trend.dto";
import type { AdminDashboardRevenueTrendDTO } from "@/dtos/admin/dashboard/admin-dashboard-revenue-trend.dto";
import type { AdminDashboardRecentUserDTO } from "@/dtos/admin/dashboard/admin-dashboard-recent-user.dto";
import type { AdminDashboardPendingNutritionistDTO } from "@/dtos/admin/dashboard/admin-dashboard-pending-nutritionist.dto";
import type { AdminDashboardRecentPaymentDTO } from "@/dtos/admin/dashboard/admin-dashboard-recent-payment.dto";
import { getErrorMessage } from "@/utils/getErrorMessage";

import {
  KpiCard,
  TrendChart,
  OverviewCard,
  StatusRow,
  formatNumber,
  formatCompactNumber,
} from "./DashboardWidgets";
import DashboardLists from "./DashboardLists";
import { AttentionPanel, RecentActivityPanel } from "./DashboardActivity";

interface DashboardData {
  overview: AdminDashboardOverviewDTO | null;
  registrationTrend: AdminDashboardRegistrationTrendDTO[];
  revenueTrend: AdminDashboardRevenueTrendDTO[];
  users: AdminDashboardRecentUserDTO[];
  nutritionists: AdminDashboardPendingNutritionistDTO[];
  payments: AdminDashboardRecentPaymentDTO[];
}

type DashboardSection =
  | "overview"
  | "registrationTrend"
  | "revenueTrend"
  | "users"
  | "nutritionists"
  | "payments";

const INITIAL_DASHBOARD: DashboardData = {
  overview: null,
  registrationTrend: [],
  revenueTrend: [],
  users: [],
  nutritionists: [],
  payments: [],
};

function getDateRange(): { startDate: string; endDate: string } {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 30);

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl border border-admin-border bg-admin-surface"
          />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="h-80 animate-pulse rounded-2xl border border-admin-border bg-admin-surface" />
        <div className="h-80 animate-pulse rounded-2xl border border-admin-border bg-admin-surface" />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData>(INITIAL_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<DashboardSection, string>>
  >({});

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setErrors({});

    const range = getDateRange();

    const loadSection = async <T,>(
      section: DashboardSection,
      request: () => Promise<{
        success: boolean;
        message: string;
        data?: T;
      }>,
      onSuccess: (data: T) => void,
    ): Promise<void> => {
      try {
        const response = await request();

        if (!response.success) {
          throw new Error(response.message || "Request failed.");
        }

        if (response.data === undefined || response.data === null) {
          throw new Error(response.message || "Response data is missing.");
        }

        onSuccess(response.data);
      } catch (error: unknown) {
        const message = getErrorMessage(error);

        console.error(`Admin dashboard ${section} failed:`, error);

        setErrors((previous) => ({
          ...previous,
          [section]: message,
        }));
      }
    };

    try {
      await Promise.all([
        loadSection(
          "overview",
          () => adminDashboardService.getOverview(),
          (data) => {
            setDashboard((previous) => ({ ...previous, overview: data }));
          },
        ),
        loadSection(
          "registrationTrend",
          () =>
            adminDashboardService.getRegistrationTrend(
              range.startDate,
              range.endDate,
            ),
          (data) => {
            setDashboard((previous) => ({
              ...previous,
              registrationTrend: data,
            }));
          },
        ),
        loadSection(
          "revenueTrend",
          () =>
            adminDashboardService.getRevenueTrend(
              range.startDate,
              range.endDate,
            ),
          (data) => {
            setDashboard((previous) => ({
              ...previous,
              revenueTrend: data,
            }));
          },
        ),
        loadSection(
          "users",
          () => adminDashboardService.getRecentUsers(10),
          (data) => {
            setDashboard((previous) => ({ ...previous, users: data }));
          },
        ),
        loadSection(
          "nutritionists",
          () => adminDashboardService.getPendingNutritionists(10),
          (data) => {
            setDashboard((previous) => ({
              ...previous,
              nutritionists: data,
            }));
          },
        ),
        loadSection(
          "payments",
          () => adminDashboardService.getRecentPayments(10),
          (data) => {
            setDashboard((previous) => ({ ...previous, payments: data }));
          },
        ),
      ]);
    } finally {
      setHasLoaded(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  if (loading && !hasLoaded) {
    return (
      <main className="min-h-full bg-admin-background p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1600px]">
          <h1 className="mb-6 text-2xl font-bold text-admin-text">Dashboard</h1>
          <DashboardSkeleton />
        </div>
      </main>
    );
  }

  const overview = dashboard.overview;

  if (!overview) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-admin-background p-6">
        <div className="max-w-md rounded-2xl border border-admin-border bg-admin-surface p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-600" />
          <h1 className="mt-4 text-lg font-bold text-admin-text">
            Unable to load dashboard overview
          </h1>
          <p className="mt-2 text-sm text-admin-muted">
            {errors.overview ?? "Please try again."}
          </p>
          <button
            type="button"
            onClick={() => void fetchDashboard()}
            disabled={loading}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Try again
          </button>
        </div>
      </main>
    );
  }

  const nutritionistTotal =
    overview.nutritionists.approved +
    overview.nutritionists.pending +
    overview.nutritionists.rejected;

  const challengeTotal = overview.challenges.total;

  const revenueTrend = dashboard.revenueTrend.map((item) => ({
    date: item.date,
    value: item.netRevenue,
  }));

  const sectionLabels: Record<DashboardSection, string> = {
    overview: "Overview",
    registrationTrend: "User growth chart",
    revenueTrend: "Revenue chart",
    users: "Recent users",
    nutritionists: "Pending nutritionists",
    payments: "Recent payments",
  };

  const failedSections = Object.entries(errors) as [DashboardSection, string][];

  return (
    <main className="min-h-full bg-admin-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-admin-accent">
              Super Admin
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-admin-text sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-admin-muted">
              Monitor users, nutritionists, coaching, challenges, and platform
              operations.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchDashboard()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-admin-border bg-admin-surface px-4 py-2.5 text-sm font-semibold text-admin-text disabled:opacity-60 sm:self-auto"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </button>
        </header>

        {failedSections.length > 0 && (
          <div className="mb-6 space-y-2">
            {failedSections.map(([section, message]) => (
              <div
                key={section}
                className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  <span className="font-semibold">
                    {sectionLabels[section]}:
                  </span>{" "}
                  {message}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <KpiCard
              title="Total Users"
              value={formatNumber(overview.summary.totalUsers)}
              description={`${formatNumber(overview.summary.newUsers)} new in period`}
              icon={Users}
              iconClassName="text-sky-600"
              iconBackgroundClassName="bg-sky-50"
            />
            <KpiCard
              title="Nutritionists"
              value={formatNumber(overview.summary.totalNutritionists)}
              description="Nutritionist profiles"
              icon={UserCheck}
              iconClassName="text-emerald-600"
              iconBackgroundClassName="bg-emerald-50"
            />
            <KpiCard
              title="Pending Applications"
              value={formatNumber(
                overview.summary.pendingNutritionistApplications,
              )}
              description="Waiting for review"
              icon={ClipboardList}
              iconClassName="text-amber-600"
              iconBackgroundClassName="bg-amber-50"
            />
            <KpiCard
              title="Coaching Purchases"
              value={formatNumber(overview.summary.totalPurchases)}
              description="Paid plan purchases"
              icon={CreditCard}
              iconClassName="text-indigo-600"
              iconBackgroundClassName="bg-indigo-50"
            />
            <KpiCard
              title="Net Revenue"
              value={formatCompactNumber(overview.summary.netRevenue)}
              description={`Refunds: ${formatCompactNumber(overview.summary.refundedAmount)}`}
              icon={CircleDollarSign}
              iconClassName="text-violet-600"
              iconBackgroundClassName="bg-violet-50"
            />
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
            <TrendChart
              title="User growth"
              description="Daily user registrations"
              data={dashboard.registrationTrend.map((item) => ({
                date: item.date,
                value: item.count,
              }))}
              lineClassName="text-emerald-600"
              emptyMessage="No registration data available."
            />

            <OverviewCard title="Coaching overview" icon={ShieldCheck}>
              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                {[
                  ["Published plans", overview.coaching.publishedPlans],
                  ["Purchases", overview.coaching.purchases],
                  ["Active programs", overview.coaching.activePrograms],
                  ["Upcoming programs", overview.coaching.upcomingPrograms],
                  ["Paused programs", overview.coaching.pausedPrograms],
                  ["Completed programs", overview.coaching.completedPrograms],
                  ["Cancelled programs", overview.coaching.cancelledPrograms],
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    className="rounded-xl border border-admin-border bg-slate-50/60 p-4"
                  >
                    <p className="text-xs font-medium text-admin-muted">
                      {label}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-admin-text">
                      {formatNumber(Number(value))}
                    </p>
                  </div>
                ))}
              </div>
            </OverviewCard>
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            <TrendChart
              title="Net revenue"
              description="Daily net coaching revenue"
              data={revenueTrend}
              lineClassName="text-indigo-600"
              emptyMessage="No revenue trend data available."
            />

            <OverviewCard title="Revenue summary" icon={CircleDollarSign}>
              <div className="space-y-4">
                {[
                  ["Gross revenue", overview.summary.totalRevenue],
                  ["Refunded amount", overview.summary.refundedAmount],
                  ["Net revenue", overview.summary.netRevenue],
                  ["Commission earned", overview.summary.commissionEarned],
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-sm text-admin-muted">{label}</span>
                    <span className="text-sm font-bold text-admin-text">
                      {formatCompactNumber(Number(value))}
                    </span>
                  </div>
                ))}
              </div>
            </OverviewCard>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <OverviewCard title="Nutritionists" icon={UserCheck}>
              <div className="space-y-5">
                <StatusRow
                  label="Approved"
                  value={overview.nutritionists.approved}
                  total={nutritionistTotal}
                  barClassName="bg-emerald-500"
                />
                <StatusRow
                  label="Pending"
                  value={overview.nutritionists.pending}
                  total={nutritionistTotal}
                  barClassName="bg-amber-500"
                />
                <StatusRow
                  label="Rejected"
                  value={overview.nutritionists.rejected}
                  total={nutritionistTotal}
                  barClassName="bg-rose-500"
                />
                <div className="flex items-center justify-between border-t border-admin-border pt-4">
                  <span className="text-sm font-medium text-admin-muted">
                    Blocked accounts
                  </span>
                  <span className="text-sm font-bold text-admin-text">
                    {formatNumber(overview.nutritionists.blocked)}
                  </span>
                </div>
              </div>
            </OverviewCard>

            <OverviewCard title="Challenges" icon={Trophy}>
              <div className="space-y-5">
                <StatusRow
                  label="Published"
                  value={overview.challenges.published}
                  total={challengeTotal}
                  barClassName="bg-emerald-500"
                />
                <StatusRow
                  label="Draft"
                  value={overview.challenges.draft}
                  total={challengeTotal}
                  barClassName="bg-amber-500"
                />
                <StatusRow
                  label="Archived"
                  value={overview.challenges.archived}
                  total={challengeTotal}
                  barClassName="bg-slate-400"
                />
                <div className="flex items-center justify-between border-t border-admin-border pt-4">
                  <span className="text-sm font-medium text-admin-muted">
                    Total challenges
                  </span>
                  <span className="text-sm font-bold text-admin-text">
                    {formatNumber(challengeTotal)}
                  </span>
                </div>
              </div>
            </OverviewCard>
          </section>

          <DashboardLists
            users={dashboard.users}
            nutritionists={dashboard.nutritionists}
            payments={dashboard.payments}
          />

          <section className="grid gap-5 xl:grid-cols-2">
            <AttentionPanel items={overview.attention} />
            <RecentActivityPanel activities={overview.recentActivity} />
          </section>
        </div>
      </div>
    </main>
  );
}
