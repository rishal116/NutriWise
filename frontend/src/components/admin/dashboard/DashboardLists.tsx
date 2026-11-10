"use client";

import type { ReactNode } from "react";

import type { AdminDashboardRecentUserDTO } from "@/dtos/admin/dashboard/admin-dashboard-recent-user.dto";
import type { AdminDashboardPendingNutritionistDTO } from "@/dtos/admin/dashboard/admin-dashboard-pending-nutritionist.dto";
import type { AdminDashboardRecentPaymentDTO } from "@/dtos/admin/dashboard/admin-dashboard-recent-payment.dto";
import { EmptyState, formatNumber } from "./DashboardWidgets";

interface DashboardListsProps {
  users: AdminDashboardRecentUserDTO[];
  nutritionists: AdminDashboardPendingNutritionistDTO[];
  payments: AdminDashboardRecentPaymentDTO[];
}

const TONES = {
  success: "bg-admin-pastel-green text-admin-success",
  danger: "bg-admin-danger-soft text-admin-danger",
  warning: "bg-admin-warning/15 text-admin-warning",
  neutral: "bg-admin-pastel-purple text-admin-text",
} as const;

const PAYMENT_TONES: Record<string, string> = {
  paid: TONES.success,
  refunded: TONES.neutral,
  failed: TONES.danger,
};

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatDate(value: string): string {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "Invalid date" : dateFormatter.format(date);
}

function Badge({ tone, children }: { tone: string; children: ReactNode }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${tone}`}
    >
      {children}
    </span>
  );
}

function ListRow({
  title,
  subtitle,
  date,
  badge,
}: {
  title: string;
  subtitle: string;
  date: string;
  badge: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-admin-text">{title}</p>
        <p className="truncate text-xs text-admin-muted">{subtitle}</p>
        <p className="mt-1 text-xs text-admin-muted">{formatDate(date)}</p>
      </div>
      {badge}
    </div>
  );
}

interface ListPanelProps<T> {
  title: string;
  items: T[];
  emptyTitle: string;
  emptyDescription: string;
  renderRow: (item: T) => ReactNode;
}

function ListPanel<T extends { id: string | number }>({
  title,
  items,
  emptyTitle,
  emptyDescription,
  renderRow,
}: ListPanelProps<T>) {
  return (
    <section className="min-w-0 rounded-2xl border border-admin-border bg-admin-surface p-5 shadow-sm shadow-admin-text/5">
      <h2 className="text-base font-bold text-admin-text">{title}</h2>

      <div className="mt-4">
        {items.length === 0 ? (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id}>{renderRow(item)}</div>
            ))}
          </div>
        )}
      </div>
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
      <ListPanel
        title="Recent users"
        items={users}
        emptyTitle="No recent users"
        emptyDescription="New registrations will appear here."
        renderRow={(user) => (
          <ListRow
            title={user.fullName}
            subtitle={user.email}
            date={user.createdAt}
            badge={
              <Badge tone={user.isBlocked ? TONES.danger : TONES.success}>
                {user.isBlocked ? "Blocked" : "Active"}
              </Badge>
            }
          />
        )}
      />

      <ListPanel
        title="Pending nutritionists"
        items={nutritionists}
        emptyTitle="No pending applications"
        emptyDescription="There are no applications awaiting review."
        renderRow={(nutritionist) => (
          <ListRow
            title={nutritionist.fullName}
            subtitle={nutritionist.email}
            date={nutritionist.createdAt}
            badge={<Badge tone={TONES.warning}>Pending</Badge>}
          />
        )}
      />

      <ListPanel
        title="Recent payments"
        items={payments}
        emptyTitle="No recent payments"
        emptyDescription="Recent payment activity will appear here."
        renderRow={(payment) => (
          <ListRow
            title={payment.customerName}
            subtitle={`${payment.currency.toUpperCase()} ${formatNumber(payment.amount)}`}
            date={payment.createdAt}
            badge={
              <Badge tone={PAYMENT_TONES[payment.status] ?? TONES.warning}>
                {payment.status}
              </Badge>
            }
          />
        )}
      />
    </section>
  );
}