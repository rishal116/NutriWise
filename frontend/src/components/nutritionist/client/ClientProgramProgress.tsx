import type { ClientProgramSummaryDTO } from "@/dtos/nutritionist/client/client-response.dto";

interface ClientProgramProgressProps {
  program: Pick<
    ClientProgramSummaryDTO,
    "currentDay" | "durationDays" | "completionPercentage"
  >;
}

export default function ClientProgramProgress({
  program,
}: ClientProgramProgressProps) {
  const percentage = Number.isFinite(program.completionPercentage)
    ? Math.min(100, Math.max(0, program.completionPercentage))
    : 0;

  const durationDays = Math.max(0, program.durationDays);
  const currentDay = Math.min(
    durationDays,
    Math.max(0, program.currentDay),
  );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
        <span className="font-medium text-slate-500">
          Day {currentDay} of {durationDays}
        </span>
        <span className="font-bold tabular-nums text-slate-800">
          {Math.round(percentage)}%
        </span>
      </div>

      <div
        className="h-2 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-label="Program completion"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percentage)}
      >
        <div
          className="h-full rounded-full bg-emerald-600 transition-[width] duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}