import { ListChecks } from "lucide-react";

import type { NutritionistPlanDayListItemDTO } from "@/dtos/nutritionist/plan-day/nutritionist-plan-day-list-item.dto";

interface PlanDayCardProps {
  day: NutritionistPlanDayListItemDTO;
  onClick: (dayNumber: number) => void;
}

export default function PlanDayCard({ day, onClick }: PlanDayCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(day.dayNumber)}
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50/30"
    >
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900">Day {day.dayNumber}</p>

        {day.title && (
          <p className="mt-1 truncate text-xs font-semibold text-slate-600">
            {day.title}
          </p>
        )}

        {day.description && (
          <p className="mt-1 line-clamp-2 text-xs text-slate-400">
            {day.description}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
        <div className="flex items-center gap-1.5">
          <ListChecks size={14} className="text-slate-400" />

          <span>
            {day.totalActivities}{" "}
            {day.totalActivities === 1 ? "activity" : "activities"}
          </span>
        </div>

        <span className="text-emerald-600">
          {day.requiredActivities} required
        </span>
      </div>
    </button>
  );
}
