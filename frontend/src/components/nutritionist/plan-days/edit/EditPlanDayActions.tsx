import { Loader2, Save, X } from "lucide-react";

interface EditPlanDayActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  disabled?: boolean;
}

export function EditPlanDayActions({
  onCancel,
  isSubmitting,
  disabled = false,
}: EditPlanDayActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <X className="h-4 w-4" />
        Cancel
      </button>

      <button
        type="submit"
        disabled={disabled || isSubmitting}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}

        {isSubmitting ? "Saving changes..." : "Save changes"}
      </button>
    </div>
  );
}
