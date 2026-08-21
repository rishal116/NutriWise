"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Brain,
  CalendarClock,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Droplet,
  Dumbbell,
  ListChecks,
  Loader2,
  Lock,
  MessageSquare,
  Moon,
  Pencil,
  Pill,
  Play,
  Ruler,
  SkipForward,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";

import { userProgramDayService } from "@/services/user/userProgramDay.service";
import { userActivityTrackingService } from "@/services/user/userActivityTracking.service";
import type {
  UserProgramDayActivityResponseDTO,
  UserProgramDayDetailsResponseDTO,
} from "@/dtos/user/program/user-program-day-details.dto";
import type { UpdateActivityTrackingDTO } from "@/dtos/user/tracking/update-activity-tracking.dto";
import {
  ProgramActivityCategory,
  UserActivityTrackingStatus,
  UserDayTrackingStatus,
} from "@/types/user/program/user-program-day.types";

import EvidenceImageUploader from "@/components/user/tracking/EvidenceImageUploader";

interface ProgramDayDetailsPageProps {
  params: Promise<{
    programId: string;
    dayNumber: string;
  }>;
}

/* -------------------------------------------------------------------------- */
/* Status maps                                                                */
/* -------------------------------------------------------------------------- */

const DAY_STATUS_STYLES: Record<UserDayTrackingStatus, string> = {
  [UserDayTrackingStatus.NOT_STARTED]:
    "bg-slate-100 text-slate-700 border-slate-200",
  [UserDayTrackingStatus.IN_PROGRESS]:
    "bg-amber-50 text-amber-700 border-amber-200",
  [UserDayTrackingStatus.COMPLETED]:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  [UserDayTrackingStatus.MISSED]: "bg-rose-50 text-rose-700 border-rose-200",
  [UserDayTrackingStatus.SKIPPED]:
    "bg-slate-100 text-slate-500 border-slate-200",
};

const DAY_STATUS_LABELS: Record<UserDayTrackingStatus, string> = {
  [UserDayTrackingStatus.NOT_STARTED]: "Not started",
  [UserDayTrackingStatus.IN_PROGRESS]: "In progress",
  [UserDayTrackingStatus.COMPLETED]: "Completed",
  [UserDayTrackingStatus.MISSED]: "Missed",
  [UserDayTrackingStatus.SKIPPED]: "Skipped",
};

const ACTIVITY_STATUS_STYLES: Record<UserActivityTrackingStatus, string> = {
  [UserActivityTrackingStatus.NOT_STARTED]:
    "bg-slate-100 text-slate-700 border-slate-200",
  [UserActivityTrackingStatus.IN_PROGRESS]:
    "bg-amber-50 text-amber-700 border-amber-200",
  [UserActivityTrackingStatus.COMPLETED]:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  [UserActivityTrackingStatus.SKIPPED]:
    "bg-slate-100 text-slate-500 border-slate-200",
};

const ACTIVITY_STATUS_LABELS: Record<UserActivityTrackingStatus, string> = {
  [UserActivityTrackingStatus.NOT_STARTED]: "Not started",
  [UserActivityTrackingStatus.IN_PROGRESS]: "In progress",
  [UserActivityTrackingStatus.COMPLETED]: "Completed",
  [UserActivityTrackingStatus.SKIPPED]: "Skipped",
};

const CATEGORY_ICONS: Record<ProgramActivityCategory, ReactNode> = {
  meal: <Utensils className="h-4 w-4" />,
  exercise: <Dumbbell className="h-4 w-4" />,
  habit: <CheckCircle2 className="h-4 w-4" />,
  water: <Droplet className="h-4 w-4" />,
  supplement: <Pill className="h-4 w-4" />,
  meditation: <Brain className="h-4 w-4" />,
  sleep: <Moon className="h-4 w-4" />,
  reading: <BookOpen className="h-4 w-4" />,
  appointment: <CalendarClock className="h-4 w-4" />,
  measurement: <Ruler className="h-4 w-4" />,
  task: <ListChecks className="h-4 w-4" />,
  custom: <Sparkles className="h-4 w-4" />,
};

/* -------------------------------------------------------------------------- */
/* Action contract                                                            */
/* -------------------------------------------------------------------------- */

type ActivityAction =
  | { type: "start" }
  | {
      type: "complete";
      recordedValue?: number;
      actualDurationMinutes?: number;
      notes?: string;
      evidence?: string[];
    }
  | { type: "skip"; skippedReason: string };

async function uploadEvidencePhotoStub(file: File): Promise<{ url: string }> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { url: URL.createObjectURL(file) };
}

export default function ProgramDayDetailsPage({
  params,
}: ProgramDayDetailsPageProps) {
  const [day, setDay] = useState<UserProgramDayDetailsResponseDTO | null>(null);
  const [programId, setProgramId] = useState("");
  const [dayNumber, setDayNumber] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pendingActivityId, setPendingActivityId] = useState<string | null>(
    null,
  );
  const [actionError, setActionError] = useState<string | null>(null);

  const loadDay = useCallback(async (id: string, num: number) => {
    const response = await userProgramDayService.getDayDetails(id, num);
    setDay(response.data);
  }, []);

  useEffect(() => {
    let active = true;

    const init = async () => {
      try {
        const { programId: pid, dayNumber: dnRaw } = await params;
        const dn = Number(dnRaw);
        if (!active) return;

        setProgramId(pid);
        setDayNumber(dn);

        const response = await userProgramDayService.getDayDetails(pid, dn);
        if (active) setDay(response.data);
      } catch (err) {
        console.error(err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    init();
    return () => {
      active = false;
    };
  }, [params]);

  const handleActivityAction = useCallback(
    async (
      activity: UserProgramDayActivityResponseDTO,
      action: ActivityAction,
    ) => {
      if (!day || day.tracking.isLocked) return;

      const dayId = day._id;

      setActionError(null);
      setPendingActivityId(activity._id);

      const previousDay = day;
      const optimisticStatus: UserActivityTrackingStatus =
        action.type === "start"
          ? UserActivityTrackingStatus.IN_PROGRESS
          : action.type === "complete"
            ? UserActivityTrackingStatus.COMPLETED
            : UserActivityTrackingStatus.SKIPPED;

      setDay({
        ...day,
        activities: day.activities.map((a) =>
          a._id === activity._id
            ? {
                ...a,
                tracking: {
                  ...a.tracking,
                  status: optimisticStatus,
                  ...(action.type === "complete"
                    ? {
                        recordedValue: action.recordedValue,
                        actualDurationMinutes: action.actualDurationMinutes,
                        notes: action.notes ?? a.tracking.notes,
                        evidence: action.evidence ?? a.tracking.evidence,
                        completedAt: new Date().toISOString(),
                      }
                    : {}),
                  ...(action.type === "start"
                    ? { startedAt: new Date().toISOString() }
                    : {}),
                  ...(action.type === "skip"
                    ? { skippedReason: action.skippedReason }
                    : {}),
                },
              }
            : a,
        ),
      });

      try {
        if (action.type === "start") {
          await userActivityTrackingService.startActivity(
            programId,
            dayId,
            activity._id,
          );
        } else if (action.type === "complete") {
          const payload: UpdateActivityTrackingDTO = {
            status: UserActivityTrackingStatus.COMPLETED,
            recordedValue: action.recordedValue,
            actualDurationMinutes: action.actualDurationMinutes,
            notes: action.notes,
            evidence: action.evidence,
          };
          await userActivityTrackingService.updateActivity(
            programId,
            dayId,
            activity._id,
            payload,
          );
        } else {
          await userActivityTrackingService.skipActivity(
            programId,
            dayId,
            activity._id,
            action.skippedReason,
          );
        }

        // Resync accurate aggregates (adherence, completion %, etc).
        await loadDay(programId, dayNumber);
      } catch (err) {
        console.error(err);
        setDay(previousDay);
        setActionError("Couldn't save that update. Please try again.");
      } finally {
        setPendingActivityId(null);
      }
    },
    [day, programId, dayNumber, loadDay],
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="h-5 w-28 rounded bg-slate-200 animate-pulse" />
        <div className="mt-6 h-32 rounded-2xl bg-slate-200 animate-pulse" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-slate-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !day) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 py-20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <ListChecks className="h-6 w-6 text-emerald-600" />
          </div>
          <h2 className="mt-4 text-lg font-bold tracking-tight text-slate-900">
            Program day not found
          </h2>
        </div>
      </div>
    );
  }

  const { tracking, activities } = day;
  const sortedActivities = [...activities].sort((a, b) => a.order - b.order);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <Link
        href={`/user/programs/${programId}/days`}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors duration-150 hover:text-emerald-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Days
      </Link>

      {actionError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          {actionError}
        </div>
      )}

      {/* Day header / tracking summary */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-6 w-1 rounded-full bg-emerald-600" />
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Day {day.dayNumber}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {tracking.isLocked && (
              <span className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                <Lock className="h-3 w-3" />
                Locked
              </span>
            )}
            <span
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${DAY_STATUS_STYLES[tracking.status]}`}
            >
              {DAY_STATUS_LABELS[tracking.status]}
            </span>
          </div>
        </div>

        <p className="mt-1 text-xs font-medium text-slate-500">
          {new Date(tracking.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Activities
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {tracking.completedActivities}/{tracking.totalActivities}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Adherence
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {tracking.adherenceScore}%
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Skipped
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {tracking.skippedActivities}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-500">Overall completion</span>
            <span className="font-bold text-emerald-700">
              {tracking.overallCompletionPercentage}%
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${tracking.overallCompletionPercentage}%` }}
            />
          </div>
        </div>

        {(tracking.userNotes || tracking.nutritionistNotes) && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {tracking.userNotes && (
              <div className="rounded-xl border border-slate-200/80 p-3.5">
                <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  <MessageSquare className="h-3 w-3" />
                  Your notes
                </p>
                <p className="mt-1.5 text-sm font-medium text-slate-700">
                  {tracking.userNotes}
                </p>
              </div>
            )}

            {tracking.nutritionistNotes && (
              <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-3.5">
                <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-sky-700">
                  <MessageSquare className="h-3 w-3" />
                  Nutritionist notes
                </p>
                <p className="mt-1.5 text-sm font-medium text-slate-700">
                  {tracking.nutritionistNotes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Activities */}
      <div className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-emerald-600" />
          <h2 className="text-base font-bold tracking-tight text-slate-900">
            Activities
          </h2>
        </div>

        {sortedActivities.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              <ListChecks className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-sm font-bold tracking-tight text-slate-900">
              No activities for this day
            </h3>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedActivities.map((activity) => (
              <ActivityCard
                key={activity._id}
                activity={activity}
                isDayLocked={tracking.isLocked}
                isPending={pendingActivityId === activity._id}
                onAction={(action) => handleActivityAction(activity, action)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ActivityCardProps {
  activity: UserProgramDayActivityResponseDTO;
  isDayLocked: boolean;
  isPending: boolean;
  onAction: (action: ActivityAction) => void;
}

function ActivityCard({
  activity,
  isDayLocked,
  isPending,
  onAction,
}: ActivityCardProps) {
  const { tracking } = activity;

  const isTerminal =
    tracking.status === UserActivityTrackingStatus.COMPLETED ||
    tracking.status === UserActivityTrackingStatus.SKIPPED;

  const [forceEdit, setForceEdit] = useState(false);
  const [showSkipInput, setShowSkipInput] = useState(false);
  const [skipReasonDraft, setSkipReasonDraft] = useState(
    tracking.skippedReason ?? "",
  );

  const [numberDraft, setNumberDraft] = useState<number | undefined>(
    tracking.recordedValue ?? activity.targetValue,
  );
  const [durationDraft, setDurationDraft] = useState<number | undefined>(
    tracking.actualDurationMinutes ?? activity.estimatedDurationMinutes,
  );

  const [textDraft, setTextDraft] = useState(tracking.notes ?? "");
  const [evidenceDraft, setEvidenceDraft] = useState<string[]>(
    tracking.evidence,
  );
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  const isEditable = !isDayLocked && (!isTerminal || forceEdit);
  const isStarting =
    isPending && tracking.status === UserActivityTrackingStatus.NOT_STARTED;

  const canComplete = (() => {
    switch (activity.valueType) {
      case "boolean":
        return true;
      case "number":
        return numberDraft !== undefined && numberDraft !== null;
      case "duration":
        return durationDraft !== undefined && durationDraft !== null;
      case "text":
        return textDraft.trim().length > 0;
      case "photo":
        return evidenceDraft.length > 0;
      default:
        return true;
    }
  })();

  const canSkip = skipReasonDraft.trim().length > 0;

  const handleRemoveEvidence = (url: string) => {
    setEvidenceDraft((prev) => prev.filter((e) => e !== url));
  };

  const handleComplete = () => {
    onAction({
      type: "complete",
      recordedValue: activity.valueType === "number" ? numberDraft : undefined,
      actualDurationMinutes:
        activity.valueType === "duration" ? durationDraft : undefined,
      notes: activity.valueType === "text" ? textDraft : undefined,
      evidence: activity.valueType === "photo" ? evidenceDraft : undefined,
    });
    setForceEdit(false);
  };

  const handleSkipConfirm = () => {
    if (!canSkip) return;
    onAction({ type: "skip", skippedReason: skipReasonDraft.trim() });
    setShowSkipInput(false);
  };

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
          {isTerminal && !isDayLocked && !forceEdit && (
            <button
              type="button"
              onClick={() => setForceEdit(true)}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/80 text-slate-500 transition-colors duration-150 hover:border-emerald-300 hover:text-emerald-700"
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

      {/* Meta row */}
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
        {tracking.score !== undefined && <span>Score: {tracking.score}</span>}
      </div>

      {/* Interactive tracking area */}
      {isDayLocked ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-500">
          <Lock className="h-3.5 w-3.5" />
          This day is locked
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

          {showSkipInput ? (
            <div className="rounded-xl bg-rose-50/60 p-3">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-rose-700">
                Reason for skipping
              </label>
              <textarea
                value={skipReasonDraft}
                onChange={(e) => setSkipReasonDraft(e.target.value)}
                rows={2}
                className="mt-1.5 w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400"
                placeholder="e.g. Felt unwell today"
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleSkipConfirm}
                  disabled={isPending || !canSkip}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-xs transition-colors duration-150 hover:bg-rose-700 disabled:opacity-50"
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
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors duration-150 hover:bg-slate-50"
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
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 transition-colors duration-150 hover:bg-emerald-100 disabled:opacity-60"
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
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-1.5 text-[11px] font-semibold text-white shadow-xs transition-colors duration-150 hover:bg-emerald-800 disabled:opacity-50"
              >
                {isPending && !isStarting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                {forceEdit ? "Save changes" : "Complete"}
              </button>

              <button
                type="button"
                onClick={() => setShowSkipInput(true)}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors duration-150 hover:bg-slate-50 disabled:opacity-60"
              >
                <SkipForward className="h-3.5 w-3.5" />
                Skip
              </button>

              {forceEdit && (
                <button
                  type="button"
                  onClick={() => setForceEdit(false)}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-semibold text-slate-500 transition-colors duration-150 hover:bg-slate-50"
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
            setEvidenceDraft((prev) => [...prev, url]);
            setIsUploaderOpen(false);
          }}
          uploadImage={uploadEvidencePhotoStub}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Value input (per valueType)                                                */
/* -------------------------------------------------------------------------- */

interface ActivityValueInputProps {
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

function ActivityValueInput({
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
          Mark this activity complete when you&apos;re done.
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
            onChange={(e) =>
              onNumberChange(
                e.target.value === "" ? undefined : Number(e.target.value),
              )
            }
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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
            Actual duration (minutes)
          </label>
          <input
            type="number"
            value={durationDraft ?? ""}
            onChange={(e) =>
              onDurationChange(
                e.target.value === "" ? undefined : Number(e.target.value),
              )
            }
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            placeholder={
              activity.estimatedDurationMinutes !== undefined
                ? `Est. ${activity.estimatedDurationMinutes} min`
                : "Minutes"
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
            onChange={(e) => onTextChange(e.target.value)}
            rows={3}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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
            className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-xs font-semibold text-slate-500 transition-colors duration-150 hover:border-emerald-300 hover:bg-emerald-50/40 hover:text-emerald-700"
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
                    alt="Evidence"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveEvidence(url)}
                    aria-label="Remove evidence"
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/70 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100"
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

function ReadOnlySummary({
  activity,
}: {
  activity: UserProgramDayActivityResponseDTO;
}) {
  const { tracking } = activity;

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
        {tracking.recordedValue !== undefined && (
          <span className="font-bold text-emerald-700">
            Recorded: {tracking.recordedValue} {activity.unit ?? ""}
          </span>
        )}
        {tracking.actualDurationMinutes !== undefined && (
          <span className="flex items-center gap-1 font-bold text-emerald-700">
            <Clock className="h-3 w-3" />
            Actual {tracking.actualDurationMinutes} min
          </span>
        )}
      </div>

      {tracking.evidence.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tracking.evidence.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-200/80 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 transition-colors duration-150 hover:bg-emerald-50"
            >
              Evidence {i + 1}
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
