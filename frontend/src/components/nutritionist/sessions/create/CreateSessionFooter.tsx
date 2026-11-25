
import { Loader2 } from "lucide-react";

interface CreateSessionFooterProps {
  submitting: boolean;
  onCancel: () => void;
}

export function CreateSessionFooter({
  submitting,
  onCancel,
}: CreateSessionFooterProps) {
  return (
    <footer className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onCancel}
        disabled={submitting}
        className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}

        {submitting ? "Creating session..." : "Create session"}
      </button>
    </footer>
  );
}
