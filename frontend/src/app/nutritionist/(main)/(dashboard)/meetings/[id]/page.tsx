"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Video,
  Mic,
  Calendar,
  Clock,
  Timer,
  RefreshCw,
  AlertCircle,
  XCircle,
  CheckCircle2,
  PlayCircle,
  Mail,
} from "lucide-react";

import { nutriMeetingService } from "@/services/nutritionist/nutriMeeting.service";
import {
  MeetingStatus,
  MeetingType,
} from "@/enums/nutritionist/meeting/meeting.enum";
import type { MeetingDetailsResponseDTO } from "@/dtos/nutritionist/meeting/meeting-details-response.dto";

function statusPillClasses(status: MeetingStatus): string {
  switch (status) {
    case MeetingStatus.ONGOING:
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case MeetingStatus.SCHEDULED:
      return "bg-sky-50 text-sky-700 border-sky-200";
    case MeetingStatus.COMPLETED:
      return "bg-slate-100 text-slate-600 border-slate-200";
    case MeetingStatus.CANCELLED:
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

function getInitial(fullName: string): string {
  return fullName.trim().charAt(0).toUpperCase() || "?";
}

type JoinState = { kind: "joinable" } | { kind: "not-applicable" };

function getJoinState(meeting: MeetingDetailsResponseDTO): JoinState {
  if (
    meeting.status === MeetingStatus.COMPLETED ||
    meeting.status === MeetingStatus.CANCELLED
  ) {
    return { kind: "not-applicable" };
  }

  return { kind: "joinable" };
}

function JoinPanel({
  meeting,
  joinState,
  joining,
  onJoin,
}: {
  meeting: MeetingDetailsResponseDTO;
  joinState: JoinState;
  joining: boolean;
  onJoin: () => void;
}) {
  const typeLabel = meeting.type === MeetingType.VIDEO ? "Video" : "Audio";
  const TypeIcon = meeting.type === MeetingType.VIDEO ? Video : Mic;

  if (joinState.kind === "not-applicable") {
    return (
      <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-semibold text-slate-500">
        {meeting.status === MeetingStatus.COMPLETED ? (
          <>
            <CheckCircle2 size={16} />
            This session has ended
          </>
        ) : (
          <>
            <XCircle size={16} />
            This session was cancelled
          </>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onJoin}
      disabled={joining}
      className="w-full inline-flex items-center justify-center gap-2.5 bg-emerald-700 hover:bg-emerald-800 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 text-white py-4 rounded-xl font-bold text-sm shadow-xs transition-all"
    >
      {joining ? (
        <RefreshCw size={18} className="animate-spin" />
      ) : (
        <TypeIcon size={18} />
      )}
      {joining ? "Joining..." : `Join ${typeLabel} Meeting`}
    </button>
  );
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
      const res = await nutriMeetingService.getMeetingDetails(meetingId);
      setMeeting(res.data);
    } catch {
      setError(true);
      toast.error("Couldn't load session details");
    } finally {
      setLoading(false);
    }
  }, [meetingId]);

  useEffect(() => {
    loadMeeting();
  }, [loadMeeting]);

  const handleJoin = async () => {
    if (!meeting) return;
    try {
      setJoining(true);
      router.push(`/video-call/${encodeURIComponent(meeting.roomId)}`);

      toast.error("Join endpoint isn't wired up yet");
    } catch {
      toast.error("Couldn't join the session");
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <DetailsSkeleton />;

  if (error || !meeting) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 py-16 px-8 text-center max-w-md w-full">
          <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-rose-600" size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-600">
            Couldn&apos;t load this session
          </h3>
          <button
            onClick={loadMeeting}
            className="mt-4 inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 hover:-translate-y-0.5 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const joinState = getJoinState(meeting);
  const scheduledDate = new Date(meeting.scheduledAt);
  const showImage =
    meeting.user.profileImage && meeting.user.profileImage.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        <button
          type="button"
          onClick={() => router.push("/nutritionist/meetings")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-700 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to consultations
        </button>

        {/* HERO CARD */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6 sm:p-8 mb-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  meeting.type === MeetingType.VIDEO
                    ? "bg-emerald-100/80 text-emerald-700"
                    : "bg-sky-100/80 text-sky-700"
                }`}
              >
                {meeting.type === MeetingType.VIDEO ? (
                  <Video size={20} />
                ) : (
                  <Mic size={20} />
                )}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {meeting.title}
                </h1>
                <p className="text-xs font-medium text-slate-400 capitalize mt-0.5">
                  {meeting.type} session
                </p>
              </div>
            </div>
            <span
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border capitalize shrink-0 ${statusPillClasses(
                meeting.status,
              )}`}
            >
              {meeting.status}
            </span>
          </div>

          {/* JOIN CTA */}
          <JoinPanel
            meeting={meeting}
            joinState={joinState}
            joining={joining}
            onJoin={handleJoin}
          />
        </div>

        {/* SCHEDULE */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6 sm:p-8 mb-6">
          <h2 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Schedule
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <InfoTile
              icon={<Calendar size={16} />}
              label="Date"
              value={scheduledDate.toLocaleDateString([], {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            />
            <InfoTile
              icon={<Clock size={16} />}
              label="Time"
              value={scheduledDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
            <InfoTile
              icon={<Timer size={16} />}
              label="Duration"
              value={`${meeting.durationInMinutes} min`}
            />
          </div>
        </div>

        {/* CLIENT */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6 sm:p-8 mb-6">
          <h2 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Client
          </h2>
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-emerald-100/80 flex items-center justify-center border border-emerald-100">
              {showImage ? (
                <Image
                  src={meeting.user.profileImage}
                  alt={meeting.user.fullName}
                  fill
                  sizes="48px"
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <span className="text-emerald-700 font-bold text-base">
                  {getInitial(meeting.user.fullName)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">
                {meeting.user.fullName}
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate mt-0.5">
                <Mail size={12} className="shrink-0" />
                {meeting.user.email}
              </p>
            </div>
          </div>
        </div>

        {/* ACTIVITY / TIMELINE */}
        {(meeting.startedAt ||
          meeting.endedAt ||
          meeting.isCancelledByUser ||
          meeting.isCancelledByNutritionist) && (
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6 sm:p-8">
            <h2 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Activity
            </h2>
            <div className="space-y-3">
              {(meeting.isCancelledByUser ||
                meeting.isCancelledByNutritionist) && (
                <TimelineRow
                  icon={<XCircle size={15} className="text-rose-600" />}
                  label={
                    meeting.isCancelledByUser
                      ? "Cancelled by client"
                      : "Cancelled by you"
                  }
                  value={new Date(meeting.updatedAt).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                />
              )}
              {meeting.startedAt && (
                <TimelineRow
                  icon={<PlayCircle size={15} className="text-emerald-600" />}
                  label="Started"
                  value={new Date(meeting.startedAt).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                />
              )}
              {meeting.endedAt && (
                <TimelineRow
                  icon={<CheckCircle2 size={15} className="text-slate-500" />}
                  label="Ended"
                  value={new Date(meeting.endedAt).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center text-center px-3 py-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
      <span className="text-emerald-600 mb-1.5">{icon}</span>
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-xs font-bold text-slate-700 mt-0.5">{value}</p>
    </div>
  );
}

function TimelineRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between px-3.5 py-3 bg-slate-50 rounded-xl border border-slate-200/80">
      <span className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
        {icon}
        {label}
      </span>
      <span className="text-xs font-medium text-slate-400">{value}</span>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        <div className="h-4 w-40 bg-slate-200 rounded mb-6 animate-pulse" />
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 mb-6 animate-pulse">
          <div className="flex justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-200" />
              <div className="space-y-2">
                <div className="h-5 w-40 bg-slate-200 rounded" />
                <div className="h-3 w-20 bg-slate-200 rounded" />
              </div>
            </div>
            <div className="h-6 w-20 bg-slate-200 rounded-full" />
          </div>
          <div className="h-14 bg-slate-100 rounded-xl" />
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 h-32 animate-pulse mb-6" />
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 h-24 animate-pulse" />
      </div>
    </div>
  );
}
