"use client";

import type { ComponentProps } from "react";
import dynamic from "next/dynamic";
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
  type LucideIcon,
} from "lucide-react";

import type { AdminDashboardOverviewDTO } from "@/dtos/admin/dashboard/admin-dashboard-overview.dto";
import {
  SECTION_LABELS,
  useAdminDashboard,
  type DashboardSection,
} from "@/hooks/admin/useAdminDashboard.hooks";

import {
  KpiCard,
  TrendChart,
  OverviewCard,
  StatusRow,
  formatNumber,
  formatCompactNumber,
} from "./DashboardWidgets";

type KpiProps = ComponentProps<typeof KpiCard>;
type StatusRowData = [label: string, value: number, barClassName: string];

const ACCENT_TEXT = "text-admin-accent";
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60";

// Below-the-fold code is split out of the initial bundle.
const DashboardLists = dynamic(() => import("./DashboardLists"), {
  loading: () => <Skeleton className="h-96" />,
});
const AttentionPanel = dynamic(
  () => import("./DashboardActivity").then((module) => module.AttentionPanel),
  { loading: () => <Skeleton className="h-72" /> },
);
const RecentActivityPanel = dynamic(
  () =>
    import("./DashboardActivity").then((module) => module.RecentActivityPanel),
  { loading: () => <Skeleton className="h-72" /> },
);

function Skeleton({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-2xl border border-admin-border bg-admin-surface ${className}`}
    />
  );
}

function RefreshIcon({ spinning }: { spinning: boolean }) {
  return spinning ? (
    <Loader2 className="h-4 w-4 animate-spin" />
  ) : (
    <RefreshCw className="h-4 w-4" />
  );
}

function getKpis({ summary }: AdminDashboardOverviewDTO): KpiProps[] {
  return [
    {
      title: "Total Users",
      value: formatNumber(summary.totalUsers),
      description: `${formatNumber(summary.newUsers)} new in period`,
      icon: Users,
      iconClassName: ACCENT_TEXT,
      iconBackgroundClassName: "bg-admin-pastel-blue",
    },
    {
      title: "Nutritionists",
      value: formatNumber(summary.totalNutritionists),
      description: "Nutritionist profiles",
      icon: UserCheck,
      iconClassName: ACCENT_TEXT,
      iconBackgroundClassName: "bg-admin-pastel-green",
    },
    {
      title: "Pending Applications",
      value: formatNumber(summary.pendingNutritionistApplications),
      description: "Waiting for review",
      icon: ClipboardList,
      iconClassName: "text-admin-warning",
      iconBackgroundClassName: "bg-admin-warning/15",
    },
    {
      title: "Coaching Purchases",
      value: formatNumber(summary.totalPurchases),
      description: "Paid plan purchases",
      icon: CreditCard,
      iconClassName: ACCENT_TEXT,
      iconBackgroundClassName: "bg-admin-pastel-purple",
    },
    {
      title: "Net Revenue",
      value: formatCompactNumber(summary.netRevenue),
      description: `Refunds: ${formatCompactNumber(summary.refundedAmount)}`,
      icon: CircleDollarSign,
      iconClassName: ACCENT_TEXT,
      iconBackgroundClassName: "bg-admin-pastel-pink",
    },
  ];
}

const getCoachingStats = ({
  coaching: c,
}: AdminDashboardOverviewDTO): [string, number][] => [
  ["Published plans", c.publishedPlans],
  ["Purchases", c.purchases],
  ["Active programs", c.activePrograms],
  ["Upcoming programs", c.upcomingPrograms],
  ["Paused programs", c.pausedPrograms],
  ["Completed programs", c.completedPrograms],
  ["Cancelled programs", c.cancelledPrograms],
];

const getRevenueStats = ({
  summary: s,
}: AdminDashboardOverviewDTO): [string, number][] => [
  ["Gross revenue", s.totalRevenue],
  ["Refunded amount", s.refundedAmount],
  ["Net revenue", s.netRevenue],
  ["Commission earned", s.commissionEarned],
];

interface StatusCardProps {
  title: string;
  icon: LucideIcon;
  total: number;
  rows: StatusRowData[];
  footerLabel: string;
  footerValue: number;
}

function StatusCard({
  title,
  icon,
  total,
  rows,
  footerLabel,
  footerValue,
}: StatusCardProps) {
  return (
    <OverviewCard title={title} icon={icon}>
      <div className="space-y-5">
        {rows.map(([label, value, barClassName]) => (
          <StatusRow
            key={label}
            label={label}
            value={value}
            total={total}
            barClassName={barClassName}
          />
        ))}
        <div className="flex items-center justify-between border-t border-admin-border pt-4">
          <span className="text-sm font-medium text-admin-muted">
            {footerLabel}
          </span>
          <span className="text-sm font-bold text-admin-text">
            {formatNumber(footerValue)}
          </span>
        </div>
      </div>
    </OverviewCard>
  );
}

export default function AdminDashboard() {
  const { dashboard, pending, errors, isRefreshing, refetch } =
    useAdminDashboard();
  const {
    overview,
    registrationTrend,
    revenueTrend,
    users,
    nutritionists,
    payments,
  } = dashboard;

  if (!overview && !pending.overview) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-2xl border border-admin-border bg-admin-surface p-6 text-center shadow-sm shadow-admin-text/5">
          <AlertCircle className="mx-auto h-8 w-8 text-admin-danger" />
          <h1 className="mt-4 text-lg font-bold text-admin-text">
            Unable to load dashboard overview
          </h1>
          <p className="mt-2 text-sm text-admin-muted">
            {errors.overview ?? "Please try again."}
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isRefreshing}
            className={`mt-5 inline-flex items-center gap-2 rounded-xl bg-admin-accent px-4 py-2.5 text-sm font-semibold text-admin-accent-fg transition-colors hover:bg-admin-accent-hover disabled:opacity-60 ${FOCUS_RING}`}
          >
            <RefreshIcon spinning={isRefreshing} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  const registrationLoading =
    pending.registrationTrend && registrationTrend.length === 0;
  const revenueLoading = pending.revenueTrend && revenueTrend.length === 0;
  const listsLoading =
    (pending.users || pending.nutritionists || pending.payments) &&
    users.length + nutritionists.length + payments.length === 0;

  const failedSections = Object.entries(errors) as [DashboardSection, string][];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-admin-accent">
            Super Admin
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-admin-text">
            Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-admin-muted">
            Monitor users, nutritionists, coaching, challenges, and platform
            operations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isRefreshing}
          className={`inline-flex items-center justify-center gap-2 self-start rounded-xl border border-admin-border bg-admin-surface px-4 py-2.5 text-sm font-semibold text-admin-text transition-colors hover:bg-admin-surface-hover disabled:opacity-60 sm:self-auto ${FOCUS_RING}`}
        >
          <RefreshIcon spinning={isRefreshing} />
          Refresh
        </button>
      </header>

      {failedSections.length > 0 && (
        <div className="space-y-2">
          {failedSections.map(([section, message]) => (
            <div
              key={section}
              className="flex items-start gap-3 rounded-xl border border-admin-warning/30 bg-admin-warning/10 px-4 py-3 text-sm text-admin-text"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-admin-warning" />
              <p>
                <span className="font-semibold">
                  {SECTION_LABELS[section]}:
                </span>{" "}
                {message}
              </p>
            </div>
          ))}
        </div>
      )}

      <section
        aria-busy={!overview}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
      >
        {overview
          ? getKpis(overview).map((kpi) => <KpiCard key={kpi.title} {...kpi} />)
          : Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="h-32" />
            ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        {registrationLoading ? (
          <Skeleton className="h-80" />
        ) : (
          <TrendChart
            title="User growth"
            description="Daily user registrations"
            data={registrationTrend.map(({ date, count }) => ({
              date,
              value: count,
            }))}
            lineClassName={ACCENT_TEXT}
            emptyMessage="No registration data available."
          />
        )}

        {overview ? (
          <OverviewCard title="Coaching overview" icon={ShieldCheck}>
            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {getCoachingStats(overview).map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-admin-border bg-admin-surface-hover p-4"
                >
                  <p className="text-xs font-medium text-admin-muted">
                    {label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-admin-text">
                    {formatNumber(value)}
                  </p>
                </div>
              ))}
            </div>
          </OverviewCard>
        ) : (
          <Skeleton className="h-80" />
        )}
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {revenueLoading ? (
          <Skeleton className="h-80" />
        ) : (
          <TrendChart
            title="Net revenue"
            description="Daily net coaching revenue"
            data={revenueTrend.map(({ date, netRevenue }) => ({
              date,
              value: netRevenue,
            }))}
            lineClassName="text-admin-success"
            emptyMessage="No revenue trend data available."
          />
        )}

        {overview ? (
          <OverviewCard title="Revenue summary" icon={CircleDollarSign}>
            <div className="space-y-4">
              {getRevenueStats(overview).map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-sm text-admin-muted">{label}</span>
                  <span className="text-sm font-bold text-admin-text">
                    {formatCompactNumber(value)}
                  </span>
                </div>
              ))}
            </div>
          </OverviewCard>
        ) : (
          <Skeleton className="h-80" />
        )}
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {overview ? (
          <>
            <StatusCard
              title="Nutritionists"
              icon={UserCheck}
              total={
                overview.nutritionists.approved +
                overview.nutritionists.pending +
                overview.nutritionists.rejected
              }
              rows={[
                ["Approved", overview.nutritionists.approved, "bg-admin-success"],
                ["Pending", overview.nutritionists.pending, "bg-admin-warning"],
                ["Rejected", overview.nutritionists.rejected, "bg-admin-danger"],
              ]}
              footerLabel="Blocked accounts"
              footerValue={overview.nutritionists.blocked}
            />
            <StatusCard
              title="Challenges"
              icon={Trophy}
              total={overview.challenges.total}
              rows={[
                ["Published", overview.challenges.published, "bg-admin-success"],
                ["Draft", overview.challenges.draft, "bg-admin-warning"],
                ["Archived", overview.challenges.archived, "bg-admin-muted"],
              ]}
              footerLabel="Total challenges"
              footerValue={overview.challenges.total}
            />
          </>
        ) : (
          <>
            <Skeleton className="h-72" />
            <Skeleton className="h-72" />
          </>
        )}
      </section>

      {listsLoading ? (
        <Skeleton className="h-96" />
      ) : (
        <DashboardLists
          users={users}
          nutritionists={nutritionists}
          payments={payments}
        />
      )}

      <section className="grid gap-5 xl:grid-cols-2">
        {overview ? (
          <>
            <AttentionPanel items={overview.attention} />
            <RecentActivityPanel activities={overview.recentActivity} />
          </>
        ) : (
          <>
            <Skeleton className="h-72" />
            <Skeleton className="h-72" />
          </>
        )}
      </section>
    </div>
  );
}