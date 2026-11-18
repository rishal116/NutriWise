interface ProgramNotFoundProps {
  onBack: () => void;
}

export function ProgramNotFound({
  onBack,
}: ProgramNotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
      <p className="text-sm font-bold text-slate-700">
        Program not found
      </p>

      <p className="text-xs text-slate-400">
        This program may have been removed or the link is incorrect.
      </p>

      <button
        type="button"
        onClick={onBack}
        className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        Back to programs
      </button>
    </div>
  );
}