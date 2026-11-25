
"use client";

import { Loader2 } from "lucide-react";

interface EditSessionFooterProps {
  submitting: boolean;
  submitError: string | null;
  onCancel: () => void;
}

export function EditSessionFooter({
  submitting,
  submitError,
  onCancel,
}: EditSessionFooterProps) {
  return (
    <div className="space-y-4 pt-6">
      {submitError && (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
        >
          {submitError}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}

          {submitting ? "Saving changes..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
