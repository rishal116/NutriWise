
"use client";

interface ChallengeFormActionsProps {
  mode: "create" | "edit";
  loading: boolean;
  onCancel: () => void;
}

export default function ChallengeFormActions({
  mode,
  loading,
  onCancel,
}: ChallengeFormActionsProps) {
  return (
    <div className="sticky bottom-0 z-10 -mx-1 flex items-center justify-end gap-3 border-t border-slate-100 bg-white/95 px-1 py-4 backdrop-blur-sm sm:px-0">
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : mode === "create"
            ? "Create Challenge"
            : "Update Challenge"}
      </button>
    </div>
  );
}
