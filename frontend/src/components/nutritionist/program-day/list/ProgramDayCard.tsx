import { ListChecks } from "lucide-react";

import type { NutriProgramDayCardResponseDTO } from "@/dtos/nutritionist/program-day/nutri-program-day-card-response.dto";

interface ProgramDayCardProps {
  day: NutriProgramDayCardResponseDTO;
  onClick: (dayId: string) => void;
}

export function ProgramDayCard({
  day,
  onClick,
}: ProgramDayCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(day.userProgramDayId)}
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50/30"
    >
      <span className="text-sm font-bold text-slate-900">
        Day {day.dayNumber}
      </span>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-semibold text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <ListChecks size={14} className="text-slate-400" />

          {day.totalActivityCount}{" "}
          {day.totalActivityCount === 1 ? "activity" : "activities"}
        </span>

        <span className="text-emerald-600">
          {day.totalRequiredActivityCount} required
        </span>
      </div>
    </button>
  );
}