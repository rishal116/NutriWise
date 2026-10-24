"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarCheck,
  ClipboardList,
} from "lucide-react";

import { userProgramDayService } from "@/services/user/user-program-day.service";
import type { UserProgramDayListDTO } from "@/dtos/user/program/user-program-day-list.dto";
import { UserProgramDaySort } from "@/dtos/user/program/user-program-day-list-query.dto";

interface ProgramDaysPreviewProps {
  programId: string;
}

export default function ProgramDaysPreview({
  programId,
}: ProgramDaysPreviewProps) {
  const { data, isPending, isError } = useQuery({
    queryKey: ["user-program-days-preview", programId],
    enabled: Boolean(programId),
    queryFn: async () => {
      const response = await userProgramDayService.browseProgramDays(
        programId,
        {
          limit: 3,
          sort: UserProgramDaySort.DAY_ASC,
        },
      );

      return response.data;
    },
  });

  const days: UserProgramDayListDTO[] = data?.items ?? [];

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <CalendarCheck className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              Program Days
            </h2>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Continue working through your daily activities.
            </p>
          </div>
        </div>

        <Link
          href={`/user/programs/${programId}/days`}
          className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
        >
          View All Days
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {isPending ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
      ) : isError ? (
        <p className="mt-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
          Unable to load the program day preview. Open all days to try again.
        </p>
      ) : days.length === 0 ? (
        <div className="mt-5 flex flex-col items-center rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">
          <ClipboardList className="h-7 w-7 text-slate-400" />
          <p className="mt-2 text-sm font-semibold text-slate-700">
            No program days available
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Program days will appear here when available.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {days.map((day) => {
            const percentage = Number.isFinite(day.completionPercentage)
              ? Math.round(
                  Math.min(100, Math.max(0, day.completionPercentage)),
                )
              : 0;

            return (
              <Link
                key={day._id}
                href={
                  day.isLocked
                    ? `/user/programs/${programId}/days`
                    : `/user/programs/${programId}/days/${day.dayNumber}`
                }
                aria-disabled={day.isLocked}
                onClick={(event) => {
                  if (day.isLocked) {
                    event.preventDefault();
                  }
                }}
                className={`rounded-xl border border-slate-200 p-4 transition-colors ${
                  day.isLocked
                    ? "cursor-not-allowed bg-slate-50 opacity-70"
                    : "hover:border-emerald-300 hover:bg-emerald-50/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    Day {day.dayNumber}
                  </span>

                  <span className="text-xs font-semibold text-emerald-700">
                    {day.isLocked ? "Locked" : `${percentage}%`}
                  </span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{
                      width: `${day.isLocked ? 0 : percentage}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  {day.isLocked
                    ? "Complete previous requirements to unlock."
                    : `${day.completedActivities}/${day.totalActivities} activities completed`}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}