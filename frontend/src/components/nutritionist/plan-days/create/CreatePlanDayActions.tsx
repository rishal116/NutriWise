
import { LoaderCircle } from "lucide-react";

interface CreatePlanDayActionsProps {
  submitting: boolean;
  onCancel: () => void;
}

export default function CreatePlanDayActions({
  submitting,
  onCancel,
}: CreatePlanDayActionsProps) {
  return (
    <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
      <button
        type="button"
        onClick={onCancel}
        disabled={submitting}
        className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting && <LoaderCircle size={16} className="animate-spin" />}
        {submitting ? "Creating..." : "Create plan day"}
      </button>
    </div>
  );
}
