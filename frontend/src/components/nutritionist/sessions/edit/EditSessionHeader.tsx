
import { ArrowLeft } from "lucide-react";

interface EditSessionHeaderProps {
  title: string;
  onBack: () => void;
}

export function EditSessionHeader({
  title,
  onBack,
}: EditSessionHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Edit Session
        </p>

        <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title || "Untitled session"}
        </h1>
      </div>
    </div>
  );
}
