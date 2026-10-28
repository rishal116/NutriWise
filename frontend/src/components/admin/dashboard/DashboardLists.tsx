"use client";

import type { AdminDashboardRecentUserDTO } from "@/dtos/admin/dashboard/admin-dashboard-recent-user.dto";
import type { AdminDashboardPendingNutritionistDTO } from "@/dtos/admin/dashboard/admin-dashboard-pending-nutritionist.dto";
import type { AdminDashboardRecentPaymentDTO } from "@/dtos/admin/dashboard/admin-dashboard-recent-payment.dto";
import { EmptyState, formatNumber } from "./DashboardWidgets";

interface DashboardListsProps {
  users: AdminDashboardRecentUserDTO[];
  nutritionists: AdminDashboardPendingNutritionistDTO[];
  payments: AdminDashboardRecentPaymentDTO[];
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-admin-border bg-admin-surface p-5 shadow-sm">
      <h2 className="text-base font-bold text-admin-text">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function DashboardLists({
  users,
  nutritionists,
  payments,
}: DashboardListsProps) {
  return (
    <section className="grid gap-5 xl:grid-cols-3">
      <Panel title="Recent users">
        {users.length === 0 ? (
          <EmptyState
            title="No recent users"
            description="New registrations will appear here."
          />
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-admin-text">
                    {user.fullName}
                  </p>
                  <p className="truncate text-xs text-admin-muted">
                    {user.email}
                  </p>
                  <p className="mt-1 text-xs text-admin-muted">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${
                    user.isBlocked
                      ? "bg-rose-50 text-rose-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel title="Pending nutritionists">
        {nutritionists.length === 0 ? (
          <EmptyState
            title="No pending applications"
            description="There are no applications awaiting review."
          />
        ) : (
          <div className="space-y-4">
            {nutritionists.map((nutritionist) => (
              <div
                key={nutritionist.id}
                className="flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-admin-text">
                    {nutritionist.fullName}
                  </p>
                  <p className="truncate text-xs text-admin-muted">
                    {nutritionist.email}
                  </p>
                  <p className="mt-1 text-xs text-admin-muted">
                    {formatDate(nutritionist.createdAt)}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">
                  Pending
                </span>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel title="Recent payments">
        {payments.length === 0 ? (
          <EmptyState
            title="No recent payments"
            description="Recent payment activity will appear here."
          />
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-admin-text">
                    {payment.customerName}
                  </p>
                  <p className="text-xs text-admin-muted">
                    {payment.currency.toUpperCase()}{" "}
                    {formatNumber(payment.amount)}
                  </p>
                  <p className="mt-1 text-xs text-admin-muted">
                    {formatDate(payment.createdAt)}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${
                    payment.status === "paid"
                      ? "bg-emerald-50 text-emerald-600"
                      : payment.status === "refunded"
                        ? "bg-violet-50 text-violet-600"
                        : payment.status === "failed"
                          ? "bg-rose-50 text-rose-600"
                          : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {payment.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </section>
  );
}
