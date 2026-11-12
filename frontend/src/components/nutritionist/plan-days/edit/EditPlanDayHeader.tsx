import { ArrowLeft, CalendarDays, Pencil } from "lucide-react";

interface EditPlanDayHeaderProps {
  dayNumber: number;
  onBack: () => void;
}

export function EditPlanDayHeader({
  dayNumber,
  onBack,
}: EditPlanDayHeaderProps) {
  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-emerald-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to day details
      </button>

      <div className="flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-600">
            <Pencil className="h-4 w-4" />

            <span className="text-xs font-bold uppercase tracking-[0.16em]">
              Edit nutritionist plan
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Edit Day {dayNumber}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update the day information and its activities.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          <CalendarDays className="h-5 w-5" />
          Day {dayNumber}
        </div>
      </div>
    </div>
  );
}