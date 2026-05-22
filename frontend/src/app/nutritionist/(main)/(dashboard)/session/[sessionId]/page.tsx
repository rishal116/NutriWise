"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { nutriSessionService } from "@/services/nutritionist/nutriSession.service";
import { Session, ActionResponse } from "@/dtos/nutritionist/session.dto";
import {
  Loader2,
  Video,
  Clock,
  Users,
  DollarSign,
  CalendarDays,
  ArrowLeft,
  Ban,
  Play,
  Square,
  Tag,
  Radio,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  scheduled: {
    label: "Scheduled",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-100",
    dot: "bg-emerald-500",
  },
  upcoming: {
    label: "Scheduled",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-100",
    dot: "bg-emerald-500",
  },
  live: {
    label: "Live Now",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-100",
    dot: "bg-rose-500",
  },
  ongoing: {
    label: "Live Now",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-100",
    dot: "bg-rose-500",
  },
  completed: {
    label: "Completed",
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-100",
    dot: "bg-red-400",
  },
};

const getStatusCfg = (s: string) =>
  STATUS_CONFIG[s?.toLowerCase()] ?? {
    label: s,
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
  };

// ─── Meta item ─────────────────────────────────────────────────────────────────

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={14} className="text-emerald-600" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

// ─── Loading screen ────────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <Loader2 size={28} className="animate-spin text-emerald-500" />
      <p className="text-sm font-semibold text-slate-400">Loading session…</p>
    </div>
  );
}

// ─── Not found ─────────────────────────────────────────────────────────────────

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
        <XCircle size={24} className="text-slate-400" />
      </div>
      <p className="text-sm font-bold text-slate-600">Session not found</p>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function ManageSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSession = useCallback(async () => {
    try {
      setLoading(true);
      const res = await nutriSessionService.getSessionDetails(sessionId);
      setSession(res.data);
    } catch {
      toast.error("Failed to load session details");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    fetchSession();
  }, [fetchSession, sessionId]);

  const handleAction = async (
    action: () => Promise<void | Session | ActionResponse>,
    successMsg: string,
  ) => {
    try {
      setActionLoading(true);
      await action();
      toast.success(successMsg);
      await fetchSession();
      return true;
    } catch (err: unknown) {
      let msg = "Action failed";
      if (err instanceof Error) msg = err.message;
      else if (typeof err === "object" && err !== null && "message" in err)
        msg = String((err as { message: unknown }).message);
      toast.error(msg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (!session) return <NotFound />;

  const status = session.status?.toLowerCase();
  const isLive = status === "live" || status === "ongoing";
  const isScheduled = status === "upcoming" || status === "scheduled";
  const isCompleted = status === "completed";
  const isCancelled = status === "cancelled";
  const isFree = session.price === 0;
  const statusCfg = getStatusCfg(session.status);
  const date = new Date(session.scheduledAt);

  return (
    <div className="space-y-6">

      {/* Back */}
      <button
        onClick={() => router.push("/nutritionist/session")}
        className="group flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors text-sm font-medium"
      >
        <ArrowLeft
          size={15}
          className="group-hover:-translate-x-0.5 transition-transform"
        />
        Back to Sessions
      </button>

      {/* Hero card */}
      <div
        className={`relative rounded-2xl border overflow-hidden ${
          isLive
            ? "bg-gradient-to-br from-rose-50 to-white border-rose-100"
            : "bg-white border-slate-200"
        }`}
      >
        {/* Live pulse ring */}
        {isLive && (
          <div className="absolute top-6 right-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
            </span>
          </div>
        )}

        <div className="p-6 sm:p-8">
          {/* Status badge */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider mb-4 ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
          >
            {isLive ? (
              <Radio size={12} />
            ) : isCompleted ? (
              <CheckCircle2 size={12} />
            ) : isCancelled ? (
              <XCircle size={12} />
            ) : (
              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
            )}
            {statusCfg.label}
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
            {session.title}
          </h1>

          {session.description && (
            <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
              {session.description}
            </p>
          )}

          {/* Type pill */}
          <div className="flex items-center gap-2 mt-4">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                isFree
                  ? "bg-sky-50 text-sky-700 border-sky-100"
                  : "bg-amber-50 text-amber-700 border-amber-100"
              }`}
            >
              <Tag size={10} />
              {isFree ? "Free Session" : `Paid · $${session.price}`}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-100">
              <Video size={10} />
              Video
            </span>
          </div>
        </div>
      </div>

      {/* Meta grid */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Session Details
          </span>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <MetaItem
            icon={CalendarDays}
            label="Date & Time"
            value={date.toLocaleString([], {
              dateStyle: "long",
              timeStyle: "short",
            })}
          />
          <MetaItem
            icon={Clock}
            label="Duration"
            value={`${session.durationInMinutes} minutes`}
          />
          <MetaItem
            icon={Users}
            label="Capacity"
            value={
              session.maxParticipants
                ? `${session.maxParticipants} participants`
                : "Unlimited"
            }
          />
          <MetaItem
            icon={DollarSign}
            label="Pricing"
            value={isFree ? "Free access" : `$${session.price} per entry`}
          />
        </div>
      </div>

      {/* Actions */}
      {!isCompleted && !isCancelled && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Actions
            </span>
          </div>
          <div className="p-6 space-y-3">

            {/* Start session */}
            {isScheduled && (
              <button
                onClick={() =>
                  handleAction(
                    () => nutriSessionService.startSession(session.id),
                    "Session is now live!",
                  )
                }
                disabled={actionLoading}
                className="w-full flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-200/50 active:scale-[0.99]"
              >
                {actionLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Play size={16} fill="currentColor" />
                    Start Live Session
                  </>
                )}
              </button>
            )}

            {/* Join room */}
            {isLive && (
              <button
                onClick={async () => {
                  router.push(`/session-room/${session.roomId}`);
                }}
                disabled={actionLoading}
                className="w-full flex items-center justify-center gap-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-rose-200/50 active:scale-[0.99]"
              >
                <ExternalLink size={16} />
                Join Session Room
              </button>
            )}

            {/* End session */}
            {isLive && (
              <button
                onClick={() =>
                  handleAction(
                    () => nutriSessionService.endSession(session.id),
                    "Session ended",
                  )
                }
                disabled={actionLoading}
                className="w-full flex items-center justify-center gap-2.5 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed text-slate-700 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.99]"
              >
                {actionLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Square size={16} fill="currentColor" />
                    End Session
                  </>
                )}
              </button>
            )}

            {/* Cancel */}
            {!isLive && (
              <button
                onClick={() =>
                  handleAction(
                    () => nutriSessionService.cancelSession(session.id),
                    "Session cancelled",
                  )
                }
                disabled={actionLoading}
                className="w-full flex items-center justify-center gap-2.5 bg-white border border-rose-100 hover:bg-rose-50 disabled:opacity-60 disabled:cursor-not-allowed text-rose-600 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.99]"
              >
                {actionLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Ban size={16} />
                    Cancel Session
                  </>
                )}
              </button>
            )}

            <p className="text-center text-[11px] text-slate-400 font-medium pt-1">
              Actions update the client portal in real-time.
            </p>
          </div>
        </div>
      )}

      {/* Completed / Cancelled state */}
      {(isCompleted || isCancelled) && (
        <div
          className={`rounded-2xl border p-6 text-center ${
            isCompleted
              ? "bg-slate-50 border-slate-200"
              : "bg-red-50 border-red-100"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 ${
              isCompleted ? "bg-slate-200" : "bg-red-100"
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 size={18} className="text-slate-500" />
            ) : (
              <XCircle size={18} className="text-red-500" />
            )}
          </div>
          <p className="text-sm font-bold text-slate-700">
            {isCompleted ? "This session has ended." : "This session was cancelled."}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {isCompleted
              ? "No further actions are available."
              : "You can create a new session from the sessions page."}
          </p>
        </div>
      )}
    </div>
  );
}