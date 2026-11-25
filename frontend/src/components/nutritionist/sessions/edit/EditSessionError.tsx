
import { ArrowLeft } from "lucide-react";

interface EditSessionErrorProps {
  message: string;
  onBack: () => void;
}

export function EditSessionError({
  message,
  onBack,
}: EditSessionErrorProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-emerald-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div
        role="alert"
        className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm font-medium text-rose-700"
      >
        {message}
      </div>
    </div>
  );
}
