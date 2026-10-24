import { Camera, X } from "lucide-react";
import type { UserProgramDayActivityResponseDTO } from "@/dtos/user/program/user-program-day-details.dto";

export interface ActivityValueInputProps {
  activity: UserProgramDayActivityResponseDTO;
  numberDraft: number | undefined;
  onNumberChange: (value: number | undefined) => void;
  durationDraft: number | undefined;
  onDurationChange: (value: number | undefined) => void;
  textDraft: string;
  onTextChange: (value: string) => void;
  evidenceDraft: string[];
  onOpenUploader: () => void;
  onRemoveEvidence: (url: string) => void;
}

export default function ActivityValueInput({
  activity,
  numberDraft,
  onNumberChange,
  durationDraft,
  onDurationChange,
  textDraft,
  onTextChange,
  evidenceDraft,
  onOpenUploader,
  onRemoveEvidence,
}: ActivityValueInputProps) {
  switch (activity.valueType) {
    case "boolean":
      return (
        <p className="text-xs font-medium text-slate-500">
          {" Mark this activity complete when you're done."}
        </p>
      );

    case "number":
      return (
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Recorded value {activity.unit ? `(${activity.unit})` : ""}
          </label>
          <input
            type="number"
            value={numberDraft ?? ""}
            onChange={(event) =>
              onNumberChange(
                event.target.value === ""
                  ? undefined
                  : Number(event.target.value),
              )
            }
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder={
              activity.targetValue !== undefined
                ? `Target: ${activity.targetValue}`
                : "Enter value"
            }
          />
        </div>
      );

    case "duration":
      return (
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={durationDraft ?? ""}
            onChange={(event) =>
              onDurationChange(
                event.target.value === ""
                  ? undefined
                  : Number(event.target.value),
              )
            }
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder={
              activity.estimatedDurationMinutes !== undefined
                ? `Est: ${activity.estimatedDurationMinutes} min`
                : "Enter duration in minutes"
            }
          />
        </div>
      );

    case "text":
      return (
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Your response
          </label>
          <textarea
            value={textDraft}
            onChange={(event) => onTextChange(event.target.value)}
            rows={3}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Type your response..."
          />
        </div>
      );

    case "photo":
      return (
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Evidence photos
          </label>
          <button
            type="button"
            onClick={onOpenUploader}
            className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-xs font-semibold text-slate-500 hover:border-emerald-300 hover:bg-emerald-50/40 hover:text-emerald-700"
          >
            <Camera className="h-4 w-4" />
            Add a photo
          </button>

          {evidenceDraft.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {evidenceDraft.map((url) => (
                <div
                  key={url}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200/80"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt="Activity evidence"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveEvidence(url)}
                    aria-label="Remove evidence"
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}
