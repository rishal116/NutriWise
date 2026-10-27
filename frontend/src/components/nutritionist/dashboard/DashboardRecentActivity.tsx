import {
  ArrowUpRight,
  BookOpen,
  CalendarCheck,
  CalendarX,
  CheckCircle2,
  FileText,
  ShoppingBag,
  Star,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import type {
  NutriDashboardActivityType,
  NutriDashboardRecentActivityItemDTO,
} from "@/dtos/nutritionist/dashboard/nutri-dashboard-recent-activities.dto";

interface DashboardRecentActivityProps {
  activities: NutriDashboardRecentActivityItemDTO[];
}

const ACTIVITY_CONFIG: Record<
  NutriDashboardActivityType,
  { icon: LucideIcon; className: string }
> = {
  plan_purchase: {
    icon: ShoppingBag,
    className: "bg-amber-50 text-amber-600",
  },
  program_joined: {
    icon: UserPlus,
    className: "bg-emerald-50 text-emerald-600",
  },
  program_completed: {
    icon: CheckCircle2,
    className: "bg-violet-50 text-violet-600",
  },
  meeting_booked: {
    icon: CalendarCheck,
    className: "bg-blue-50 text-blue-600",
  },
  meeting_cancelled: {
    icon: CalendarX,
    className: "bg-rose-50 text-rose-600",
  },
  session_scheduled: {
    icon: CalendarCheck,
    className: "bg-cyan-50 text-cyan-600",
  },
  session_completed: {
    icon: CheckCircle2,
    className: "bg-violet-50 text-violet-600",
  },
  review_received: {
    icon: Star,
    className: "bg-amber-50 text-amber-600",
  },
  plan_published: {
    icon: BookOpen,
    className: "bg-indigo-50 text-indigo-600",
  },
  resource_published: {
    icon: FileText,
    className: "bg-emerald-50 text-emerald-600",
  },
};

function formatActivityTime(dateString: string): string {
  const date = new Date(dateString);
  const timestamp = date.getTime();

  if (Number.isNaN(timestamp)) {
    return "Recently";
  }

  const difference = Date.now() - timestamp;

  if (difference < 0) {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (difference < minute) {
    return "Just now";
  }

  if (difference < hour) {
    return `${Math.floor(difference / minute)}m ago`;
  }

  if (difference < day) {
    return `${Math.floor(difference / hour)}h ago`;
  }

  if (difference < 7 * day) {
    return `${Math.floor(difference / day)}d ago`;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export default function DashboardRecentActivity({
  activities,
}: DashboardRecentActivityProps) {
  const visibleActivities = activities.slice(0, 6);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Recent activity
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Latest activity across your practice
          </p>
        </div>

        <Link
          href="/nutritionist"
          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Overview
          <ArrowUpRight size={13} />
        </Link>
      </div>

      {visibleActivities.length === 0 ? (
        <div className="mt-7 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
          <p className="text-sm font-semibold text-slate-700">
            No recent activity
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            New purchases, program updates, meetings, reviews, and published
            content will appear here.
          </p>
        </div>
      ) : (
        <ul className="mt-5 divide-y divide-slate-100">
          {visibleActivities.map((activity) => {
            const config = ACTIVITY_CONFIG[activity.type];
            const Icon = config.icon;

            return (
              <li
                key={activity.id}
                className="flex items-center gap-3 py-3.5 first:pt-1"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.className}`}
                >
                  <Icon size={16} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {activity.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {activity.description}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {formatActivityTime(activity.createdAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
