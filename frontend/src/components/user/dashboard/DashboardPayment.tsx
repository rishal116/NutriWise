"use client";

import { Wallet } from "lucide-react";
import type { UserDashboardPaymentOverviewDTO } from "@/dtos/user/dashboard/user-dashboard-payment-overview.dto";
import { DashboardPanel, EmptyState } from "./DashboardShared";

function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-IN")}`;
  }
}

export default function DashboardPayment({
  overview,
}: {
  overview: UserDashboardPaymentOverviewDTO | null;
}) {
  return (
    <DashboardPanel>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Spending overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Your net spending for the selected period.
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
          <Wallet className="h-5 w-5" />
        </div>
      </div>

      {!overview ? (
        <div className="mt-5">
          <EmptyState
            title="Spending data unavailable"
            description="Your payment summary could not be loaded right now."
          />
        </div>
      ) : (
        <>
          <div className="mt-5 rounded-xl bg-slate-50 p-4 sm:p-5">
            <p className="text-sm font-medium text-slate-500">
              Total spending
            </p>
            <p className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {formatCurrency(overview.totalSpent, overview.currency)}
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {overview.monthlySpending.length === 0 ? (
              <p className="text-sm text-slate-500">
                No payment activity was recorded for this period.
              </p>
            ) : (
              overview.monthlySpending.map((month) => (
                <div
                  key={`${month.year}-${month.month}`}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="text-slate-600">
                    {new Intl.DateTimeFormat("en-IN", {
                      month: "long",
                      year: "numeric",
                    }).format(new Date(month.year, month.month - 1, 1))}
                  </span>
                  <span className="font-semibold tabular-nums text-slate-900">
                    {formatCurrency(month.amount, overview.currency)}
                  </span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </DashboardPanel>
  );
}