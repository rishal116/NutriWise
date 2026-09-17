import { CalendarDays, Flag, PlayCircle } from "lucide-react";

import type { UserDashboardActiveProgramDTO } from "@/dtos/user/dashboard/user-dashboard-overview.dto";

interface ProgramProgressProps {
  program: UserDashboardActiveProgramDTO;
}

export default function ProgramProgress({ program }: ProgramProgressProps) {
  const currentDay = Math.min(
    Math.max(program.currentDay, 0),
    program.durationDays,
  );

  const remainingDays = Math.max(program.durationDays - currentDay, 0);

  const dayProgress =
    program.durationDays > 0
      ? Math.min(100, (currentDay / program.durationDays) * 100)
      : 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Journey
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Program timeline
          </h2>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <CalendarDays className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-7">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-700">Day {currentDay}</span>

          <span className="font-medium text-slate-400">
            {program.durationDays} days
          </span>
        </div>

        <div
          className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={program.durationDays}
          aria-valuenow={currentDay}
          aria-label={`Day ${currentDay} of ${program.durationDays}`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"
            style={{ width: `${dayProgress}%` }}
          />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-medium text-slate-400">
                Current
              </span>
            </div>

            <p className="mt-2 text-sm font-bold text-slate-800">
              Day {currentDay}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-medium text-slate-400">
                Remaining
              </span>
            </div>

            <p className="mt-2 text-sm font-bold text-slate-800">
              {remainingDays} {remainingDays === 1 ? "day" : "days"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-medium text-slate-400">
                Completion
              </span>
            </div>

            <p className="mt-2 text-sm font-bold text-slate-800">
              {Math.round(dayProgress)}%
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
