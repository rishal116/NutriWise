
import { ClipboardList, Plus } from "lucide-react";

interface PlanDayEmptyActivitiesProps {
  disabled: boolean;
  onAdd: () => void;
}

export default function PlanDayEmptyActivities({
  disabled,
  onAdd,
}: PlanDayEmptyActivitiesProps) {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-300 px-5 py-10 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <ClipboardList size={22} />
      </div>

      <h3 className="text-sm font-semibold text-slate-800">
        No activities added
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        Start building this day by adding your first activity.
      </p>

      <button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50"
      >
        <Plus size={14} />
        Add first activity
      </button>
    </div>
  );
}
