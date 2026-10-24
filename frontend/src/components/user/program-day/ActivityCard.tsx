import { useState } from "react";
import {
  Check,
  Clock,
  Loader2,
  Lock,
  MessageSquare,
  Pencil,
  Play,
  SkipForward,
  X,
} from "lucide-react";

import EvidenceImageUploader from "@/components/user/tracking/EvidenceImageUploader";
import type { UserProgramDayActivityResponseDTO } from "@/dtos/user/program/user-program-day-details.dto";
import { UserActivityTrackingStatus } from "@/types/user/program/user-program-day.types";

import {
  ACTIVITY_STATUS_LABELS,
  ACTIVITY_STATUS_STYLES,
  CATEGORY_ICONS,
  uploadEvidencePhotoStub,
  type ActivityAction,
} from "./program-day.types";
import ActivityValueInput from "./ActivityValueInput";
import ReadOnlySummary from "./ReadOnlySummary";

export interface ActivityCardProps {
  activity: UserProgramDayActivityResponseDTO;
  isDayLocked: boolean;
  isPending: boolean;
  onAction: (action: ActivityAction) => void;
}

export default function ActivityCard({
  activity,
  isDayLocked,
  isPending,
  onAction,
}: ActivityCardProps) {
  const { tracking } = activity;

  const isCompleted =
    tracking.status === UserActivityTrackingStatus.COMPLETED;
  const isSkipped = tracking.status === UserActivityTrackingStatus.SKIPPED;
  const isTerminal = isCompleted || isSkipped;

  const [forceEdit, setForceEdit] = useState(false);
  const [showSkipInput, setShowSkipInput] = useState(false);
  const [skipReasonDraft, setSkipReasonDraft] = useState(
    tracking.skippedReason ?? "",
  );
  const [numberDraft, setNumberDraft] = useState<number | undefined>(
    tracking.recordedValue ?? activity.targetValue,
  );
  const [durationDraft, setDurationDraft] = useState<number | undefined>(
    activity.estimatedDurationMinutes,
  );
  const [textDraft, setTextDraft] = useState(
    tracking.recordedText ?? tracking.notes ?? "",
  );
  const [evidenceDraft, setEvidenceDraft] = useState<string[]>(
    tracking.evidence ?? [],
  );
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  const isEditable = !isDayLocked && !isCompleted && (!isTerminal || forceEdit);
  const isStarting =
    isPending && tracking.status === UserActivityTrackingStatus.NOT_STARTED;

  const canComplete = (() => {
    switch (activity.valueType) {
      case "boolean":
        return true;
      case "number":
        return numberDraft !== undefined && Number.isFinite(numberDraft);
      case "duration":
        return (
          durationDraft !== undefined &&
          Number.isFinite(durationDraft) &&
          durationDraft >= 0
        );
      case "text":
        return textDraft.trim().length > 0;
      case "photo":
        return evidenceDraft.length > 0;
      default:
        return true;
    }
  })();

  function handleRemoveEvidence(url: string) {
    setEvidenceDraft((previous) => previous.filter((item) => item !== url));
  }

  function handleComplete() {
    if (isCompleted) return;
    onAction({
      type: "complete",
      recordedValue:
        activity.valueType === "number"
          ? numberDraft
          : activity.valueType === "duration"
            ? durationDraft
            : undefined,
      recordedText:
        activity.valueType === "text" ? textDraft.trim() : undefined,
      notes: activity.valueType === "text" ? textDraft.trim() : undefined,
      evidence: activity.valueType === "photo" ? evidenceDraft : undefined,
    });

    setForceEdit(false);
  }

  function handleSkipConfirm() {
    if (isCompleted || activity.isRequired || !skipReasonDraft.trim()) return;
    onAction({ type: "skip", skippedReason: skipReasonDraft.trim() });
    setShowSkipInput(false);
  }

  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-xs transition-colors duration-150 ${
        tracking.status === UserActivityTrackingStatus.COMPLETED
          ? "border-emerald-200/80 bg-emerald-50/30"
          : tracking.status === UserActivityTrackingStatus.SKIPPED
            ? "border-slate-200/80 bg-slate-50/60"
            : "border-slate-200/80 hover:border-emerald-300"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
              tracking.status === UserActivityTrackingStatus.COMPLETED
                ? "bg-emerald-600 text-white"
                : "bg-emerald-100/80 text-emerald-700"
            }`}
          >
            {tracking.status === UserActivityTrackingStatus.COMPLETED ? (
              <Check className="h-4 w-4" />
            ) : (
              CATEGORY_ICONS[activity.category]
            )}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={`text-sm font-bold tracking-tight ${
                  tracking.status === UserActivityTrackingStatus.COMPLETED
                    ? "text-slate-500 line-through decoration-slate-300"
                    : "text-slate-900"
                }`}
              >
                {activity.title}
              </h3>
              {activity.isRequired && (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Required
                </span>
              )}
            </div>
            {activity.description && (
              <p className="mt-1 text-xs font-medium text-slate-500">
                {activity.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${ACTIVITY_STATUS_STYLES[tracking.status]}`}
          >
            {ACTIVITY_STATUS_LABELS[tracking.status]}
          </span>
          {!isCompleted && isSkipped && !isDayLocked && !forceEdit && (
            <button
              type="button"
              onClick={() => setForceEdit(true)}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/80 text-slate-500 hover:border-emerald-300 hover:text-emerald-700"
              aria-label="Edit activity"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {activity.instructions && (
        <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs font-medium text-slate-600">
          {activity.instructions}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
        {activity.scheduledTime && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {activity.scheduledTime}
          </span>
        )}
        {activity.targetValue !== undefined && (
          <span>
            Target: {activity.targetValue} {activity.unit ?? ""}
          </span>
        )}
        {activity.estimatedDurationMinutes !== undefined && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Est. {activity.estimatedDurationMinutes} min
          </span>
        )}
      </div>

      {isDayLocked ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-500">
          <Lock className="h-3.5 w-3.5" />
          This day is locked or tracking is unavailable
        </div>
      ) : isEditable ? (
        <div className="mt-4 space-y-3 rounded-xl border border-slate-200/80 p-4">
          {tracking.status === UserActivityTrackingStatus.NOT_STARTED &&
            !forceEdit && (
              <p className="text-xs font-medium text-slate-500">
                Start this activity to begin tracking, or complete it directly.
              </p>
            )}

          <ActivityValueInput
            activity={activity}
            numberDraft={numberDraft}
            onNumberChange={setNumberDraft}
            durationDraft={durationDraft}
            onDurationChange={setDurationDraft}
            textDraft={textDraft}
            onTextChange={setTextDraft}
            evidenceDraft={evidenceDraft}
            onOpenUploader={() => setIsUploaderOpen(true)}
            onRemoveEvidence={handleRemoveEvidence}
          />

          {showSkipInput && !activity.isRequired ? (
            <div className="rounded-xl bg-rose-50/60 p-3">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-rose-700">
                Reason for skipping
              </label>
              <textarea
                value={skipReasonDraft}
                onChange={(event) => setSkipReasonDraft(event.target.value)}
                rows={2}
                className="mt-1.5 w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                placeholder="e.g. Felt unwell today"
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleSkipConfirm}
                  disabled={isPending || !skipReasonDraft.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                >
                  {isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <SkipForward className="h-3.5 w-3.5" />
                  )}
                  Confirm skip
                </button>
                <button
                  type="button"
                  onClick={() => setShowSkipInput(false)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {tracking.status === UserActivityTrackingStatus.NOT_STARTED && (
                <button
                  type="button"
                  onClick={() => onAction({ type: "start" })}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
                >
                  {isStarting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Play className="h-3.5 w-3.5" />
                  )}
                  Start
                </button>
              )}

              <button
                type="button"
                onClick={handleComplete}
                disabled={isPending || !canComplete}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                {forceEdit ? "Save changes" : "Complete"}
              </button>

              {!activity.isRequired && (
                <button
                  type="button"
                  onClick={() => setShowSkipInput(true)}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                  Skip
                </button>
              )}

              {forceEdit && (
                <button
                  type="button"
                  onClick={() => setForceEdit(false)}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-semibold text-slate-500 hover:bg-slate-50"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <ReadOnlySummary activity={activity} />
      )}

      {tracking.nutritionistFeedback && (
        <div className="mt-3 rounded-xl border border-sky-200 bg-sky-50/50 p-3">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-sky-700">
            <MessageSquare className="h-3 w-3" />
            Nutritionist feedback
          </p>
          <p className="mt-1 text-xs font-medium text-slate-700">
            {tracking.nutritionistFeedback}
          </p>
        </div>
      )}

      {isUploaderOpen && (
        <EvidenceImageUploader
          onClose={() => setIsUploaderOpen(false)}
          onUploadSuccess={(url) => {
            setEvidenceDraft((previous) => [...previous, url]);
            setIsUploaderOpen(false);
          }}
          uploadImage={uploadEvidencePhotoStub}
        />
      )}
    </div>
  );
}
