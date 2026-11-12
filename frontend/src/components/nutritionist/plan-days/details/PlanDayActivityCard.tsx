import {
  Clock3,
  Droplets,
  FileText,
  Hash,
  ListOrdered,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";

import type { NutritionistPlanActivityDetailsDTO } from "@/dtos/nutritionist/plan-day/nutritionist-plan-day-details.dto";

import {
  CATEGORY_LABELS,
  VALUE_TYPE_LABELS,
} from "@/constants/nutritionist/plan-day/plan-day-form.constants";

interface PlanDayActivityCardProps {
  activity: NutritionistPlanActivityDetailsDTO;
}

export function PlanDayActivityCard({
  activity,
}: PlanDayActivityCardProps) {
  const categoryLabel = CATEGORY_LABELS[activity.category];
  const valueTypeLabel = VALUE_TYPE_LABELS[activity.valueType];

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {categoryLabel}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                activity.isRequired
                  ? "bg-amber-50 text-amber-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {activity.isRequired ? "Required" : "Optional"}
            </span>
          </div>

          <h3 className="break-words text-base font-bold text-slate-900">
            {activity.title}
          </h3>

          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {activity.description?.trim() || "No description provided."}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-start rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
          <ListOrdered className="h-4 w-4 text-emerald-600" />
          Order {activity.order + 1}
        </div>
      </div>

      <div className="space-y-5 p-5">
        {activity.instructions?.trim() && (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <MessageSquareText className="h-4 w-4 text-emerald-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Instructions
              </h4>
            </div>

            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {activity.instructions}
            </p>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem
            icon={<FileText className="h-4 w-4" />}
            label="Response type"
            value={valueTypeLabel}
          />

          {activity.targetValue !== undefined && (
            <DetailItem
              icon={<Hash className="h-4 w-4" />}
              label="Target"
              value={`${activity.targetValue}${activity.unit ? ` ${activity.unit}` : ""}`}
            />
          )}

          {activity.estimatedDurationMinutes !== undefined && (
            <DetailItem
              icon={<Clock3 className="h-4 w-4" />}
              label="Estimated duration"
              value={`${activity.estimatedDurationMinutes} minutes`}
            />
          )}

          {activity.scheduledTime && (
            <DetailItem
              icon={<Clock3 className="h-4 w-4" />}
              label="Scheduled time"
              value={activity.scheduledTime}
            />
          )}

          {activity.unit && activity.targetValue === undefined && (
            <DetailItem
              icon={<Droplets className="h-4 w-4" />}
              label="Unit"
              value={activity.unit}
            />
          )}

          <DetailItem
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Requirement"
            value={activity.isRequired ? "Must complete" : "Optional"}
          />
        </div>
      </div>
    </article>
  );
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailItem({ icon, label, value }: DetailItemProps) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl bg-slate-50 p-3">
      <span className="mt-0.5 shrink-0 text-emerald-600">{icon}</span>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}