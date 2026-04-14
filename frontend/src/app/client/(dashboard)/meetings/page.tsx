"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { userMeetService } from "@/services/user/userMeet.service";
import {
  Video,
  User,
  Clock,
  ArrowRight,
  Calendar,
  CheckCircle2,
  History,
  Inbox,
  Loader2,
  XCircle,
} from "lucide-react";

/* ── TYPES ── */
interface Meeting {
  id: string;
  title: string;
  roomId: string;
  scheduledAt: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  userId: string;
  nutritionist: {
    fullName: string;
    email: string;
  };
}

type TabType = "upcoming" | "history";

/* ── STATUS CONFIG ── */
const statusBadge: Record<string, string> = {
  ongoing:   "bg-emerald-500 text-white border-emerald-400",
  scheduled: "bg-emerald-50  text-emerald-700 border-emerald-200",
  completed: "bg-gray-100    text-gray-500   border-gray-200",
  cancelled: "bg-red-50      text-red-500    border-red-100",
};

/* ── COUNTDOWN HOOK ──
   Returns { label, canJoin }
   - canJoin: true when ≤ 15 min before or ongoing
   - label:   "2h 34m", "14m 30s", "Join Session", etc.
─────────────────────────────────────────── */
const EARLY_JOIN_MS = 15 * 60 * 1000; // 15 minutes

function useCountdown(scheduledAt: string, isOngoing: boolean) {
  const [now, setNow] = useState(() => Date.now());
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    ref.current = setInterval(() => setNow(Date.now()), 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, []);

  if (isOngoing) return { label: "Join Live", canJoin: true };

  const target  = new Date(scheduledAt).getTime();
  const diff    = target - now;           // ms until meeting

  if (diff <= 0) return { label: "Join Session", canJoin: true };

  const canJoin = diff <= EARLY_JOIN_MS;

  if (diff < 60_000) {
    const s = Math.ceil(diff / 1000);
    return { label: `${s}s`, canJoin };
  }
  if (diff < 3_600_000) {
    const m = Math.floor(diff / 60_000);
    const s = Math.floor((diff % 60_000) / 1000);
    return { label: `${m}m ${s}s`, canJoin };
  }
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  return { label: `${h}h ${m}m`, canJoin };
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function MeetingsPage() {
  const [meetings,  setMeetings]  = useState<Meeting[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const router = useRouter();

  useEffect(() => {
    async function fetchMeetings() {
      try {
        setLoading(true);
        const res  = await userMeetService.getMeetings();
        const data = Array.isArray(res) ? res : res?.data ?? [];
        setMeetings(data);
      } catch (err) {
        console.error("Error fetching meetings", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMeetings();
  }, []);

  const filteredMeetings = useMemo(() => {
    return meetings
      .filter((m) =>
        activeTab === "upcoming"
          ? m.status === "scheduled" || m.status === "ongoing"
          : m.status === "completed" || m.status === "cancelled"
      )
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      );
  }, [meetings, activeTab]);

  const upcomingCount = meetings.filter(
    (m) => m.status === "scheduled" || m.status === "ongoing"
  ).length;

  const handleJoin = (roomId: string) => router.push(`/video-call/${roomId}`);

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-3">
          <Loader2 className="w-9 h-9 text-emerald-500 animate-spin mx-auto" />
          <p className="text-emerald-700 font-semibold text-sm tracking-wide">
            Loading your schedule…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans pb-12 space-y-6">

      {/* ── PAGE HEADER ── */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl px-7 py-9 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-14 -mt-14 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full -ml-8 -mb-8 blur-2xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Consultation Schedule
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-1">
            My Meetings
          </h1>
          <p className="text-white/70 text-sm font-medium">
            Track and join your nutrition consultations
          </p>

          {/* Summary pills */}
          {meetings.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {upcomingCount > 0 && (
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold">
                  <Calendar size={12} className="flex-shrink-0" />
                  {upcomingCount} Upcoming
                </div>
              )}
              {meetings.filter((m) => m.status === "completed").length > 0 && (
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold">
                  <CheckCircle2 size={12} className="flex-shrink-0" />
                  {meetings.filter((m) => m.status === "completed").length} Completed
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 bg-gray-50">
          {(
            [
              { key: "upcoming", label: "Upcoming",      icon: <Calendar size={14} />, count: upcomingCount },
              { key: "history",  label: "Past Sessions", icon: <History  size={14} />, count: undefined     },
            ] satisfies { key: TabType; label: string; icon: React.ReactNode; count: number | undefined }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-all ${
                activeTab === tab.key
                  ? "bg-white border-b-2 border-emerald-500 text-emerald-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    activeTab === tab.key
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── CONTENT ── */}
        <div className="p-5">
          {filteredMeetings.length === 0 ? (
            <EmptyState type={activeTab} />
          ) : (
            <div className="space-y-3">
              {filteredMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onJoin={handleJoin}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MEETING CARD
───────────────────────────────────────── */
function MeetingCard({
  meeting,
  onJoin,
}: {
  meeting: Meeting;
  onJoin: (id: string) => void;
}) {
  const isOngoing   = meeting.status === "ongoing";
  const isPast      = meeting.status === "completed" || meeting.status === "cancelled";
  const isCancelled = meeting.status === "cancelled";
  const dateObj     = new Date(meeting.scheduledAt);

  const { label: countdownLabel, canJoin } = useCountdown(
    meeting.scheduledAt,
    isOngoing
  );

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border transition-all duration-200 ${
        isOngoing
          ? "bg-emerald-50 border-emerald-200"
          : "bg-gray-50 border-gray-100 hover:border-emerald-200 hover:bg-white"
      }`}
    >
      {/* Left: date tile + info */}
      <div className="flex items-start gap-4">
        {/* Date tile */}
        <div
          className={`flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center border ${
            isOngoing
              ? "bg-emerald-600 border-emerald-500 text-white"
              : "bg-white border-gray-100 text-gray-900"
          }`}
        >
          <span
            className={`text-[9px] font-black uppercase tracking-widest leading-none mb-0.5 ${
              isOngoing ? "text-white/70" : "text-emerald-600"
            }`}
          >
            {dateObj.toLocaleDateString("en-IN", { month: "short" })}
          </span>
          <span className="text-xl font-black leading-none">
            {dateObj.getDate()}
          </span>
        </div>

        {/* Info */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h2 className="text-base font-extrabold text-gray-900 truncate">
              {meeting.title}
            </h2>
            <span
              className={`flex-shrink-0 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                statusBadge[meeting.status] ?? "bg-gray-100 text-gray-500 border-gray-200"
              } ${isOngoing ? "animate-pulse" : ""}`}
            >
              {meeting.status}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <User size={12} className="text-emerald-500 flex-shrink-0" />
              {meeting.nutritionist.fullName}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <Clock size={12} className="text-emerald-500 flex-shrink-0" />
              {dateObj.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Right: action */}
      {!isPast ? (
        <div className="flex-shrink-0 w-full sm:w-auto flex flex-col items-stretch sm:items-end gap-1.5">
          {/* Countdown label — only shown when not yet joinable */}
          {!canJoin && (
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-100 px-4 py-2 rounded-xl border border-gray-100">
              <Clock size={13} className="text-emerald-500 flex-shrink-0" />
              Starts in&nbsp;
              <span className="font-black text-gray-800 tabular-nums">
                {countdownLabel}
              </span>
            </div>
          )}

          {/* Join button — enabled only when canJoin */}
          <button
            onClick={() => canJoin && onJoin(meeting.roomId)}
            disabled={!canJoin}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              !canJoin
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : isOngoing
                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-emerald-100 hover:shadow-md"
                : "bg-gray-900 text-white hover:bg-emerald-600 shadow-sm"
            }`}
          >
            <Video size={14} className="flex-shrink-0" />
            {isOngoing ? "Join Live" : "Join Session"}
            {canJoin && <ArrowRight size={13} className="flex-shrink-0" />}
          </button>

          {/* Early-join hint */}
          {canJoin && !isOngoing && (
            <p className="text-[10px] text-emerald-600 font-semibold text-center">
              Room is open — meeting starts soon
            </p>
          )}
        </div>
      ) : (
        <div
          className={`flex-shrink-0 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border ${
            isCancelled
              ? "bg-red-50 text-red-400 border-red-100"
              : "bg-gray-100 text-gray-400 border-gray-200"
          }`}
        >
          {isCancelled ? (
            <XCircle size={13} className="flex-shrink-0" />
          ) : (
            <CheckCircle2 size={13} className="flex-shrink-0" />
          )}
          {isCancelled ? "Cancelled" : "Completed"}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────── */
function EmptyState({ type }: { type: TabType }) {
  return (
    <div className="text-center py-14">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-50 rounded-full mb-4">
        {type === "upcoming" ? (
          <Inbox className="text-gray-200" size={24} />
        ) : (
          <History className="text-gray-200" size={24} />
        )}
      </div>
      <h3 className="text-base font-extrabold text-gray-900 mb-1.5">
        {type === "upcoming" ? "All Caught Up!" : "No History Yet"}
      </h3>
      <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
        {type === "upcoming"
          ? "No sessions scheduled right now. Time to focus on your meal plan!"
          : "Your completed consultations will appear here for your records."}
      </p>
    </div>
  );
}