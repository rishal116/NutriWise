"use client";

import { Activity } from "lucide-react";
import type { UserDashboardWeeklyProgressDTO } from "@/dtos/user/dashboard/user-dashboard-weekly-progress.dto";
import { DashboardPanel, EmptyState, formatDashboardDate } from "./DashboardShared";

export default function DashboardWeeklyProgress({
  progress,
}: {
  progress: UserDashboardWeeklyProgressDTO | null;
}) {
  const days = progress?.dailyProgress ?? [];
  const maximum = Math.max(1, ...days.map((day) => day.totalActivities));

  return (
    <DashboardPanel>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Weekly progress</h2>
          <p className="mt-1 text-sm text-slate-500">
            Your activity completion this week.
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
          <Activity className="h-5 w-5" />
        </div>
      </div>

      {!progress || days.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            title="No weekly activity yet"
            description="Your progress will appear here as you record activities throughout the week."
          />
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">
                Completed days
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {progress.completedDays}
                <span className="text-sm font-medium text-slate-400">
                  {" "}
                  / {progress.totalTrackedDays}
                </span>
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">
                Activities completed
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {progress.completedActivities}
                <span className="text-sm font-medium text-slate-400">
                  {" "}
                  / {progress.totalActivities}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-6 flex h-36 items-end justify-around gap-2 border-b border-slate-100 pb-2">
            {days.map((day) => {
              const totalHeight =
                day.totalActivities > 0
                  ? (day.totalActivities / maximum) * 100
                  : 0;
              const completedHeight =
                day.totalActivities > 0
                  ? (day.completedActivities / maximum) * 100
                  : 0;

              return (
                <div
                  key={day.date}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                  title={`${formatDashboardDate(day.date)}: ${day.completedActivities}/${day.totalActivities} completed`}
                >
                  <div className="flex h-full w-full max-w-8 items-end overflow-hidden rounded-t-md bg-transparent">
                    <div
                      className="flex w-full items-end overflow-hidden rounded-t-md bg-slate-100"
                      style={{ height: `${Math.max(totalHeight, 2)}%` }}
                    >
                      <div
                        className="w-full rounded-t-md bg-emerald-600"
                        style={{ height: `${totalHeight > 0 ? (completedHeight / totalHeight) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 sm:text-xs">
                    {new Intl.DateTimeFormat("en-IN", {
                      weekday: "short",
                    }).format(new Date(day.date))}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-600" />
              Completed activities
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm bg-slate-200" />
              Total activities
            </span>
          </div>
        </>
      )}
    </DashboardPanel>
  );
}