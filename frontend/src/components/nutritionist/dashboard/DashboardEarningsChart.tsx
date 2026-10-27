"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, TrendingUp } from "lucide-react";

import type { NutriDashboardEarningsChartDTO } from "@/dtos/nutritionist/dashboard/nutri-dashboard-earnings-chart.dto";

interface DashboardEarningsChartProps {
  earnings: NutriDashboardEarningsChartDTO;
  className?: string;
}

const currencyLocales: Record<string, string> = {
  INR: "en-IN",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
};

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat(currencyLocales[currency] ?? "en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatMonth(month: string, year: number): string {
  const date = new Date(`${month} 1, ${year}`);

  if (Number.isNaN(date.getTime())) {
    return `${month} ${year}`;
  }

  return date.toLocaleDateString("en-IN", {
    month: "short",
    year: "2-digit",
  });
}

export default function DashboardEarningsChart({
  earnings,
  className = "",
}: DashboardEarningsChartProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const chartData = useMemo(
    () =>
      earnings.data.map((item) => ({
        ...item,
        label: formatMonth(item.month, item.year),
      })),
    [earnings.data],
  );

  const maxEarnings = Math.max(
    1,
    ...chartData.map((item) => item.earnings),
  );

  const totalEarnings = chartData.reduce(
    (total, item) => total + item.earnings,
    0,
  );

  const totalTransactions = chartData.reduce(
    (total, item) => total + item.transactions,
    0,
  );

  const selectedItem =
    selectedIndex === null ? null : chartData[selectedIndex] ?? null;

  return (
    <section
      className={`rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp size={19} />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              Earnings overview
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Monthly coaching earnings
            </p>
          </div>
        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          {chartData.length} months
        </span>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-slate-400">
            Earnings in period
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {formatCurrency(totalEarnings, earnings.currency)}
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-xs font-medium text-slate-400">
            Successful transactions
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {totalTransactions.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="mt-7 flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center">
          <TrendingUp size={24} className="text-slate-300" />
          <p className="mt-3 text-sm font-semibold text-slate-700">
            No earnings data yet
          </p>
          <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
            Your monthly earnings will appear here when transactions are
            recorded.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8">
            <div className="flex h-48 items-end gap-2 sm:gap-4">
              {chartData.map((item, index) => {
                const height =
                  item.earnings > 0
                    ? Math.max(5, (item.earnings / maxEarnings) * 100)
                    : 0;

                const isSelected = selectedIndex === index;

                return (
                  <button
                    key={`${item.year}-${item.month}`}
                    type="button"
                    onClick={() =>
                      setSelectedIndex(isSelected ? null : index)
                    }
                    aria-label={`${item.label}: ${formatCurrency(item.earnings, earnings.currency)}, ${item.transactions} transactions`}
                    aria-pressed={isSelected}
                    className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  >
                    <span className="text-center text-[10px] font-medium text-slate-500 sm:text-xs">
                      {item.earnings > 0
                        ? formatCurrency(item.earnings, earnings.currency)
                        : "—"}
                    </span>

                    <div className="flex h-full w-full items-end justify-center">
                      <div
                        className={`w-full max-w-12 rounded-t-lg transition-all duration-300 ${
                          isSelected
                            ? "bg-emerald-700"
                            : "bg-emerald-500 group-hover:bg-emerald-600"
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    </div>

                    <span
                      className={`whitespace-nowrap text-[10px] font-medium sm:text-xs ${
                        isSelected
                          ? "text-emerald-700"
                          : "text-slate-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedItem && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {selectedItem.label}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {selectedItem.transactions.toLocaleString("en-IN")}{" "}
                  transactions
                </p>
              </div>

              <p className="text-base font-bold text-emerald-700">
                {formatCurrency(
                  selectedItem.earnings,
                  earnings.currency,
                )}
              </p>
            </div>
          )}
        </>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-400">
          {earnings.period.from && earnings.period.to
            ? `${new Date(earnings.period.from).toLocaleDateString("en-IN", {
                month: "short",
                year: "numeric",
              })} – ${new Date(earnings.period.to).toLocaleDateString(
                "en-IN",
                {
                  month: "short",
                  year: "numeric",
                },
              )}`
            : "Selected period"}
        </p>

        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
          Monthly report
          <ArrowUpRight size={13} />
        </span>
      </div>
    </section>
  );
}