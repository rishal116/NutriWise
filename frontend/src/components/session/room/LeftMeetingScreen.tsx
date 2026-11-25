"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, PhoneOff } from "lucide-react";

import type { SessionRoomDetailsResponseDTO } from "@/dtos/public/session/session-room-details-response.dto";
import {
  getUnavailableMessage,
  isJoinableStatus,
  type LeaveReason,
} from "@/components/session/room/session-room.utils";
import { sessionRoomService } from "@/services/public/sessionRoom.service";

interface LeftMeetingScreenProps {
  roomId: string;
  reason: LeaveReason;
  backHref: string;
  onRejoin: (session: SessionRoomDetailsResponseDTO) => void;
}

type Availability =
  | { kind: "checking" }
  | { kind: "available"; session: SessionRoomDetailsResponseDTO }
  | { kind: "unavailable"; session: SessionRoomDetailsResponseDTO }
  | { kind: "error" };

const COPY: Record<LeaveReason, { title: string; message: string }> = {
  left: {
    title: "You left the meeting",
    message: "You can rejoin while the session is still open.",
  },
  ended: {
    title: "You ended the session",
    message: "The session has ended for everyone.",
  },
  disconnected: {
    title: "You were disconnected",
    message: "The connection to the meeting was lost.",
  },
};

export default function LeftMeetingScreen({
  roomId,
  reason,
  backHref,
  onRejoin,
}: LeftMeetingScreenProps) {
  const [availability, setAvailability] = useState<Availability>({
    kind: "checking",
  });
  const [attempt, setAttempt] = useState(0);

  // Always re-check: the status cached before the call is stale by now.
  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const response = await sessionRoomService.getSessionRoomDetails(roomId);

        if (cancelled) return;

        if (!response.data) {
          setAvailability({ kind: "error" });
          return;
        }

        setAvailability(
          isJoinableStatus(response.data.status)
            ? { kind: "available", session: response.data }
            : { kind: "unavailable", session: response.data },
        );
      } catch {
        if (!cancelled) setAvailability({ kind: "error" });
      }
    };

    void check();

    return () => {
      cancelled = true;
    };
  }, [roomId, attempt]);

  const retry = () => {
    setAvailability({ kind: "checking" });
    setAttempt((value) => value + 1);
  };

  const { title, message } = COPY[reason];

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#0a0a0f] px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
          <PhoneOff className="h-6 w-6 text-red-400" />
        </div>

        <h1 className="mt-5 text-xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-gray-400">{message}</p>

        {availability.kind === "unavailable" && (
          <p className="mt-3 text-sm text-amber-400" role="status">
            {getUnavailableMessage(availability.session.status).message}
          </p>
        )}

        {availability.kind === "error" && (
          <p className="mt-3 text-sm text-amber-400" role="alert">
            Couldn&apos;t check whether the session is still open.
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {availability.kind === "checking" && (
            <button
              type="button"
              disabled
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold opacity-50"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking…
            </button>
          )}

          {availability.kind === "available" && (
            <button
              type="button"
              onClick={() => onRejoin(availability.session)}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-emerald-500 active:scale-95"
            >
              Rejoin meeting
            </button>
          )}

          {availability.kind === "error" && (
            <button
              type="button"
              onClick={retry}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-emerald-500 active:scale-95"
            >
              Try again
            </button>
          )}

          <Link
            href={backHref}
            className="flex items-center gap-2 rounded-xl bg-white/[0.06] px-5 py-2.5 text-sm font-semibold transition hover:bg-white/[0.1] active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to session
          </Link>
        </div>
      </div>
    </div>
  );
}