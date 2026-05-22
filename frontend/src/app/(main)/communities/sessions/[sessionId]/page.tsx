"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  Calendar,
  Clock,
  IndianRupee,
  Loader2,
  Users,
  Video,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import {
  userSessionService,
  UserSessionDetails,
} from "@/services/user/session.service";

import { getErrorMessage } from "@/utils/errorHandler";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const d = new Date(iso);

  return {
    date: d.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),

    time: d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

function getInitials(name?: string) {
  if (!name) return "U";

  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export default function SessionDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<UserSessionDetails | null>(null);

  const [loading, setLoading] = useState(true);

  const [joining, setJoining] = useState(false);

  // ───────────────────────────────────────────────────────────

  const fetchSession = async () => {
    try {
      setLoading(true);

      const res = await userSessionService.getPublicSessionDetails(sessionId);

      setSession(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  // ───────────────────────────────────────────────────────────

  const handleJoin = async () => {
    if (!session) return;

    try {
      setJoining(true);

      if (session.type === "free") {
        await userSessionService.joinFreeSession(session.id);

        toast.success("Successfully joined session");
      } else {
        const res = await userSessionService.createPayment(session.id);

        if (res.checkoutUrl) {
          window.location.href = res.checkoutUrl;
          return;
        }
      }

      router.push(`/session-room/${session.roomId}`);
    } catch (err: unknown) {
      const message = getErrorMessage(err);

      if (message === "You have already joined this session") {
        router.push(`/session-room/${session.roomId}`);
        return;
      }

      toast.error(message);
    } finally {
      setJoining(false);
    }
  };
  // ───────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Session not found</p>
      </div>
    );
  }

  const { date, time } = formatDate(session.scheduledAt);

  const isFree = session.type === "free";

  const isFull =
    session.maxParticipants &&
    session.joinedUsersCount >= session.maxParticipants;

  // ───────────────────────────────────────────────────────────

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Back Button */}

      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Hero Card */}

      <div className="overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-xl shadow-gray-100">
        {/* Top Banner */}

        <div
          className={`h-3 w-full ${
            isFree ? "bg-emerald-500" : "bg-violet-500"
          }`}
        />

        <div className="p-8 md:p-10">
          {/* Header */}

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    isFree
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-violet-50 text-violet-700"
                  }`}
                >
                  {isFree ? (
                    <>
                      <Sparkles size={12} />
                      Free Session
                    </>
                  ) : (
                    <>
                      <IndianRupee size={12} />₹{session.price}
                    </>
                  )}
                </span>

                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold capitalize">
                  {session.status}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                {session.title}
              </h1>

              {session.description && (
                <p className="mt-4 text-gray-600 leading-relaxed text-base">
                  {session.description}
                </p>
              )}
            </div>

            {/* Join Button */}

            <div className="w-full lg:w-auto">
              <button
                onClick={handleJoin}
                disabled={joining || !!isFull}
                className={`w-full lg:w-[220px] h-14 rounded-2xl font-bold text-white transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${
                  isFree
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
                    : "bg-violet-600 hover:bg-violet-700 shadow-violet-100"
                }`}
              >
                {joining ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </span>
                ) : isFull ? (
                  "Session Full"
                ) : isFree ? (
                  "Join Free Session"
                ) : (
                  "Pay & Join"
                )}
              </button>
            </div>
          </div>

          {/* Meta */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            <div className="rounded-2xl border border-gray-100 p-5 bg-gray-50/70">
              <div className="flex items-center gap-3">
                <Calendar className="text-emerald-600" size={18} />
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Scheduled Date
                  </p>
                  <p className="font-bold text-gray-900">{date}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 p-5 bg-gray-50/70">
              <div className="flex items-center gap-3">
                <Clock className="text-emerald-600" size={18} />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Time</p>
                  <p className="font-bold text-gray-900">
                    {time} • {session.durationInMinutes} mins
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 p-5 bg-gray-50/70">
              <div className="flex items-center gap-3">
                <Users className="text-emerald-600" size={18} />
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Participants
                  </p>
                  <p className="font-bold text-gray-900">
                    {session.joinedUsersCount}
                    {session.maxParticipants
                      ? ` / ${session.maxParticipants}`
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Nutritionist */}

          <div className="mt-10 rounded-3xl border border-emerald-100 bg-emerald-50/50 p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-lg">
                {getInitials(session.nutritionist.name)}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck size={16} className="text-emerald-600" />

                  <span className="text-sm font-semibold text-emerald-700">
                    Hosted By
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  {session.nutritionist.name}
                </h3>

                <p className="text-gray-600 mt-1">
                  {session.nutritionist.email}
                </p>
              </div>
            </div>
          </div>

          {/* Participants */}

          <div className="mt-10">
            <div className="flex items-center gap-2 mb-5">
              <Users className="text-gray-700" size={18} />

              <h2 className="text-xl font-bold text-gray-900">
                Joined Participants
              </h2>
            </div>

            {session.users.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-500">
                No participants joined yet
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {session.users.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-2xl border border-gray-100 p-4 bg-white hover:border-emerald-200 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
                        {getInitials(user.name)}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          {user.name}
                        </p>

                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Session */}

          {session.status === "live" && (
            <div className="mt-10 rounded-3xl bg-gradient-to-r from-red-500 to-rose-600 p-6 text-white shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />

                    <span className="text-sm font-bold uppercase tracking-wider">
                      Live Now
                    </span>
                  </div>

                  <h3 className="text-2xl font-black">
                    Session is currently live
                  </h3>

                  <p className="text-red-100 mt-1">
                    Join the live discussion room now.
                  </p>
                </div>

                <button
                  onClick={() => router.push(`/session-room/${session.roomId}`)}
                  className="h-12 px-6 rounded-2xl bg-white text-red-600 font-bold hover:bg-red-50 transition-all inline-flex items-center justify-center gap-2"
                >
                  <Video size={18} />
                  Join Live
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
