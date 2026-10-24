import { Sparkles } from "lucide-react";

import type { UserProgramDetailsDTO } from "@/dtos/user/program/user-program-details.dto";

interface ProgramProgressCardProps {
  program: UserProgramDetailsDTO;
}

export default function ProgramProgressCard({
  program,
}: ProgramProgressCardProps) {
  const rawPercentage = program.completionPercentage;

  const percentage = Number.isFinite(rawPercentage)
    ? Math.round(Math.min(100, Math.max(0, rawPercentage)))
    : 0;

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
      <div className="rounded-xl bg-slate-50 p-5">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" />

            <span className="text-sm font-bold tracking-tight text-slate-900">
              Overall Progress
            </span>
          </div>

          <span className="text-sm font-bold text-emerald-700">
            {percentage}%
          </span>
        </div>

        <div
          className="h-2.5 overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-label="Overall program progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
        >
          <div
            className="h-full rounded-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </section>
  );
}