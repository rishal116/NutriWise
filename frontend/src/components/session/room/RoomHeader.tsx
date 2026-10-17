import { Users, WifiOff } from "lucide-react";

import type {
  SessionLifecycleAction,
  SessionStatus,
} from "@/hooks/useSessionLifecycle";

interface RoomHeaderProps {
  title: string;
  status: SessionStatus;
  role: "host" | "participant";
  participantCount: number;
  isReconnecting: boolean;
  pendingAction: SessionLifecycleAction | null;
  canStart: boolean;
  canEnd: boolean;
  onStart: () => void;
  onEnd: () => void;
}

function formatStatus(status: SessionStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function RoomHeader({
  title,
  status,
  role,
  participantCount,
  isReconnecting,
  pendingAction,
  canStart,
  canEnd,
  onStart,
  onEnd,
}: RoomHeaderProps) {
  const isLive = status === "live";
  const isBusy = pendingAction !== null;

  const dotColor = isLive
    ? "bg-red-500"
    : status === "scheduled"
      ? "bg-sky-400"
      : "bg-gray-500";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] px-3 sm:px-5">
      <div className="min-w-0">
        <h1 className="truncate text-sm font-semibold sm:text-base">{title}</h1>

        <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              {isLive && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${dotColor}`}
              />
            </span>
            {formatStatus(status)}
          </span>

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-gray-300">
            {role === "host" ? "Host" : "Participant"}
          </span>

          {isReconnecting && (
            <span className="flex items-center gap-1 text-amber-400">
              <WifiOff className="h-3 w-3" />
              Reconnecting…
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {canStart && (
          <button
            type="button"
            onClick={onStart}
            disabled={isBusy}
            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pendingAction === "start" ? "Starting…" : "Start Session"}
          </button>
        )}

        {canEnd && (
          <button
            type="button"
            onClick={onEnd}
            disabled={isBusy}
            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pendingAction === "end" ? "Ending…" : "End Session"}
          </button>
        )}

        <div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-gray-300">
          <Users className="h-3.5 w-3.5" />
          {participantCount}
        </div>
      </div>
    </header>
  );
}