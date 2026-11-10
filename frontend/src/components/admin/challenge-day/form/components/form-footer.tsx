"use client";

import { Loader2 } from "lucide-react";

interface FormFooterProps {
  saving: boolean;
  mode: "create" | "edit";
  activityCount: number;
  onCancel: () => void;
}

export default function FormFooter({
  saving,
  mode,
  activityCount,
  onCancel,
}: FormFooterProps) {
  return (
    <div className="sticky bottom-4 z-20 rounded-2xl border border-admin-border bg-admin-surface p-3 shadow-lg shadow-admin-text/10">
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="hidden text-xs font-medium text-admin-muted sm:block">
          {activityCount}{" "}
          {activityCount === 1 ? "activity" : "activities"} configured
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-xl border border-admin-border bg-admin-surface px-5 py-2.5 text-sm font-semibold text-admin-text transition-colors hover:bg-admin-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-admin-accent px-5 py-2.5 text-sm font-semibold text-admin-accent-fg shadow-sm transition-colors hover:bg-admin-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}

            {saving
              ? "Saving..."
              : mode === "create"
                ? "Create Day"
                : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}