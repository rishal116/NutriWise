"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { nutriSessionService } from "@/services/nutritionist/nutriSession.service";
import { Session } from "@/dtos/nutritionist/session.dto";
import {
  CalendarDays,
  Video,
  User,
  Clock,
  ChevronRight,
  Plus,
  Loader2,
  Tag,
} from "lucide-react";

export default function MySessionsPage() {
  const router = useRouter();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadSessions = useCallback(
    async (isInitial = false) => {
      if (loading || (!hasMore && !isInitial)) return;

      try {
        setLoading(true);
        const pageToFetch = isInitial ? 1 : page;
        const res = await nutriSessionService.getMySessions(pageToFetch, 10);

        setSessions((prev) =>
          pageToFetch === 1 ? res.data : [...prev, ...res.data],
        );
        setHasMore(res.pagination.hasMore);
        setPage(pageToFetch + 1);
      } catch (err) {
        console.error("Error loading sessions", err);
      } finally {
        setLoading(false);
      }
    },
    [page, loading, hasMore],
  );

  useEffect(() => {
    loadSessions(true);
  }, [loadSessions]);

  const getStatusConfig = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "upcoming")
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (s === "live" || s === "ongoing")
      return "bg-rose-50 text-rose-700 border-rose-100 animate-pulse";
    return "bg-slate-50 text-slate-500 border-slate-200";
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Sessions
          </h1>
          <p className="text-[14px] font-medium text-slate-500">
            Monitor and manage your upcoming video consultations.
          </p>
        </div>

        <button
          onClick={() => router.push("/nutritionist/session/create")}
          className="flex items-center justify-center gap-2.5 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-[13px] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200/40"
        >
          <Plus size={18} strokeWidth={3} />
          Create Session
        </button>
      </div>

      {/* SESSION LIST */}
      <div className="grid gap-6">
        {sessions.map((s) => {
          const isFree = s.price === 0;

          return (
            <div
              key={s.id}
              className="group bg-white rounded-2xl border border-slate-200/70 overflow-hidden hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row">
                {/* DATE SIDEBAR */}
                <div className="lg:w-28 bg-slate-50/40 border-b lg:border-b-0 lg:border-r border-slate-100 flex lg:flex-col items-center justify-center p-5 gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    {new Date(s.scheduledAt).toLocaleDateString(undefined, {
                      month: "short",
                    })}
                  </span>
                  <span className="text-4xl font-black text-slate-900 leading-none">
                    {new Date(s.scheduledAt).getDate()}
                  </span>
                  <span className="text-[12px] font-bold text-emerald-600">
                    {new Date(s.scheduledAt).toLocaleDateString(undefined, {
                      weekday: "short",
                    })}
                  </span>
                </div>

                {/* MAIN CONTENT */}
                <div className="flex-1 p-6 lg:p-7">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Status Badge */}
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusConfig(s.status)}`}
                        >
                          {s.status}
                        </span>

                        {/* Free/Paid Badge */}
                        <span
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                            isFree
                              ? "bg-blue-50 text-blue-700 border-blue-100"
                              : "bg-amber-50 text-amber-700 border-amber-100"
                          }`}
                        >
                          <Tag size={12} />{" "}
                          {isFree ? "Free Session" : "Paid Session"}
                        </span>

                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-100">
                          <Video size={12} /> Video
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {s.title}
                      </h2>
                      {s.description && (
                        <p className="text-[14px] text-slate-500 line-clamp-2 leading-relaxed max-w-2xl">
                          {s.description}
                        </p>
                      )}
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 min-w-[120px] text-center md:text-right border border-slate-100">
                      <p
                        className={`text-2xl font-black ${isFree ? "text-blue-600" : "text-slate-900"}`}
                      >
                        {isFree ? "FREE" : `$${s.price}`}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        {isFree ? "Open Access" : "Entry Fee"}
                      </p>
                    </div>
                  </div>

                  {/* DETAILS FOOTER */}
                  <div className="flex flex-wrap items-center gap-y-4 gap-x-8 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <Clock size={18} className="text-emerald-500" />
                      <span className="text-[13.5px] font-bold">
                        {s.durationInMinutes} Mins
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-slate-600">
                      <CalendarDays size={18} className="text-emerald-500" />
                      <span className="text-[13.5px] font-bold">
                        {new Date(s.scheduledAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {s.maxParticipants && (
                      <div className="flex items-center gap-2.5 text-slate-600">
                        <User size={18} className="text-emerald-500" />
                        <span className="text-[13.5px] font-bold">
                          {s.maxParticipants} Capacity
                        </span>
                      </div>
                    )}

                    <button
                      onClick={() =>
                        router.push(`/nutritionist/session/${s.id}`)
                      }
                      className="ml-auto group/btn flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-[13px] hover:bg-emerald-600 hover:text-white transition-all"
                    >
                      Manage
                      <ChevronRight
                        size={16}
                        className="group-hover/btn:translate-x-0.5 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LOAD MORE */}
      {hasMore && (
        <div className="flex justify-center pt-10">
          <button
            onClick={() => loadSessions()}
            disabled={loading}
            className="flex items-center gap-3 px-10 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold text-[14px] hover:border-emerald-200 hover:text-emerald-700 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              "Load More Sessions"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
