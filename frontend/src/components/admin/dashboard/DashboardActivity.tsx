"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  BadgeCheck,
  CircleDollarSign,
  ClipboardList,
  Trophy,
  UserPlus,
} from "lucide-react";

import type { ComponentType } from "react";
import type {
  AdminDashboardActivityDTO,
  AdminDashboardAttentionDTO,
} from "@/dtos/admin/dashboard/admin-dashboard-overview.dto";
import { EmptyState, formatNumber } from "./DashboardWidgets";

type IconComponent = ComponentType<{ className?: string }>;

interface ActivityMeta {
  icon: IconComponent;
  tileClassName: string;
  iconClassName: string;
}

const CARD_CLASS =
  "rounded-2xl border border-admin-border bg-admin-surface p-5 shadow-sm shadow-admin-text/5";

const ATTENTION_LINKS: Record<AdminDashboardAttentionDTO["type"], string> = {
  nutritionist_application: "/admin/nutritionist-applications",
  challenge: "/admin/challenges",
  user: "/admin/users",
  payment: "/admin/payments",
};

const ACTIVITY_META: Record<AdminDashboardActivityDTO["type"], ActivityMeta> = {
  user_registered: {
    icon: UserPlus,
    tileClassName: "bg-admin-pastel-blue",
    iconClassName: "text-admin-accent",
  },
  nutritionist_application: {
    icon: ClipboardList,
    tileClassName: "bg-admin-warning/15",
    iconClassName: "text-admin-warning",
  },
  nutritionist_approved: {
    icon: BadgeCheck,
    tileClassName: "bg-admin-pastel-green",
    iconClassName: "text-admin-accent",
  },
  challenge_published: {
    icon: Trophy,
    tileClassName: "bg-admin-pastel-purple",
    iconClassName: "text-admin-accent",
  },
  purchase_completed: {
    icon: CircleDollarSign,
    tileClassName: "bg-admin-pastel-pink",
    iconClassName: "text-admin-accent",
  },
};

const activityDateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

function formatActivityDate(value: string): string {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Invalid date"
    : activityDateFormatter.format(date);
}

export function AttentionPanel({
  items,
}: {
  items: AdminDashboardAttentionDTO[];
}) {
  return (
    <section className={CARD_CLASS}>
      <h2 className="text-base font-bold text-admin-text">Needs attention</h2>
      <p className="mt-1 text-xs text-admin-muted">
        Items that may need an administrator action.
      </p>

      {items.length === 0 ? (
        <EmptyState
          title="Everything looks clear"
          description="There are no outstanding dashboard alerts."
        />
      ) : (
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <div
              key={`${item.type}-${item.title}`}
              className="rounded-xl border border-admin-border bg-admin-surface-hover p-4"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-admin-warning" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-admin-text">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-admin-muted">
                    {formatNumber(item.count)} item{item.count === 1 ? "" : "s"}
                  </p>
                  <Link
                    href={ATTENTION_LINKS[item.type]}
                    className="mt-3 inline-flex items-center gap-1 rounded text-xs font-semibold text-admin-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60"
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

export function RecentActivityPanel({
  activities,
}: {
  activities: AdminDashboardActivityDTO[];
}) {
  return (
    <section className={CARD_CLASS}>
      <h2 className="text-base font-bold text-admin-text">Recent activity</h2>
      <p className="mt-1 text-xs text-admin-muted">
        The latest activity across the platform.
      </p>

      {activities.length === 0 ? (
        <EmptyState
          title="No recent activity"
          description="New platform activity will appear here."
        />
      ) : (
        <div className="mt-5 divide-y divide-admin-border">
          {activities.map((activity, index) => {
            const { icon: Icon, tileClassName, iconClassName } =
              ACTIVITY_META[activity.type];

            return (
              <div
                key={`${activity.type}-${activity.createdAt}-${index}`}
                className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tileClassName}`}
                >
                  <Icon className={`h-4 w-4 ${iconClassName}`} />
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