import { ArrowLeft } from "lucide-react";

interface ProgramDayNotFoundProps {
  onBack: () => void;
}

export function ProgramDayNotFound({
  onBack,
}: ProgramDayNotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white py-16 text-center shadow-sm">
      <p className="text-sm font-bold text-slate-700">
        Day not found
      </p>

      <p className="text-xs font-medium text-slate-400">
        This day may have been removed or the link is incorrect.
      </p>

      <button
        type="button"
        onClick={onBack}
        className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-800"
      >
        <ArrowLeft size={13} />
        Back to days
      </button>
    </div>
  );
}