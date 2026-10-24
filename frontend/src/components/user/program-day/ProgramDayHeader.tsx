import { Lock, MessageSquare } from "lucide-react";
import type { UserProgramDayDetailsResponseDTO } from "@/dtos/user/program/user-program-day-details.dto";
import {
  DAY_STATUS_LABELS,
  DAY_STATUS_STYLES,
} from "./program-day.types";

interface ProgramDayHeaderProps {
  dayNumber: number;
  tracking: UserProgramDayDetailsResponseDTO["tracking"];
}

export default function ProgramDayHeader({
  dayNumber,
  tracking,
}: ProgramDayHeaderProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-6 w-1 rounded-full bg-emerald-600" />
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Day {dayNumber}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {(!tracking || tracking.isLocked) && (
            <span className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
              <Lock className="h-3 w-3" />
              {tracking ? "Locked" : "Tracking unavailable"}
            </span>
          )}
          {tracking && (
            <span
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${DAY_STATUS_STYLES[tracking.status]}`}
            >
              {DAY_STATUS_LABELS[tracking.status]}
            </span>
          )}
        </div>
      </div>

      {tracking && (
        <>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {new Date(tracking.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Activities completed
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {tracking.completedActivities}/{tracking.totalActivities}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Skipped
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {tracking.skippedActivities}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-500">Overall completion</span>
              <span className="font-bold text-emerald-700">
                {tracking.overallCompletionPercentage}%
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, tracking.overallCompletionPercentage),
                  )}%`,
                }}
              />
            </div>
          </div>

          {(tracking.userNotes || tracking.nutritionistNotes) && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {tracking.userNotes && (
                <div className="rounded-xl border border-slate-200/80 p-3.5">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    <MessageSquare className="h-3 w-3" />
                    Your notes
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-slate-700">
                    {tracking.userNotes}
                  </p>
                </div>
              )}
              {tracking.nutritionistNotes && (
                <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-3.5">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-sky-700">
                    <MessageSquare className="h-3 w-3" />
                    Nutritionist notes
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-slate-700">
                    {tracking.nutritionistNotes}
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
