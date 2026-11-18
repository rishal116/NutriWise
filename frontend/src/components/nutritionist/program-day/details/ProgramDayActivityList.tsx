import type { NutriProgramDayResponseDTO } from "@/dtos/nutritionist/program-day/nutri-program-day-response.dto";

import { ProgramDayActivityCard } from "./ProgramDayActivityCard";

interface ProgramDayActivityListProps {
  activities: NutriProgramDayResponseDTO["activities"];
}

export function ProgramDayActivityList({
  activities,
}: ProgramDayActivityListProps) {
  const sortedActivities = [...activities].sort(
    (first, second) => first.order - second.order,
  );

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <h2 className="text-base font-bold tracking-tight text-slate-900">
        Activities ({activities.length})
      </h2>

      {sortedActivities.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center">
          <p className="text-xs font-medium text-slate-400">
            No activities for this day.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedActivities.map((activity) => (
            <ProgramDayActivityCard
              key={activity._id}
              activity={activity}
            />
          ))}
        </div>
      )}
    </section>
  );
}