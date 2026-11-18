import { Pencil } from "lucide-react";

interface ProgramDayHeaderProps {
  dayNumber: number;
  onEdit: () => void;
}

export function ProgramDayHeader({
  dayNumber,
  onEdit,
}: ProgramDayHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Day {dayNumber}
        </h1>

        <p className="mt-1 text-xs font-medium text-slate-500">
          View the activities scheduled for this day.
        </p>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        <Pencil size={14} />
        Edit Day
      </button>
    </div>
  );
}