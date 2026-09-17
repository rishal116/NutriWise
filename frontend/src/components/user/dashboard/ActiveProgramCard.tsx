import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  UserRound,
} from "lucide-react";

import type { UserDashboardActiveProgramDTO } from "@/dtos/user/dashboard/user-dashboard-overview.dto";

import ProgressRing from "./ProgressRing";

interface ActiveProgramCardProps {
  program: UserDashboardActiveProgramDTO;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getProgressLabel(percentage: number): string {
  if (percentage >= 100) return "Completed";
  if (percentage >= 75) return "Almost there";
  if (percentage >= 40) return "Good progress";
  return "Getting started";
}

export default function ActiveProgramCard({ program }: ActiveProgramCardProps) {
  const progress = Math.min(100, Math.max(0, program.completionPercentage));
  const currentDay = Math.min(
    Math.max(program.currentDay, 0),
    program.durationDays,
  );

  const progressLabel = getProgressLabel(progress);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Active coaching
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
              Your current program
            </h2>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {progressLabel}
          </span>
        </div>
      </div>

      <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
        <div className="flex justify-center lg:justify-start">
          <ProgressRing percentage={progress} />
        </div>

        <div className="min-w-0">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {program.title}
            </h3>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="h-4 w-4 text-emerald-600" />
                {program.nutritionist.fullName}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-emerald-600" />
                {program.durationDays} days
              </span>
            </div>
          </div>

          <div className="mt-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Current day
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  Day {currentDay}{" "}
                  <span className="font-medium text-slate-400">
                    / {program.durationDays}
                  </span>
                </p>
              </div>

              <p className="text-sm font-semibold text-emerald-600">
                {progress}%
              </p>
            </div>

            <div
              className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"
              aria-label={`Program progress: ${progress}%`}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-3.5">
              <p className="text-xs font-medium text-slate-400">Started</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {formatDate(program.startDate)}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5">
              <p className="text-xs font-medium text-slate-400">Ends</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {formatDate(program.endDate)}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href={`/user/programs/${program.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Continue program
              <ArrowRight className="h-4 w-4" />
            </Link>

            <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Keep your momentum going
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
