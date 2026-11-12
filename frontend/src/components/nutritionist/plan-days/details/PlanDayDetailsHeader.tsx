import { CalendarDays, ListChecks, Pencil } from "lucide-react";

interface PlanDayDetailsHeaderProps {
  dayNumber: number;
  activityCount: number;
  onEdit: () => void;
}

export function PlanDayDetailsHeader({
  dayNumber,
  activityCount,
  onEdit,
}: PlanDayDetailsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
          Nutritionist plan
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Day {dayNumber}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View the information and activities scheduled for this day.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-700">
          <CalendarDays className="h-5 w-5" />
          <span className="text-sm font-semibold">Day {dayNumber}</span>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-slate-700">
          <ListChecks className="h-5 w-5" />
          <span className="text-sm font-semibold">
            {activityCount}{" "}
            {activityCount === 1 ? "activity" : "activities"}
          </span>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <Pencil className="h-4 w-4" />
          Edit Day
        </button>
      </div>
    </div>
  );
}