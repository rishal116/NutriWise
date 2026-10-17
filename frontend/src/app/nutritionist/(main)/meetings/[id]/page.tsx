"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Video,
  CalendarDays,
  Clock3,
  Timer,
  RefreshCw,
  AlertCircle,
  XCircle,
  CheckCircle2,
  PlayCircle,
  Mail,
  Pencil,
  ArrowUpRight,
  UserRound,
} from "lucide-react";

import { nutriMeetingService } from "@/services/nutritionist/nutriMeeting.service";
import { MeetingStatus } from "@/enums/nutritionist/meeting/meeting.enum";
import type { MeetingDetailsResponseDTO } from "@/dtos/nutritionist/meeting/meeting-details-response.dto";

const IST = "Asia/Kolkata";

function formatDate(value: string | Date): string {
  return new Date(value).toLocaleDateString("en-IN", {
    timeZone: IST,
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(value: string | Date): string {
  return new Date(value).toLocaleTimeString("en-IN", {
    timeZone: IST,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateTime(value: string | Date): string {
  return new Date(value).toLocaleString("en-IN", {
    timeZone: IST,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function getStatusStyle(status: MeetingStatus): string {
  switch (status) {
    case MeetingStatus.SCHEDULED:
      return "border-sky-200 bg-sky-50 text-sky-700";
    case MeetingStatus.ONGOING:
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case MeetingStatus.COMPLETED:
      return "border-slate-200 bg-slate-100 text-slate-600";
    case MeetingStatus.CANCELLED:
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-600";
  }
}

function isValidDate(value: string | Date): boolean {
  return Number.isFinite(new Date(value).getTime());
}

export default function MeetingDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const meetingId = params.id;

  const [meeting, setMeeting] = useState<MeetingDetailsResponseDTO | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [joining, setJoining] = useState(false);

  const loadMeeting = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await nutriMeetingService.getMeetingDetails(meetingId);

      setMeeting(response.data);
    } catch {
      setError(true);
      toast.error("Couldn't load meeting details");
    } finally {
      setLoading(false);
    }
  }, [meetingId]);

  useEffect(() => {
    void loadMeeting();
  }, [loadMeeting]);

  const handleJoin = () => {
    if (!meeting || joining) return;

    if (
      meeting.status === MeetingStatus.COMPLETED ||
      meeting.status === MeetingStatus.CANCELLED
    ) {
      return;
    }

    setJoining(true);
    router.push(`/video-call/${encodeURIComponent(meeting.roomId)}`);
  };

  if (loading) return <MeetingSkeleton />;

  if (error || !meeting) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <AlertCircle size={25} />
          </div>
          <h1 className="text-lg font-bold text-slate-900">
            Unable to load meeting
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {"We couldn't retrieve this consultation. Please try again."}
          </p>
          <button
            type="button"
            onClick={() => void loadMeeting()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </section>
      </main>
    );
  }

  const canEdit = meeting.status === MeetingStatus.SCHEDULED;
  const isFinished =
    meeting.status === MeetingStatus.COMPLETED ||
    meeting.status === MeetingStatus.CANCELLED;

  const scheduledDate = isValidDate(meeting.scheduledAt)
    ? meeting.scheduledAt
    : null;

  const profileImage = meeting.user.profileImage;
  const hasImage = Boolean(profileImage?.trim());

  return (
    <main className="min-h-screen bg-[#f6f8f7] pb-12">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <button
          type="button"
          onClick={() => router.push("/nutritionist/meetings")}
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
        >
          <ArrowLeft size={17} />
          All consultations
        </button>

        {/* Header */}
        <section className="relative mb-6 overflow-hidden rounded-3xl bg-emerald-950 p-6 text-white shadow-sm sm:p-9">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-1 -top-8 h-44 w-44 rounded-full border border-white/10" />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-50">
                <Video size={14} />
                Video consultation
              </span>
              <span
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(meeting.status)}`}
              >
                {meeting.status}
              </span>
            </div>

            <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div className="min-w-0">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                  Meeting details
                </p>
                <h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">
                  {meeting.title}
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-100/80">
                  Manage your consultation and connect with your client securely
                  through video.
                </p>
              </div>

              {canEdit && (
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/nutritionist/meetings/${encodeURIComponent(meeting.id)}/edit`,
                    )
                  }
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <Pencil size={16} />
                  Edit meeting
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Schedule */}
        <section className="mb-6 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Schedule</h2>
              <p className="mt-1 text-sm text-slate-500">
                All times are shown in Indian Standard Time (IST).
              </p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <CalendarDays size={20} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ScheduleTile
              icon={<CalendarDays size={18} />}
              label="Date"
              value={
                scheduledDate ? formatDate(scheduledDate) : "Date unavailable"
              }
            />
            <ScheduleTile
              icon={<Clock3 size={18} />}
              label="Start time"
              value={
                scheduledDate ? formatTime(scheduledDate) : "Time unavailable"
              }
            />
            <ScheduleTile
              icon={<Timer size={18} />}
              label="Duration"
              value={`${meeting.durationInMinutes} minutes`}
            />
          </div>
        </section>

        {/* Client */}
        <section className="mb-6 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <UserRound size={19} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Client</h2>
              <p className="text-sm text-slate-500">
                Your consultation participant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-800">
              {hasImage ? (
                <Image
                  src={profileImage}
                  alt={meeting.user.fullName}
                  fill
                  sizes="56px"
                  unoptimized
                  className="object-cover"
                />
              ) : (
                getInitial(meeting.user.fullName)
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-slate-900">
                {meeting.user.fullName}
              </p>
              <p className="mt-1 flex min-w-0 items-center gap-2 text-sm text-slate-500">
                <Mail size={14} className="shrink-0" />
                <span className="truncate">{meeting.user.email}</span>
              </p>
            </div>
          </div>
        </section>

        {/* Video call */}
        <section className="mb-6 flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
              <Video size={22} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                Video consultation room
              </h2>
              <p className="mt-1 max-w-md text-sm leading-6 text-slate-600">
                Open the meeting room when you&apos;re ready to connect with
                your client.
              </p>
            </div>
          </div>

          {isFinished ? (
            <div className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-500">
              {meeting.status === MeetingStatus.COMPLETED ? (
                <CheckCircle2 size={17} />
              ) : (
                <XCircle size={17} />
              )}
              {meeting.status === MeetingStatus.COMPLETED
                ? "Meeting completed"
                : "Meeting cancelled"}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleJoin}
              disabled={joining}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {joining ? (
                <RefreshCw size={17} className="animate-spin" />
              ) : (
                <Video size={17} />
              )}
              {joining ? "Opening room..." : "Open video room"}
              {!joining && <ArrowUpRight size={16} />}
            </button>
          )}
        </section>

        {/* Activity */}
        {(meeting.startedAt ||
          meeting.endedAt ||
          meeting.isCancelledByUser ||
          meeting.isCancelledByNutritionist) && (
          <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-bold text-slate-900">Activity</h2>
            <p className="mt-1 text-sm text-slate-500">
              A timeline of this consultation.
            </p>

            <div className="mt-6 space-y-4">
              {(meeting.isCancelledByUser ||
                meeting.isCancelledByNutritionist) && (
                <ActivityRow
                  icon={<XCircle size={17} />}
                  iconClass="bg-rose-50 text-rose-600"
                  label={
                    meeting.isCancelledByUser
                      ? "Cancelled by client"
                      : "Cancelled by nutritionist"
                  }
                  value={formatDateTime(meeting.updatedAt)}
                />
              )}

              {meeting.startedAt && (
                <ActivityRow
                  icon={<PlayCircle size={17} />}
                  iconClass="bg-emerald-50 text-emerald-700"
                  label="Meeting started"
                  value={formatDateTime(meeting.startedAt)}
                />
              )}

              {meeting.endedAt && (
                <ActivityRow
                  icon={<CheckCircle2 size={17} />}
                  iconClass="bg-slate-100 text-slate-600"
                  label="Meeting ended"
                  value={formatDateTime(meeting.endedAt)}
                />
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function ScheduleTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
        {icon}
      </div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function ActivityRow({
  icon,
  iconClass,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1 border-b border-slate-100 pb-4">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="mt-1 text-xs text-slate-500">{value}</p>
      </div>
    </div>
  );
}

function MeetingSkeleton() {
  return (
    <main className="min-h-screen bg-[#f6f8f7] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl animate-pulse space-y-6">
        <div className="h-5 w-40 rounded bg-slate-200" />
        <div className="h-56 rounded-3xl bg-emerald-950/10" />
        <div className="h-52 rounded-3xl bg-white" />
        <div className="h-36 rounded-3xl bg-white" />
      </div>
    </main>
  );
}
