import type { NutritionistPlanActivityDetailsDTO } from "@/dtos/nutritionist/plan-day/nutritionist-plan-day-details.dto";

import { PlanDayActivityCard } from "./PlanDayActivityCard";

interface PlanDayActivityListProps {
  activities: NutritionistPlanActivityDetailsDTO[];
}

export function PlanDayActivityList({
  activities,
}: PlanDayActivityListProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-slate-900">
          Activities
        </h2>

        <p className="text-sm text-slate-500">
          {activities.length}{" "}
          {activities.length === 1 ? "activity" : "activities"} in this day
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
          <p className="text-sm font-semibold text-slate-700">
            No activities available
          </p>
          <p className="mt-1 text-sm text-slate-500">
            This plan day does not contain any activities.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <PlanDayActivityCard
              key={activity.id}
              activity={activity}
            />
          ))}
        </div>
      )}
    </section>
  );
}