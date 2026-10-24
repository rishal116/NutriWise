import type { UserProgramDayActivityResponseDTO } from "@/dtos/user/program/user-program-day-details.dto";

interface ReadOnlySummaryProps {
  activity: UserProgramDayActivityResponseDTO;
}

export default function ReadOnlySummary({ activity }: ReadOnlySummaryProps) {
  const { tracking } = activity;

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
        {tracking.recordedValue !== undefined && (
          <span className="font-bold text-emerald-700">
            Recorded: {tracking.recordedValue} {activity.unit ?? ""}
          </span>
        )}
        {tracking.recordedText && (
          <span className="font-bold text-emerald-700">
            Response: {tracking.recordedText}
          </span>
        )}
      </div>

      {tracking.evidence.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tracking.evidence.map((url, index) => (
            <a
              key={`${url}-${index}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-200/80 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Evidence {index + 1}
            </a>
          ))}
        </div>
      )}

      {(tracking.notes || tracking.skippedReason) && (
        <div className="rounded-xl border border-slate-200/80 p-3">
          {tracking.notes && (
            <p className="text-xs font-medium text-slate-600">
              {tracking.notes}
            </p>
          )}
          {tracking.skippedReason && (
            <p className="mt-1 text-xs font-medium text-rose-600">
              Skipped: {tracking.skippedReason}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
