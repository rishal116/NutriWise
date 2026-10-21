"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  AlertCircle,
  ArrowLeft,
  Ban,
  CalendarDays,
  CheckCircle2,
  Clock,
  Mail,
  PlayCircle,
  RefreshCw,
  Timer,
  UserRound,
  Video,
  X,
  XCircle,
} from "lucide-react";

import { userMeetingService } from "@/services/user/userMeeting.service";
import { MeetingStatus } from "@/enums/user/meeting/user-meeting.enum";
import type { UserMeetingDetailsResponseDTO } from "@/dtos/user/meeting/user-meeting-details-response.dto";

const EARLY_JOIN_MS = 15 * 60 * 1000;
const MAX_REASON_LENGTH = 500;
const MEETINGS_PATH = "/user/meetings";

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});
const TIME_FORMAT = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
});
const DATE_TIME_FORMAT = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function fmt(
  formatter: Intl.DateTimeFormat,
  value: string | Date | null | undefined,
  fallback: string,
): string {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : formatter.format(date);
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Now";
  if (ms < 60_000) return `${Math.ceil(ms / 1000)}s`;

  const totalMinutes = Math.ceil(ms / 60_000);
  if (totalMinutes < 60) return `${totalMinutes}m`;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

const STATUS_BADGE: Record<string, string> = {
  [MeetingStatus.SCHEDULED]: "border-sky-300/40 bg-sky-400/15 text-sky-100",
  [MeetingStatus.ONGOING]:
    "border-emerald-300/40 bg-emerald-400/20 text-emerald-100",
  [MeetingStatus.COMPLETED]:
    "border-slate-300/30 bg-slate-300/15 text-slate-100",
  [MeetingStatus.CANCELLED]: "border-rose-300/40 bg-rose-400/20 text-rose-100",
};

type JoinState =
  | { kind: "joinable" }
  | { kind: "too-early"; msUntilOpen: number }
  | { kind: "ended" }
  | { kind: "cancelled" }
  | { kind: "unavailable" };

function getJoinState(
  meeting: UserMeetingDetailsResponseDTO,
  now: number,
): JoinState {
  if (meeting.status === MeetingStatus.COMPLETED) return { kind: "ended" };
  if (meeting.status === MeetingStatus.CANCELLED) return { kind: "cancelled" };
  if (!meeting.roomId) return { kind: "unavailable" };
  if (meeting.status === MeetingStatus.ONGOING) return { kind: "joinable" };

  const scheduledAtMs = new Date(meeting.scheduledAt).getTime();
  if (Number.isNaN(scheduledAtMs)) return { kind: "unavailable" };

  const opensAt = scheduledAtMs - EARLY_JOIN_MS;
  return now < opensAt
    ? { kind: "too-early", msUntilOpen: opensAt - now }
    : { kind: "joinable" };
}

interface LoadResult {
  id: string;
  meeting: UserMeetingDetailsResponseDTO | null;
}

export default function UserMeetingDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const meetingId = params.id;

  // State is only set from async callbacks and event handlers.
  const [result, setResult] = useState<LoadResult | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [now, setNow] = useState(0);
  const [joining, setJoining] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    let active = true;

    userMeetingService
      .getMeetingDetails(meetingId)
      .then((response) => {
        if (!active) return;
        setNow(Date.now());
        setResult({ id: meetingId, meeting: response?.data ?? null });
      })
      .catch(() => {
        if (!active) return;
        setResult({ id: meetingId, meeting: null });
        toast.error("Could not load meeting details.");
      });

    return () => {
      active = false;
    };
  }, [meetingId, reloadKey]);

  const loading = !result || result.id !== meetingId;
  const meeting = loading ? null : result.meeting;
  const status = meeting?.status;
  const scheduledAt = meeting?.scheduledAt;

  // Countdown ticker: runs only until the join window opens, every second in
  // the final minute and every 15 seconds before that.
  useEffect(() => {
    if (status !== MeetingStatus.SCHEDULED || !scheduledAt) return;

    const opensAt = new Date(scheduledAt).getTime() - EARLY_JOIN_MS;
    if (!Number.isFinite(opensAt)) return;

    const remaining = opensAt - now;
    if (remaining <= 0) return;

    const delay = Math.min(remaining, remaining <= 60_000 ? 1000 : 15_000);
    const timer = setTimeout(() => setNow(Date.now()), delay);

    return () => clearTimeout(timer);
  }, [status, scheduledAt, now]);

  const reload = useCallback((showSkeleton: boolean) => {
    if (showSkeleton) setResult(null);
    setReloadKey((key) => key + 1);
  }, []);

  const closeDialog = useCallback(() => setShowCancelDialog(false), []);

  const handleJoin = () => {
    if (!meeting || joining) return;

    if (getJoinState(meeting, Date.now()).kind !== "joinable") {
      toast.error("This meeting is not available to join yet.");
      return;
    }

    setJoining(true);
    router.push(`/video-call/${encodeURIComponent(meeting.roomId)}`);
  };

  const handleCancelMeeting = useCallback(
    async (rawReason: string) => {
      if (!meeting || cancelling) return;

      if (meeting.status !== MeetingStatus.SCHEDULED) {
        toast.error("Only scheduled meetings can be cancelled.");
        return;
      }

      const reason = rawReason.trim();

      if (!reason) {
        toast.error("Please provide a cancellation reason.");
        return;
      }

      if (reason.length > MAX_REASON_LENGTH) {
        toast.error("The cancellation reason cannot exceed 500 characters.");
        return;
      }

      try {
        setCancelling(true);

        const response = await userMeetingService.cancelMeeting(
          meeting.id,
          reason,
        );

        if (response?.data) {
          setNow(Date.now());
          setResult({ id: meetingId, meeting: response.data });
        } else {
          reload(false);
        }

        setShowCancelDialog(false);
        toast.success("Meeting cancelled successfully.");
      } catch {
        toast.error("Could not cancel the meeting. Please try again.");
      } finally {
        setCancelling(false);
      }
    },
    [meeting, cancelling, meetingId, reload],
  );

  if (loading) return <DetailsSkeleton />;

  if (!meeting) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
        <section
          role="alert"
          className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm"
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <AlertCircle size={26} />
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Unable to load this meeting
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            The meeting may be unavailable, or there may be a connection issue.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => router.push(MEETINGS_PATH)}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Go back
            </button>
            <button
              type="button"
              onClick={() => reload(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        </section>
      </main>
    );
  }

  // ---- Derived values with fallbacks ----
  const joinState = getJoinState(meeting, now);
  const isScheduled = meeting.status === MeetingStatus.SCHEDULED;
  const title = meeting.title?.trim() || "Untitled meeting";
  const nutritionistName =
    meeting.nutritionist?.fullName?.trim() || "Your nutritionist";
  const nutritionistEmail = meeting.nutritionist?.email?.trim() || "";
  const duration =
    typeof meeting.durationInMinutes === "number" &&
    meeting.durationInMinutes > 0
      ? `${meeting.durationInMinutes} min`
      : "Not specified";

  const dateText = fmt(DATE_FORMAT, meeting.scheduledAt, "Date unavailable");
  const timeText = fmt(TIME_FORMAT, meeting.scheduledAt, "Time unavailable");

  const activity: {
    key: string;
    icon: ReactNode;
    label: string;
    time: string;
  }[] = [];

  if (meeting.startedAt) {
    activity.push({
      key: "started",
      icon: <PlayCircle size={16} className="text-emerald-600" />,
      label: "Meeting started",
      time: fmt(DATE_TIME_FORMAT, meeting.startedAt, "Unavailable"),
    });
  }
  if (meeting.endedAt) {
    activity.push({
      key: "ended",
      icon: <CheckCircle2 size={16} className="text-slate-500" />,
      label: "Meeting ended",
      time: fmt(DATE_TIME_FORMAT, meeting.endedAt, "Unavailable"),
    });
  }
  if (meeting.cancelledBy) {
    activity.push({
      key: "cancelled",
      icon: <XCircle size={16} className="text-rose-600" />,
      label:
        meeting.cancelledBy === "user"
          ? "Cancelled by you"
          : "Cancelled by nutritionist",
      time: fmt(DATE_TIME_FORMAT, meeting.updatedAt, "Unavailable"),
    });
  }

  const cancellationReason = meeting.cancellationReason?.trim() || "";

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8">
        <button
          type="button"
          onClick={() => router.push(MEETINGS_PATH)}
          className="mb-5 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-500 transition hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to meetings
        </button>

        {/* Hero */}
        <section className="relative mb-6 overflow-hidden rounded-3xl bg-linear-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-5 text-white shadow-sm sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-2 -top-10 h-48 w-48 rounded-full border border-white/10"
          />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-50">
                <Video size={13} />
                Nutritionist meeting
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${
                  STATUS_BADGE[meeting.status] ??
                  "border-white/20 bg-white/10 text-white"
                }`}
              >
                {meeting.status === MeetingStatus.ONGOING && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  </span>
                )}
                {meeting.status || "unknown"}
              </span>
            </div>

            <h1 className="mt-5 break-words text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-emerald-100/80">
              with {nutritionistName}
            </p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-emerald-50/90">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={15} />
                {dateText}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={15} />
                {timeText}
              </span>
            </div>

            <div className="mt-6 max-w-md">
              <JoinPanel
                joinState={joinState}
                joining={joining}
                onJoin={handleJoin}
              />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card title="Schedule">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <InfoTile
                  icon={<CalendarDays size={16} />}
                  label="Date"
                  value={dateText}
                />
                <InfoTile
                  icon={<Clock size={16} />}
                  label="Time"
                  value={timeText}
                />
                <InfoTile
                  icon={<Timer size={16} />}
                  label="Duration"
                  value={duration}
                />
              </div>
            </Card>

            <Card title="Activity">
              {activity.length === 0 && !cancellationReason ? (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  No activity yet. Updates will appear here once the meeting
                  starts.
                </p>
              ) : (
                <div className="space-y-3">
                  {activity.map((item) => (
                    <div
                      key={item.key}
                      className="flex flex-col gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                        {item.icon}
                        {item.label}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        {item.time}
                      </span>
                    </div>
                  ))}

                  {cancellationReason && (
                    <div className="rounded-xl border border-rose-100 bg-rose-50/70 p-4">
                      <p className="text-xs font-semibold text-rose-700">
                        Cancellation reason
                      </p>
                      <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-700">
                        {cancellationReason}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          <aside className="space-y-6">
            <Card title="Nutritionist">
              <div className="flex items-center gap-3.5">
                <Avatar
                  src={meeting.nutritionist?.profileImage}
                  name={nutritionistName}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800">
                    {nutritionistName}
                  </p>
                  {nutritionistEmail ? (
                    <a
                      href={`mailto:${nutritionistEmail}`}
                      className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-500 hover:text-emerald-700"
                    >
                      <Mail size={12} className="shrink-0" />
                      <span className="truncate">{nutritionistEmail}</span>
                    </a>
                  ) : (
                    <p className="mt-0.5 text-xs text-slate-400">
                      No email provided
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {isScheduled && (
              <Card title="Manage booking">
                <p className="mb-4 text-sm leading-6 text-slate-500">
                  Plans changed? You can cancel this meeting and let your
                  nutritionist know why.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCancelDialog(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-600 transition hover:border-rose-600 hover:bg-rose-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                >
                  <Ban size={16} />
                  Cancel meeting
                </button>
              </Card>
            )}
          </aside>
        </div>
      </div>

      {showCancelDialog && (
        <CancelDialog
          nutritionistName={nutritionistName}
          cancelling={cancelling}
          onClose={closeDialog}
          onConfirm={handleCancelMeeting}
        />
      )}
    </main>
  );
}

function JoinPanel({
  joinState,
  joining,
  onJoin,
}: {
  joinState: JoinState;
  joining: boolean;
  onJoin: () => void;
}) {
  const glass =
    "flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-4 py-3.5 text-sm font-semibold text-emerald-50";

  switch (joinState.kind) {
    case "joinable":
      return (
        <button
          type="button"
          onClick={onJoin}
          disabled={joining}
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-white px-5 py-4 text-sm font-bold text-emerald-900 shadow-sm transition hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {joining ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : (
            <Video size={18} />
          )}
          {joining ? "Opening meeting..." : "Join video meeting"}
        </button>
      );
    case "too-early":
      return (
        <div className={glass} role="status">
          <Clock size={16} />
          Join opens in {formatCountdown(joinState.msUntilOpen)}
        </div>
      );
    case "ended":
      return (
        <div className={glass}>
          <CheckCircle2 size={16} />
          This meeting has ended
        </div>
      );
    case "cancelled":
      return (
        <div className={glass}>
          <XCircle size={16} />
          This meeting was cancelled
        </div>
      );
    default:
      return (
        <div className={glass}>
          <AlertCircle size={16} />
          The meeting room is not available yet
        </div>
      );
  }
}

function CancelDialog({
  nutritionistName,
  cancelling,
  onClose,
  onConfirm,
}: {
  nutritionistName: string;
  cancelling: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}) {
  // Reason state lives here so typing does not re-render the whole page.
  const [reason, setReason] = useState("");
  const keepButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    keepButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !cancelling) onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [cancelling, onClose]);

  const length = reason.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !cancelling) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-meeting-title"
        aria-describedby="cancel-meeting-description"
        className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-lg sm:rounded-3xl"
      >
        <div className="flex items-start gap-4 border-b border-slate-100 px-5 pb-4 pt-5 sm:px-7 sm:pt-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-4 ring-rose-50/60">
            <Ban size={21} />
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id="cancel-meeting-title"
              className="text-lg font-bold text-slate-900 sm:text-xl"
            >
              Cancel meeting?
            </h2>
            <p
              id="cancel-meeting-description"
              className="mt-1 text-sm leading-6 text-slate-600"
            >
              This will cancel your scheduled meeting with{" "}
              <span className="font-semibold text-slate-800">
                {nutritionistName}
              </span>
              .
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={cancelling}
            aria-label="Close cancellation dialog"
            className="-mr-1 -mt-1 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-5 sm:px-7">
          <label
            htmlFor="cancellationReason"
            className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-800"
          >
            <span>
              Reason for cancellation
              <span className="ml-1 text-rose-600" aria-hidden="true">
                *
              </span>
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
              Required
            </span>
          </label>

          <textarea
            id="cancellationReason"
            value={reason}
            onChange={(event) =>
              setReason(event.target.value.slice(0, MAX_REASON_LENGTH))
            }
            maxLength={MAX_REASON_LENGTH}
            rows={4}
            required
            disabled={cancelling}
            placeholder="e.g. I have a schedule conflict and cannot attend..."
            aria-describedby="cancellationReason-help"
            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <div
            id="cancellationReason-help"
            className="mt-2 flex items-center justify-between gap-3 text-xs"
          >
            <span className="text-slate-500">
              Your nutritionist will see this reason.
            </span>
            <span
              className={`shrink-0 font-semibold tabular-nums ${
                length >= MAX_REASON_LENGTH
                  ? "text-rose-600"
                  : length >= 450
                    ? "text-amber-600"
                    : "text-slate-400"
              }`}
            >
              {length}/{MAX_REASON_LENGTH}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
          <button
            ref={keepButtonRef}
            type="button"
            onClick={onClose}
            disabled={cancelling}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Keep meeting
          </button>

          <button
            type="button"
            onClick={() => void onConfirm(reason)}
            disabled={cancelling || !reason.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-600 transition hover:border-rose-600 hover:bg-rose-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-rose-200 disabled:hover:bg-white disabled:hover:text-rose-600"
          >
            {cancelling ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Ban size={16} />
            )}
            {cancelling ? "Cancelling..." : "Confirm cancellation"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Avatar({ src, name }: { src?: string | null; name: string }) {
  const [broken, setBroken] = useState(false);
  const url = src?.trim() || "";

  return (
    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-emerald-100 bg-emerald-100/80">
      {url && !broken ? (
        <Image
          src={url}
          alt={name}
          fill
          sizes="48px"
          unoptimized
          className="object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <UserRound size={22} className="text-emerald-700" />
      )}
    </div>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
      <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </h2>
      {children}
    </section>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-slate-200/80 bg-slate-50 px-3 py-4 text-center">
      <span className="mb-1.5 text-emerald-600">{icon}</span>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 break-words text-xs font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <main
      className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6"
      role="status"
      aria-label="Loading meeting"
    >
      <div className="mx-auto max-w-5xl animate-pulse space-y-6">
        <div className="h-4 w-36 rounded bg-slate-200" />
        <div className="h-60 rounded-3xl bg-emerald-950/10" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="h-44 rounded-3xl bg-white" />
            <div className="h-32 rounded-3xl bg-white" />
          </div>
          <div className="space-y-6">
            <div className="h-28 rounded-3xl bg-white" />
            <div className="h-36 rounded-3xl bg-white" />
          </div>
        </div>
      </div>
    </main>
  );
}
