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
  Calendar,
  ArrowLeft,
  Ban,
  Play,
  Square,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

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
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to load session details");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    fetchSession();
  }, [fetchSession, sessionId]);

  useEffect(() => {
    if (session?.status?.toLowerCase() === "live") {
      router.push(`/session-room/${session.roomId}`);
    }
  }, [session, router]);

  /**
   * Safe Action Handler
   * Replaced 'any' with a structured error check
   */
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
      let errorMessage = "Action failed";

      // Type-safe error handling
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null && "message" in err) {
        errorMessage = String((err as { message: unknown }).message);
      }

      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
        <p className="text-slate-500 font-bold animate-pulse">
          Loading Session...
        </p>
      </div>
    );
  }

  if (!session)
    return (
      <p className="text-center text-slate-500 mt-20">Session not found</p>
    );

  const status = session.status?.toLowerCase();
  const isLive = status === "live";
  const isScheduled = status === "upcoming" || status === "scheduled";
  const isCompleted = status === "completed";

  return (
    <div className="max-w-3xl mx-auto pb-20 px-4 md:px-0">
      <Toaster position="top-center" />

      <button
        onClick={() => router.push("/nutritionist/session")}
        className="group flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-6 transition-colors font-medium text-sm"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to Dashboard
      </button>

      {/* HEADER CARD */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-emerald-900">
          <ShieldCheck size={140} />
        </div>
        <div className="relative z-10">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4 border ${
              isLive
                ? "bg-rose-50 text-rose-700 border-rose-100 animate-pulse"
                : "bg-emerald-50 text-emerald-700 border-emerald-100"
            }`}
          >
            <Sparkles size={14} /> {session.status}
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            {session.title}
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed max-w-xl">
            {session.description || "No description provided for this session."}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* LOGISTICS SECTION */}
        <section className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/30">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={16} className="text-emerald-500" /> Session
              Metadata
            </h2>
          </div>
          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Date & Time
              </span>
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Video size={18} className="text-emerald-500" />
                {new Date(session.scheduledAt).toLocaleString([], {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Duration
              </span>
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Clock size={18} className="text-emerald-500" />
                {session.durationInMinutes} Minutes
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Capacity
              </span>
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Users size={18} className="text-emerald-500" />
                {session.maxParticipants ?? "Unlimited"} Participants
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Pricing Model
              </span>
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <DollarSign size={18} className="text-emerald-500" />
                {session.price === 0
                  ? "Free Access"
                  : `$${session.price} Per Entry`}
              </div>
            </div>
          </div>
        </section>

        {/* CONTROLS SECTION */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isScheduled && (
              <button
                onClick={() =>
                  handleAction(
                    () => nutriSessionService.startSession(session.id),
                    "Session is now LIVE!",
                  )
                }
                disabled={actionLoading}
                className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white py-4 rounded-2xl font-black text-[15px] shadow-xl shadow-emerald-200/50 transition-all active:scale-[0.99]"
              >
                {actionLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Play size={20} fill="currentColor" /> Start Live Session
                  </>
                )}
              </button>
            )}

            {isLive && (
              <button
                onClick={async () => {
                  const success = await handleAction(
                    () => nutriSessionService.startSession(session.id),
                    "Session is now LIVE!",
                  );

                  if (success) {
                    router.push(`/session-room/${session.roomId}`);
                  }
                }}
                disabled={actionLoading}
                className="flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white py-4 rounded-2xl font-black text-[15px] shadow-xl shadow-amber-200/50 transition-all active:scale-[0.99]"
              >
                {actionLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Square size={20} fill="currentColor" /> End Session
                  </>
                )}
              </button>
            )}

            {!isLive && !isCompleted && (
              <button
                onClick={() =>
                  handleAction(
                    () => nutriSessionService.cancelSession(session.id),
                    "Session has been cancelled",
                  )
                }
                disabled={actionLoading}
                className="flex items-center justify-center gap-3 bg-white border-2 border-rose-100 text-rose-600 hover:bg-rose-50 disabled:opacity-50 py-4 rounded-2xl font-black text-[15px] transition-all"
              >
                {actionLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Ban size={20} /> Cancel Session
                  </>
                )}
              </button>
            )}
          </div>

          <p className="text-center text-[12px] font-bold text-slate-400 uppercase tracking-tighter">
            Actions performed here update the client portal in real-time.
          </p>
        </div>
      </div>
    </div>
  );
}
