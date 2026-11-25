
"use client";

import { DoorOpen } from "lucide-react";
import { useRouter } from "next/navigation";

interface SessionMeetingRoomProps {
  roomId?: string | null;
}

export default function SessionMeetingRoom({
  roomId,
}: SessionMeetingRoomProps) {
  const router = useRouter();

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
      <div className="flex items-center gap-2.5">
        <span className="h-5 w-1 rounded-full bg-emerald-600" />
        <h2 className="text-base font-bold tracking-tight text-slate-900">
          Meeting Room
        </h2>
      </div>

      {roomId ? (
        <button
          type="button"
          onClick={() => router.push(`/session-room/${roomId}`)}
          className="mt-4 flex w-full items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-left transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-700">
            <DoorOpen className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Room ID
            </p>

            <code className="block truncate text-xs font-semibold text-emerald-700">
              {roomId}
            </code>
          </div>

          <span className="shrink-0 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white">
            Enter
          </span>
        </button>
      ) : (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-slate-200 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
            <DoorOpen className="h-4 w-4" />
          </div>

          <p className="text-xs font-medium text-slate-500">
            No room assigned yet — created automatically when the session
            goes live.
          </p>
        </div>
      )}
    </section>
  );
}
