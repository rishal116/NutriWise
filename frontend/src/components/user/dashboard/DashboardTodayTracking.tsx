"use client";

import { CheckCircle2 } from "lucide-react";
import type { UserDashboardTodayTrackingDTO } from "@/dtos/user/dashboard/user-dashboard-today-tracking.dto";
import { DashboardPanel, EmptyState } from "./DashboardShared";

export default function DashboardTodayTracking({
  tracking,
}: {
  tracking: UserDashboardTodayTrackingDTO;
}) {
  const totalActivities = tracking.reduce(
    (total, item) => total + item.totalActivities,
    0,
  );
  const completedActivities = tracking.reduce(
    (total, item) => total + item.completedActivities,
    0,
  );
  const percentage =
    totalActivities > 0
      ? Math.round((completedActivities / totalActivities) * 100)
      : 0;

  return (
    <DashboardPanel>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Today&apos;s tracking
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Your scheduled program activities for today.
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <CheckCircle2 className="h-5 w-5" />
        </div>
      </div>

      {tracking.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            title="Nothing to track today"
            description="Your daily program activities will appear here when available."
          />
        </div>
      ) : (
        <>
          <div className="mt-6 flex items-end justify-between gap-3">
            <div>
              <p className="text-3xl font-bold text-slate-900">{percentage}%</p>
              <p className="mt-1 text-xs text-slate-500">
                Activities completed
              </p>
            </div>
            <p className="text-right text-sm text-slate-600">
              {completedActivities} of {totalActivities}
            </p>
          </div>

          <div
            className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-label="Today's activity completion"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percentage}
          >
            <div
              className="h-full rounded-full bg-emerald-600 transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="mt-5 space-y-3">
            {tracking.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">
                    Program day {item.dayNumber}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.completedActivities} of {item.totalActivities}{" "}
                    activities
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                  {item.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardPanel>
  );
}