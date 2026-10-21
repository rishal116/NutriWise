"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  Pencil,
  PlayCircle,
  RefreshCw,
  Timer,
  Video,
  X,
  XCircle,
} from "lucide-react";

import { nutriMeetingService } from "@/services/nutritionist/nutriMeeting.service";
import { MeetingStatus } from "@/enums/nutritionist/meeting/meeting.enum";
import type { MeetingDetailsResponseDTO } from "@/dtos/nutritionist/meeting/meeting-details-response.dto";

const IST = "Asia/Kolkata";

const DATE_FORMAT = new Intl.DateTimeFormat("en-IN", {
  timeZone: IST,
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const TIME_FORMAT = new Intl.DateTimeFormat("en-IN", {
  timeZone: IST,
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});
const DATE_TIME_FORMAT = new Intl.DateTimeFormat("en-IN", {
  timeZone: IST,
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

function toDate(value?: string | Date | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
}

function fmt(
  formatter: Intl.DateTimeFormat,
  value: string | Date | null | undefined,
  fallback: string,
): string {
  const date = toDate(value);
  return date ? formatter.format(date) : fallback;
}

function getInitial(name?: string | null): string {
  return name?.trim().charAt(0).toUpperCase() || "?";
}

interface StatusMeta {
  badge: string;
  description: string;
}

const NEUTRAL_STATUS: StatusMeta = {
  badge: "border-white/20 bg-white/10 text-white",
  description: "Review the details and status of this consultation.",
};

const STATUS_META: Record<string, StatusMeta> = {
  [MeetingStatus.SCHEDULED]: {
    badge: "border-sky-300/40 bg-sky-400/15 text-sky-100",
    description:
      "This consultation is scheduled. You can edit its details or cancel it if your plans change.",
  },
  [MeetingStatus.ONGOING]: {
    badge: "border-emerald-300/40 bg-emerald-400/20 text-emerald-100",
    description:
      "This consultation is in progress. Open the video room to connect with your client.",
  },
  [MeetingStatus.COMPLETED]: {
    badge: "border-slate-300/30 bg-slate-300/15 text-slate-100",
    description:
      "This consultation has ended. You can review its schedule and activity below.",
  },
  [MeetingStatus.CANCELLED]: {
    badge: "border-rose-300/40 bg-rose-400/20 text-rose-100",
    description:
      "This consultation has been cancelled. Its details remain available for reference.",
  },
};

interface LoadResult {
  id: string;
  meeting: MeetingDetailsResponseDTO | null;
}

export default function MeetingDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const meetingId = params.id;

  // State is only set from async callbacks / event handlers, never
  // synchronously inside an effect.
  const [result, setResult] = useState<LoadResult | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [joining, setJoining] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [imageBroken, setImageBroken] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  const keepButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    let active = true;

    nutriMeetingService
      .getMeetingDetails(meetingId)
      .then((response) => {
        console.log(response);

        if (!active) return;
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

  // Close dialog on Escape and move focus into it.
  useEffect(() => {
    if (!showCancelDialog) return;

    keepButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !cancelling) setShowCancelDialog(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showCancelDialog, cancelling]);

  const reload = useCallback((showSkeleton: boolean) => {
    if (showSkeleton) setResult(null);
    setReloadKey((key) => key + 1);
  }, []);

  const loading = !result || result.id !== meetingId;
  const meeting = loading ? null : result.meeting;

  const handleJoin = () => {
    if (!meeting?.roomId || joining) return;
    setJoining(true);
    router.push(`/video-call/${encodeURIComponent(meeting.roomId)}`);
  };

  const handleCancelMeeting = async () => {
    if (!meeting || meeting.status !== MeetingStatus.SCHEDULED || cancelling) {
      return;
    }

    const reason = cancellationReason.trim();

    if (!reason) {
      toast.error("Please provide a reason for cancelling this meeting.");
      return;
    }

    if (reason.length > 500) {
      toast.error("Cancellation reason cannot exceed 500 characters.");
      return;
    }

    try {
      setCancelling(true);

      await nutriMeetingService.cancelMeeting(meeting.id, reason);

      toast.success("Meeting cancelled successfully.");
      setShowCancelDialog(false);
      setCancellationReason("");
      reload(false);
    } catch {
      toast.error("Could not cancel the meeting. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <MeetingSkeleton />;

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
            Unable to load meeting
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            We could not retrieve this consultation. Check your connection and
            try again.
          </p>
          <button
            type="button"
            onClick={() => reload(true)}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <RefreshCw size={16} />
            Try again
          </button>
          <button
            type="button"
            onClick={() => router.push("/nutritionist/meetings")}
            className="mt-2 w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Back to meetings
          </button>
        </section>
      </main>
    );
  }

  // ---- Derived values with fallbacks ----
  const status = meeting.status;
  const statusMeta = STATUS_META[status] ?? NEUTRAL_STATUS;
  const isScheduled = status === MeetingStatus.SCHEDULED;
  const isOngoing = status === MeetingStatus.ONGOING;
  const isCompleted = status === MeetingStatus.COMPLETED;
  const isCancelled = status === MeetingStatus.CANCELLED;
  const isFinished = isCompleted || isCancelled;
  const canJoin = !isFinished && Boolean(meeting.roomId);

  const title = meeting.title?.trim() || "Untitled meeting";
  const clientName = meeting.user?.fullName?.trim() || "Unknown client";
  const clientEmail = meeting.user?.email?.trim() || "";
  const profileImage = meeting.user?.profileImage?.trim() || "";
  const showImage = Boolean(profileImage) && !imageBroken;

  const duration =
    typeof meeting.durationInMinutes === "number" &&
    meeting.durationInMinutes > 0
      ? `${meeting.durationInMinutes} minutes`
      : "Not specified";

  const activity = [
    meeting.startedAt && {
      key: "started",
      icon: <PlayCircle size={17} />,
      tone: "bg-emerald-50 text-emerald-700",
      label: "Meeting started",
      time: fmt(DATE_TIME_FORMAT, meeting.startedAt, "Time unavailable"),
    },
    meeting.endedAt && {
      key: "ended",
      icon: <CheckCircle2 size={17} />,
      tone: "bg-slate-100 text-slate-600",
      label: "Meeting ended",
      time: fmt(DATE_TIME_FORMAT, meeting.endedAt, "Time unavailable"),
    },
    meeting.cancelledBy && {
      key: "cancelled",
      icon: <XCircle size={17} />,
      tone: "bg-rose-50 text-rose-600",
      label:
        meeting.cancelledBy === "user"
          ? "Cancelled by client"
          : "Cancelled by nutritionist",
      time: fmt(DATE_TIME_FORMAT, meeting.updatedAt, "Time unavailable"),
    },
  ].filter(Boolean) as {
    key: string;
    icon: ReactNode;
    tone: string;
    label: string;
    time: string;
  }[];

  const roomMessage = isCancelled
    ? "This meeting was cancelled, so the room is unavailable."
    : isCompleted
      ? "This meeting has ended. The room is closed."
      : !meeting.roomId
        ? "The video room is not ready yet. Try refreshing in a moment."
        : isOngoing
          ? "The meeting is live. Open the room to continue."
          : "Open the room when you are ready to connect with your client.";

  const joinButton = (
    <button
      type="button"
      onClick={handleJoin}
      disabled={!canJoin || joining}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {joining ? (
        <RefreshCw size={17} className="animate-spin" />
      ) : (
        <Video size={17} />
      )}
      {joining ? "Opening room..." : "Open video room"}
      {!joining && <ArrowUpRight size={16} />}
    </button>
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-28 lg:pb-12">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
        <button
          type="button"
          onClick={() => router.push("/nutritionist/meetings")}
          className="mb-5 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-500 transition hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-emerald-600"
        >
          <ArrowLeft size={17} />
          All meetings
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

          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-50">
                  <Video size={13} />
                  Video consultation
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${statusMeta.badge}`}
                >
                  {isOngoing && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    </span>
                  )}
                  {status || "unknown"}
                </span>
              </div>

              <h1 className="mt-5 wrap-break-word text-2xl font-bold tracking-tight sm:text-3xl">
                {title}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-100/80">
                {statusMeta.description}
              </p>
            </div>

            {isScheduled && (
              <div className="grid shrink-0 grid-cols-2 gap-3 md:flex">
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/nutritionist/meetings/${encodeURIComponent(meeting.id)}/edit`,
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
                >
                  <Pencil size={16} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setShowCancelDialog(true)}
                  disabled={cancelling}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold transition hover:bg-rose-600 focus-visible:outline-2 focus-visible:outline-white disabled:opacity-60"
                >
                  <XCircle size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-6 lg:col-span-2">
            <Card
              title="Schedule"
              subtitle="All times are shown in Indian Standard Time (IST)."
              icon={<CalendarDays size={19} />}
              iconClass="bg-emerald-50 text-emerald-700"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Tile
                  icon={<CalendarDays size={17} />}
                  label="Date"
                  value={fmt(
                    DATE_FORMAT,
                    meeting.scheduledAt,
                    "Date unavailable",
                  )}
                />
                <Tile
                  icon={<Clock3 size={17} />}
                  label="Start time"
                  value={fmt(
                    TIME_FORMAT,
                    meeting.scheduledAt,
                    "Time unavailable",
                  )}
                />
                <Tile
                  icon={<Timer size={17} />}
                  label="Duration"
                  value={duration}
                />
              </div>
            </Card>

            <Card
              title="Meeting activity"
              subtitle="A timeline of this consultation."
              icon={<PlayCircle size={19} />}
              iconClass="bg-sky-50 text-sky-700"
            >
              {activity.length > 0 ? (
                <ol className="space-y-4">
                  {activity.map((item, index) => (
                    <li key={item.key} className="flex items-start gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.tone}`}
                      >
                        {item.icon}
                      </div>
                      <div
                        className={`min-w-0 flex-1 ${
                          index < activity.length - 1
                            ? "border-b border-slate-100 pb-4"
                            : ""
                        }`}
                      >
                        <p className="text-sm font-semibold text-slate-800">
                          {item.label}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {item.time}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  No activity yet. Updates will appear here once the meeting
                  starts.
                </p>
              )}

              {isCancelled && meeting.cancellationReason?.trim() && (
                <section
                  aria-labelledby="cancellation-reason-title"
                  className="mt-5 rounded-2xl border border-rose-200 bg-rose-50/70 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                      <AlertCircle size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3
                        id="cancellation-reason-title"
                        className="text-sm font-bold text-rose-900"
                      >
                        Cancellation reason
                      </h3>

                      <p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-rose-800">
                        {meeting.cancellationReason}
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card
              title="Client"
              subtitle="Consultation participant"
              icon={<Mail size={19} />}
              iconClass="bg-violet-50 text-violet-700"
            >
              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-100 text-base font-bold text-emerald-800">
                  {showImage ? (
                    <Image
                      src={profileImage}
                      alt={clientName}
                      fill
                      sizes="48px"
                      unoptimized
                      className="object-cover"
                      onError={() => setImageBroken(true)}
                    />
                  ) : (
                    getInitial(meeting.user?.fullName)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {clientName}
                  </p>
                  {clientEmail ? (
                    <a
                      href={`mailto:${clientEmail}`}
                      className="block truncate text-xs text-slate-500 hover:text-emerald-700"
                    >
                      {clientEmail}
                    </a>
                  ) : (
                    <p className="truncate text-xs text-slate-400">
                      No email provided
                    </p>
                  )}
                </div>
              </div>
            </Card>

            <section className="hidden rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5 shadow-sm lg:block">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                <Video size={20} />
              </div>
              <h2 className="font-bold text-slate-900">Video room</h2>
              <p className="mb-4 mt-1 text-sm leading-6 text-slate-600">
                {roomMessage}
              </p>
              {isFinished ? (
                <FinishedBadge completed={isCompleted} />
              ) : (
                joinButton
              )}
            </section>
          </aside>
        </div>
      </div>

      {/* Mobile / tablet sticky join bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto max-w-6xl">
          {isFinished ? <FinishedBadge completed={isCompleted} /> : joinButton}
          {!isFinished && !canJoin && (
            <p className="mt-2 text-center text-xs text-slate-500">
              {roomMessage}
            </p>
          )}
        </div>
      </div>

      {showCancelDialog && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => {
            if (!cancelling) setShowCancelDialog(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-meeting-title"
            aria-describedby="cancel-meeting-description"
            className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-lg sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start gap-4 border-b border-slate-100 px-5 pb-4 pt-5 sm:px-7 sm:pt-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-4 ring-rose-50/60">
                <AlertCircle size={22} />
              </div>

              <div className="min-w-0 flex-1">
                <h2
                  id="cancel-meeting-title"
                  className="text-lg font-bold text-slate-900 sm:text-xl"
                >
                  Cancel this meeting?
                </h2>
                <p
                  id="cancel-meeting-description"
                  className="mt-1 text-sm leading-6 text-slate-600"
                >
                  <span className="font-semibold text-slate-800">{title}</span>{" "}
                  will no longer be available to join. Make sure your client is
                  informed.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCancelDialog(false)}
                disabled={cancelling}
                aria-label="Close cancellation dialog"
                className="-mr-1 -mt-1 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* Reason */}
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
                name="cancellationReason"
                value={cancellationReason}
                onChange={(event) => setCancellationReason(event.target.value)}
                placeholder="e.g. I have an unexpected emergency and need to reschedule..."
                rows={4}
                maxLength={500}
                required
                disabled={cancelling}
                aria-describedby="cancellationReason-help"
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <div
                id="cancellationReason-help"
                className="mt-2 flex items-center justify-between gap-3 text-xs"
              >
                <span className="text-slate-500">
                  This reason will be shared with your client.
                </span>
                <span
                  className={`shrink-0 font-semibold tabular-nums ${
                    cancellationReason.length >= 500
                      ? "text-rose-600"
                      : cancellationReason.length >= 450
                        ? "text-amber-600"
                        : "text-slate-400"
                  }`}
                >
                  {cancellationReason.length}/500
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
              <button
                ref={keepButtonRef}
                type="button"
                onClick={() => setShowCancelDialog(false)}
                disabled={cancelling}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Keep meeting
              </button>

              <button
                type="button"
                onClick={() => void handleCancelMeeting()}
                disabled={cancelling}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-600 transition hover:border-rose-600 hover:bg-rose-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelling ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <XCircle size={16} />
                )}
                {cancelling ? "Cancelling..." : "Confirm cancellation"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function Card({
  title,
  subtitle,
  icon,
  iconClass,
  children,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  iconClass: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            {title}
          </h2>
          <p className="text-xs text-slate-500 sm:text-sm">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Tile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
        {icon}
      </div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 wrap-break-word text-sm font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function FinishedBadge({ completed }: { completed: boolean }) {
  return (
    <div className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-500">
      {completed ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
      {completed ? "Meeting completed" : "Meeting cancelled"}
    </div>
  );
}

function MeetingSkeleton() {
  return (
    <main
      className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6"
      role="status"
      aria-label="Loading meeting"
    >
      <div className="mx-auto max-w-6xl animate-pulse space-y-6">
        <div className="h-5 w-32 rounded bg-slate-200" />
        <div className="h-52 rounded-3xl bg-emerald-950/10" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="h-56 rounded-3xl bg-white" />
            <div className="h-40 rounded-3xl bg-white" />
          </div>
          <div className="space-y-6">
            <div className="h-32 rounded-3xl bg-white" />
            <div className="hidden h-48 rounded-3xl bg-white lg:block" />
          </div>
        </div>
      </div>
    </main>
  );
}
