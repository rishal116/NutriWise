import { Clock, Target } from "lucide-react";

import type { NutriProgramDayResponseDTO } from "@/dtos/nutritionist/program-day/nutri-program-day-response.dto";

import {
  CATEGORY_LABELS,
  VALUE_TYPE_LABELS,
} from "./program-day-details.utils";

type ProgramDayActivity =
  NutriProgramDayResponseDTO["activities"][number];

interface ProgramDayActivityCardProps {
  activity: ProgramDayActivity;
}

export function ProgramDayActivityCard({
  activity,
}: ProgramDayActivityCardProps) {
  return (
    <article className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
            {CATEGORY_LABELS[activity.category]}
          </span>

          {activity.isRequired && (
            <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Required
            </span>
          )}
        </div>

        <span className="shrink-0 text-[10px] font-semibold text-slate-400">
          {VALUE_TYPE_LABELS[activity.valueType]}
        </span>
      </div>

      <h3 className="mt-2 text-sm font-bold text-slate-800">
        {activity.title}
      </h3>

      {activity.description && (
        <p className="mt-1 whitespace-pre-wrap text-xs font-medium text-slate-500">
          {activity.description}
        </p>
      )}

      {activity.instructions && (
        <p className="mt-1 whitespace-pre-wrap text-xs font-medium italic text-slate-400">
          {activity.instructions}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {activity.targetValue != null && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
            <Target size={12} className="text-slate-400" />
            {activity.targetValue}
            {activity.unit ? ` ${activity.unit}` : ""}
          </span>
        )}

        {activity.estimatedDurationMinutes != null && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
            <Clock size={12} className="text-slate-400" />
            {activity.estimatedDurationMinutes} min
          </span>
        )}

        {activity.scheduledTime && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
            <Clock size={12} className="text-slate-400" />
            {activity.scheduledTime}
          </span>
        )}
      </div>
    </article>
  );
}