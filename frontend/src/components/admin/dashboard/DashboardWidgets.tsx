
"use client";

import type { ComponentType, ReactNode } from "react";
import { BarChart3 } from "lucide-react";
import type { AdminDashboardTrendDTO } from "@/dtos/admin/dashboard/admin-dashboard-overview.dto";

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

export function formatNumber(value: number): string {
  return value.toLocaleString("en-IN");
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatTrendDate(value: string): string {
  const [year, month, day] = value.split("-");

  if (!year || !month || !day) return value;

  return new Date(Number(year), Number(month) - 1, Number(day))
    .toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

export function KpiCard({
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
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBackgroundClassName}`}>
          <Icon className={`h-5 w-5 ${iconClassName}`} />
        </div>
      </div>
    </article>
  );
}

export function TrendChart({
  title,
  description,
  data,
  valueFormatter = formatCompactNumber,
  lineClassName,
  emptyMessage,
}: TrendChartProps) {
  const chartWidth = 720;
  const chartHeight = 250;
  const paddingX = 28;
  const paddingTop = 20;
  const paddingBottom = 34;
  const usableWidth = chartWidth - paddingX * 2;
  const usableHeight = chartHeight - paddingTop - paddingBottom;
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  const points = data.map((item, index) => ({
    item,
    x: data.length === 1
      ? chartWidth / 2
      : paddingX + (index / (data.length - 1)) * usableWidth,
    y: paddingTop + usableHeight - (item.value / maxValue) * usableHeight,
  }));

  const labelIndexes = data.length <= 7
    ? data.map((_, index) => index)
    : [...new Set([0, Math.floor(data.length / 2), data.length - 1])];

  return (
    <section className="rounded-2xl border border-admin-border bg-admin-surface p-5 shadow-sm">
      <h2 className="text-base font-bold text-admin-text">{title}</h2>
      <p className="mt-1 text-xs text-admin-muted">{description}</p>

      {data.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <BarChart3 className="h-8 w-8 text-admin-muted/50" />
          <p className="mt-3 text-sm font-medium text-admin-muted">{emptyMessage}</p>
        </div>
      ) : (
        <>
          <div className="mt-5 overflow-hidden">
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
                points={points.map(({ x, y }) => `${x},${y}`).join(" ")}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {points.map(({ x, y, item }) => (
                <circle
                  key={`${item.date}-${item.value}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              ))}

              {labelIndexes.map((index) => {
                const point = points[index];
                if (!point) return null;

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
              <strong className="text-admin-text">
                {valueFormatter(data[data.length - 1]?.value ?? 0)}
              </strong>
            </span>
            <span className="text-xs text-admin-muted">
              Peak:{" "}
              <strong className="text-admin-text">{valueFormatter(maxValue)}</strong>
            </span>
          </div>
        </>
      )}
    </section>
  );
}

export function StatusRow({
  label,
  value,
  total,
  barClassName,
}: StatusRowProps) {
  const percentage = total > 0 ? Math.min((value / total) * 100, 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-admin-text">{label}</span>
        <span className="text-sm font-bold text-admin-text">{formatNumber(value)}</span>
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

export function OverviewCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: IconComponent;
  children: ReactNode;
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

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-32 items-center justify-center text-center">
      <div>
        <p className="text-sm font-semibold text-admin-text">{title}</p>
        <p className="mt-1 text-xs leading-5 text-admin-muted">{description}</p>
      </div>
    </div>
  );
}
