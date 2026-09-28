import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  FileText,
  MessageCircle,
  ShoppingBag,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import type { NutriDashboardActivityDTO } from "@/dtos/nutritionist/dashboard/nutri-dashboard-response.dto";

interface DashboardRecentActivityProps {
  activities: NutriDashboardActivityDTO[];
}

function getActivityIcon(
  type: NutriDashboardActivityDTO["type"],
) {
  switch (type) {
    case "client_joined":
      return UserPlus;

    case "program_started":
      return BookOpen;

    case "program_completed":
      return CheckCircle2;

    case "plan_purchased":
      return ShoppingBag;

    case "group_created":
      return MessageCircle;

    case "resource_published":
      return FileText;
  }
}

function getActivityStyle(
  type: NutriDashboardActivityDTO["type"],
) {
  switch (type) {
    case "client_joined":
      return "bg-emerald-50 text-emerald-600";

    case "program_started":
      return "bg-blue-50 text-blue-600";

    case "program_completed":
      return "bg-violet-50 text-violet-600";

    case "plan_purchased":
      return "bg-amber-50 text-amber-600";

    case "group_created":
      return "bg-cyan-50 text-cyan-600";

    case "resource_published":
      return "bg-rose-50 text-rose-600";
  }
}

function formatActivityTime(dateString: string): string {
  const date = new Date(dateString);
  const now = Date.now();
  const difference = now - date.getTime();

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const minute = 60 * 1000;
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Overview
          <ArrowUpRight size={13} />
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="mt-7 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
          <p className="text-sm font-semibold text-slate-700">
            No recent activity
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            New client, program, purchase, group, and resource activity will
            appear here.
          </p>
        </div>
      ) : (
        <div className="mt-5 divide-y divide-slate-100">
          {activities.slice(0, 6).map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const iconStyle = getActivityStyle(activity.type);

            return (
              <div
                key={`${activity.type}-${activity.createdAt}-${index}`}
                className="flex items-center gap-3 py-3.5 first:pt-1"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}
                >
                  <Icon size={16} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {activity.title}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {formatActivityTime(activity.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}