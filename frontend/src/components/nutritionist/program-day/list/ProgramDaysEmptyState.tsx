export function ProgramDaysEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white py-16 text-center shadow-sm">
      <p className="text-sm font-bold text-slate-700">
        No days added yet
      </p>

      <p className="text-xs text-slate-400">
        Start building this program by adding its first day.
      </p>
    </div>
  );
}