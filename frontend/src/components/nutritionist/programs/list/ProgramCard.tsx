import Link from "next/link";

import type { NutriProgramCardResponseDTO } from "@/dtos/nutritionist/program/nutri-program-card-response.dto";

import { ProgramAvatar } from "@/components/nutritionist/programs/list/ProgramAvatar";
import { ProgramStatusBadge } from "@/components/nutritionist/programs/list/StatusBadges";
import { ProgramProgress } from "@/components/nutritionist/programs/list/ProgramProgress";

interface ProgramCardProps {
  program: NutriProgramCardResponseDTO;
}

const formatDate = (value: string | null): string => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export function ProgramCard({ program }: ProgramCardProps) {
  return (
    <Link
      href={`/nutritionist/programs/${program.userProgramId}`}
      className="group flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-300 hover:border-emerald-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
    >
      <div className="flex items-start gap-3">
        <ProgramAvatar
          userProfileImage={program.userProfileImage}
          userFullName={program.userFullName}
        />

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold text-slate-900">
            {program.userFullName}
          </div>

          <div className="truncate text-xs font-medium text-slate-400">
            {program.specialization}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <ProgramStatusBadge status={program.programStatus} />
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 px-3.5 py-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Plan
        </div>

        <div className="mt-0.5 line-clamp-2 text-sm font-bold text-slate-800">
          {program.planTitle}
        </div>
      </div>

      <div className="mt-4">
        <ProgramProgress
          currentDay={program.currentDay}
          durationDays={program.durationDays}
          completionPercentage={program.completionPercentage}
        />
      </div>

      <div className="mt-auto mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Start
          </div>

          <div className="text-xs font-medium text-slate-600">
            {formatDate(program.startDate)}
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            End
          </div>

          <div className="text-xs font-medium text-slate-600">
            {formatDate(program.endDate)}
          </div>
        </div>
      </div>
    </Link>
  );
}