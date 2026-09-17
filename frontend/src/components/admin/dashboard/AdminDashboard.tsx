"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  FileText,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Trophy,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";

import { adminDashboardService } from "@/services/admin/adminDashboard.service";

import type {
  AdminDashboardActivityDTO,
  AdminDashboardAttentionDTO,
  AdminDashboardOverviewDTO,
  AdminDashboardTrendDTO,
} from "@/dtos/admin/dashboard/admin-dashboard-overview.dto";

import { getErrorMessage } from "@/utils/getErrorMessage";

type IconComponent = ComponentType<{ className?: string }>;

interface KpiCardProps {
  title: string;
  value: string;
  description: string;
  icon: IconComponent;
  iconClassName: string;
  iconBackgroundClassName: string;
}

interface TrendChartProps {
  title: string;
  description: string;
  data: AdminDashboardTrendDTO[];
  valueFormatter?: (value: number) => string;
  lineClassName: string;
  emptyMessage: string;
}

interface StatusRowProps {
  label: string;
  value: number;
  total: number;
  barClassName: string;
}

const ATTENTION_LINKS: Record<AdminDashboardAttentionDTO["type"], string> = {
  nutritionist_application: "/admin/nutritionist-applications",
  challenge: "/admin/challenges",
  user: "/admin/users",
  payment: "/admin/payments",
};

const ACTIVITY_ICONS: Record<AdminDashboardActivityDTO["type"], IconComponent> =
  {
    user_registered: UserPlus,
    nutritionist_application: ClipboardList,
    nutritionist_approved: BadgeCheck,
    challenge_published: Trophy,
    purchase_completed: CircleDollarSign,
  };

const ACTIVITY_ICON_STYLES: Record<AdminDashboardActivityDTO["type"], string> =
  {
    user_registered: "bg-sky-50 text-sky-600",
    nutritionist_application: "bg-amber-50 text-amber-600",
    nutritionist_approved: "bg-emerald-50 text-emerald-600",
    challenge_published: "bg-violet-50 text-violet-600",
    purchase_completed: "bg-indigo-50 text-indigo-600",
  };

function formatNumber(value: number): string {
  return value.toLocaleString("en-IN");
}

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatActivityDate(value: string): string {
  const date = new Date(value);

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTrendDate(value: string): string {
  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return value;
  }

  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName,
  iconBackgroundClassName,
}: KpiCardProps) {
  return (
    <article className="rounded-2xl border border-admin-border bg-admin-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-admin-muted">
            {title}
          </p>

          <p className="mt-3 text-2xl font-bold tracking-tight text-admin-text sm:text-3xl">
            {value}
          </p>

          <p className="mt-1 text-xs text-admin-muted">{description}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBackgroundClassName}`}
        >
          <Icon className={`h-5 w-5 ${iconClassName}`} />
        </div>
      </div>
    </article>
  );
}

function TrendChart({
  title,
  description,
  data,
  valueFormatter = formatCompactNumber,
  lineClassName,
  emptyMessage,
}: TrendChartProps) {
  if (data.length === 0) {
    return (
      <section className="rounded-2xl border border-admin-border bg-admin-surface p-5 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-admin-text">{title}</h2>
          <p className="mt-1 text-xs text-admin-muted">{description}</p>
        </div>

        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <BarChart3 className="mx-auto h-8 w-8 text-admin-muted/50" />
            <p className="mt-3 text-sm font-medium text-admin-muted">
              {emptyMessage}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const values = data.map((item) => item.value);
  const maxValue = Math.max(...values, 1);
  const chartWidth = 720;
  const chartHeight = 250;
  const paddingX = 28;
  const paddingTop = 20;
  const paddingBottom = 34;
  const usableWidth = chartWidth - paddingX * 2;
  const usableHeight = chartHeight - paddingTop - paddingBottom;

  const points = data.map((item, index) => {
    const x =
      data.length === 1
        ? chartWidth / 2
        : paddingX + (index / (data.length - 1)) * usableWidth;

    const y =
      paddingTop + usableHeight - (item.value / maxValue) * usableHeight;

    return {
      x,
      y,
      item,
    };
  });

  const polylinePoints = points.map(({ x, y }) => `${x},${y}`).join(" ");

  const labelIndexes =
    data.length <= 7
      ? data.map((_, index) => index)
      : [0, Math.floor(data.length / 2), data.length - 1];

  return (
    <section className="rounded-2xl border border-admin-border bg-admin-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-admin-text">{title}</h2>
          <p className="mt-1 text-xs text-admin-muted">{description}</p>
        </div>

        <span className="rounded-lg bg-admin-accent-soft px-2.5 py-1 text-[11px] font-semibold text-admin-accent">
          {data.length} points
        </span>
      </div>

      <div className="mt-5">
        <div className="overflow-hidden">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className={`h-64 w-full ${lineClassName}`}
            role="img"
            aria-label={`${title} trend chart`}
          >
            {[0, 1, 2, 3].map((row) => {
              const y = paddingTop + (row / 3) * usableHeight;

              return (
                <line
                  key={row}
                  x1={paddingX}
                  x2={chartWidth - paddingX}
                  y1={y}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.08"
                  strokeDasharray="4 5"
                />
              );
            })}

            <polyline
              points={polylinePoints}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {points.map(({ x, y, item }) => (
              <g key={`${item.date}-${item.value}`}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="currentColor"
                  className="text-admin-surface"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </g>
            ))}

            {labelIndexes.map((index) => {
              const point = points[index];

              if (!point) {
                return null;
              }

              return (
                <text
                  key={point.item.date}
                  x={point.x}
                  y={chartHeight - 8}
                  textAnchor="middle"
                  fill="currentColor"
                  opacity="0.55"
                  fontSize="11"
                >
                  {formatTrendDate(point.item.date)}
                </text>
              );
            })}
          </svg>
        </div>

        <div className="mt-1 flex items-center justify-between border-t border-admin-border pt-3">
          <span className="text-xs text-admin-muted">
            Latest:{" "}
            <strong className="font-semibold text-admin-text">
              {valueFormatter(data[data.length - 1]?.value ?? 0)}
            </strong>
          </span>

          <span className="text-xs text-admin-muted">
            Peak:{" "}
            <strong className="font-semibold text-admin-text">
              {valueFormatter(maxValue)}
            </strong>
          </span>
        </div>
      </div>
    </section>
  );
}

function StatusRow({ label, value, total, barClassName }: StatusRowProps) {
  const percentage = total > 0 ? Math.min((value / total) * 100, 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-admin-text">{label}</span>

        <span className="text-sm font-bold text-admin-text">
          {formatNumber(value)}
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all ${barClassName}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function OverviewCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: IconComponent;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-admin-border bg-admin-surface p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-admin-accent-soft text-admin-accent">
          <Icon className="h-4 w-4" />
        </div>

        <h2 className="text-base font-bold text-admin-text">{title}</h2>
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}

function AttentionPanel({ items }: { items: AdminDashboardAttentionDTO[] }) {
  return (
    <section className="rounded-2xl border border-admin-border bg-admin-surface p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-admin-text">
            Needs attention
          </h2>
          <p className="mt-1 text-xs text-admin-muted">
            Items that may need an administrator action.
          </p>
        </div>

        {items.length > 0 && (
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
            {items.length}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="Everything looks clear"
          description="There are no outstanding dashboard alerts right now."
        />
      ) : (
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <div
              key={`${item.type}-${item.title}`}
              className="rounded-xl border border-admin-border bg-slate-50/60 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-admin-text">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs text-admin-muted">
                    {formatNumber(item.count)} item
                    {item.count === 1 ? "" : "s"}
                  </p>

                  <Link
                    href={ATTENTION_LINKS[item.type]}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-admin-accent hover:underline"
                  >
                    {item.action}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function RecentActivityPanel({
  activities,
}: {
  activities: AdminDashboardActivityDTO[];
}) {
  return (
    <section className="rounded-2xl border border-admin-border bg-admin-surface p-5 shadow-sm">
      <div>
        <h2 className="text-base font-bold text-admin-text">Recent activity</h2>

        <p className="mt-1 text-xs text-admin-muted">
          The latest activity across the platform.
        </p>
      </div>

      {activities.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No recent activity"
          description="New activity will appear here as the platform changes."
        />
      ) : (
        <div className="mt-5 divide-y divide-admin-border">
          {activities.map((activity, index) => {
            const Icon = ACTIVITY_ICONS[activity.type];
            const iconStyle = ACTIVITY_ICON_STYLES[activity.type];

            return (
              <div
                key={`${activity.type}-${activity.createdAt}-${index}`}
                className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-admin-text">
                    {activity.title}
                  </p>

                  <p className="mt-1 text-[11px] text-admin-muted">
                    {formatActivityDate(activity.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: IconComponent;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-40 items-center justify-center">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
          <Icon className="h-5 w-5" />
        </div>

        <p className="mt-3 text-sm font-semibold text-admin-text">{title}</p>

        <p className="mt-1 text-xs leading-5 text-admin-muted">{description}</p>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl border border-admin-border bg-admin-surface"
          />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        <div className="h-80 animate-pulse rounded-2xl border border-admin-border bg-admin-surface" />
        <div className="h-80 animate-pulse rounded-2xl border border-admin-border bg-admin-surface" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="h-72 animate-pulse rounded-2xl border border-admin-border bg-admin-surface" />
        <div className="h-72 animate-pulse rounded-2xl border border-admin-border bg-admin-surface" />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="h-80 animate-pulse rounded-2xl border border-admin-border bg-admin-surface" />
        <div className="h-80 animate-pulse rounded-2xl border border-admin-border bg-admin-surface" />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState<AdminDashboardOverviewDTO | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminDashboardService.getOverview();

      setDashboard(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDashboard();
  }, []);

  if (loading && !dashboard) {
    return (
      <main className="min-h-full bg-admin-background p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-6">
            <div className="h-8 w-52 animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-2 h-4 w-80 animate-pulse rounded-lg bg-slate-200" />
          </div>

          <DashboardSkeleton />
        </div>
      </main>
    );
  }

  if (error && !dashboard) {
    return (
      <main className="min-h-full bg-admin-background p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex min-h-[60vh] max-w-[1600px] items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-admin-border bg-admin-surface p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <AlertCircle className="h-6 w-6" />
            </div>

            <h1 className="mt-4 text-lg font-bold text-admin-text">
              Unable to load dashboard
            </h1>

            <p className="mt-2 text-sm leading-6 text-admin-muted">{error}</p>

            <button
              type="button"
              onClick={() => void fetchDashboard()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!dashboard) {
    return null;
  }

  const nutritionistTotal =
    dashboard.nutritionists.approved +
    dashboard.nutritionists.pending +
    dashboard.nutritionists.rejected;

  const challengeTotal = dashboard.challenges.total;

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
              Monitor users, nutritionists, coaching activity, challenges, and
              platform operations from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchDashboard()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-admin-border bg-admin-surface px-4 py-2.5 text-sm font-semibold text-admin-text transition hover:bg-admin-surface-hover disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </button>
        </header>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <KpiCard
              title="Total Users"
              value={formatNumber(dashboard.summary.totalUsers)}
              description="Registered accounts"
              icon={Users}
              iconClassName="text-sky-600"
              iconBackgroundClassName="bg-sky-50"
            />

            <KpiCard
              title="Nutritionists"
              value={formatNumber(dashboard.summary.totalNutritionists)}
              description="Nutritionist profiles"
              icon={UserCheck}
              iconClassName="text-emerald-600"
              iconBackgroundClassName="bg-emerald-50"
            />

            <KpiCard
              title="Pending Applications"
              value={formatNumber(
                dashboard.summary.pendingNutritionistApplications,
              )}
              description="Waiting for review"
              icon={ClipboardList}
              iconClassName="text-amber-600"
              iconBackgroundClassName="bg-amber-50"
            />

            <KpiCard
              title="Coaching Purchases"
              value={formatNumber(dashboard.summary.totalPurchases)}
              description="Paid plan purchases"
              icon={CreditCard}
              iconClassName="text-indigo-600"
              iconBackgroundClassName="bg-indigo-50"
            />

            <KpiCard
              title="Recorded Revenue"
              value={formatCompactNumber(dashboard.summary.totalRevenue)}
              description="Paid plan amounts"
              icon={CircleDollarSign}
              iconClassName="text-violet-600"
              iconBackgroundClassName="bg-violet-50"
            />
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
            <TrendChart
              title="User growth"
              description="User registrations over time"
              data={dashboard.trends.users}
              lineClassName="text-emerald-600"
              emptyMessage="No user growth data available."
            />

            <OverviewCard title="Coaching overview" icon={ShieldCheck}>
              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <div className="rounded-xl border border-admin-border bg-slate-50/60 p-4">
                  <p className="text-xs font-medium text-admin-muted">
                    Published Plans
                  </p>

                  <p className="mt-2 text-2xl font-bold text-admin-text">
                    {formatNumber(dashboard.coaching.publishedPlans)}
                  </p>
                </div>

                <div className="rounded-xl border border-admin-border bg-slate-50/60 p-4">
                  <p className="text-xs font-medium text-admin-muted">
                    Purchases
                  </p>

                  <p className="mt-2 text-2xl font-bold text-admin-text">
                    {formatNumber(dashboard.coaching.purchases)}
                  </p>
                </div>

                <div className="rounded-xl border border-admin-border bg-slate-50/60 p-4">
                  <p className="text-xs font-medium text-admin-muted">
                    Active Programs
                  </p>

                  <p className="mt-2 text-2xl font-bold text-admin-text">
                    {formatNumber(dashboard.coaching.activePrograms)}
                  </p>
                </div>
              </div>
            </OverviewCard>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <TrendChart
              title="Revenue activity"
              description="Paid coaching amounts recorded over time"
              data={dashboard.trends.revenue}
              lineClassName="text-indigo-600"
              valueFormatter={formatCompactNumber}
              emptyMessage="No revenue trend data available."
            />

            <TrendChart
              title="Nutritionist approvals"
              description="Approved nutritionist profiles over time"
              data={dashboard.trends.nutritionists}
              lineClassName="text-sky-600"
              emptyMessage="No nutritionist trend data available."
            />
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <OverviewCard title="Nutritionists" icon={UserCheck}>
              <div className="space-y-5">
                <StatusRow
                  label="Approved"
                  value={dashboard.nutritionists.approved}
                  total={nutritionistTotal}
                  barClassName="bg-emerald-500"
                />

                <StatusRow
                  label="Pending"
                  value={dashboard.nutritionists.pending}
                  total={nutritionistTotal}
                  barClassName="bg-amber-500"
                />

                <StatusRow
                  label="Rejected"
                  value={dashboard.nutritionists.rejected}
                  total={nutritionistTotal}
                  barClassName="bg-rose-500"
                />

                <div className="flex items-center justify-between border-t border-admin-border pt-4">
                  <span className="text-sm font-medium text-admin-muted">
                    Blocked accounts
                  </span>

                  <span className="text-sm font-bold text-admin-text">
                    {formatNumber(dashboard.nutritionists.blocked)}
                  </span>
                </div>
              </div>
            </OverviewCard>

            <OverviewCard title="Challenges" icon={Trophy}>
              <div className="space-y-5">
                <StatusRow
                  label="Published"
                  value={dashboard.challenges.published}
                  total={challengeTotal}
                  barClassName="bg-emerald-500"
                />

                <StatusRow
                  label="Draft"
                  value={dashboard.challenges.draft}
                  total={challengeTotal}
                  barClassName="bg-amber-500"
                />

                <StatusRow
                  label="Archived"
                  value={dashboard.challenges.archived}
                  total={challengeTotal}
                  barClassName="bg-slate-400"
                />

                <div className="flex items-center justify-between border-t border-admin-border pt-4">
                  <span className="text-sm font-medium text-admin-muted">
                    Total challenges
                  </span>

                  <span className="text-sm font-bold text-admin-text">
                    {formatNumber(dashboard.challenges.total)}
                  </span>
                </div>
              </div>
            </OverviewCard>
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            <AttentionPanel items={dashboard.attention} />

            <RecentActivityPanel activities={dashboard.recentActivity} />
          </section>
        </div>
      </div>
    </main>
  );
}
