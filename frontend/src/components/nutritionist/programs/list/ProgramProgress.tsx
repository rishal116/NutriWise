interface ProgramProgressProps {
  currentDay: number;
  durationDays: number;
  completionPercentage: number;
}

export function ProgramProgress({
  currentDay,
  durationDays,
  completionPercentage,
}: ProgramProgressProps) {
  const percentage = Math.min(100, Math.max(0, completionPercentage));

  return (
    <div className="w-full">
      <div className="mb-1.5 flex justify-between text-[11px] font-semibold text-slate-500">
        <span>
          Day {currentDay} of {durationDays}
        </span>

        <span>{Math.round(percentage)}%</span>
      </div>

      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-label="Program completion"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percentage)}
      >
        <div
          className="h-full rounded-full bg-emerald-600 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}