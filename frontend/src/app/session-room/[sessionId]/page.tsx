"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { publicSessionService } from "@/services/public/publicSession.service";
import type { PublicSessionDetailsResponseDTO } from "@/dtos/public/session/public-session-details-response.dto";
import type { SessionRoomJoinResponseDTO } from "@/dtos/public/session/session-room-join-response.dto";

import ActiveSessionRoom from "@/components/session/room/ActiveSessionRoom";
import {
  RoomError,
  RoomLoading,
  getSessionPagePath,
} from "@/components/session/room/RoomStates";

type RoomLoadResult =
  | {
      sessionId: string;
      session: PublicSessionDetailsResponseDTO;
      joinData: SessionRoomJoinResponseDTO;
    }
  | { sessionId: string; error: string };

export default function SessionRoomPage() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;

  const [result, setResult] = useState<RoomLoadResult | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    const loadRoom = async () => {
      try {
        const sessionResponse =
          await publicSessionService.getSessionDetails(sessionId);

        if (cancelled) return;

        if (!sessionResponse.data) {
          throw new Error("Session details were not returned.");
        }

        const joinResponse = await publicSessionService.joinSession(sessionId);

        if (cancelled) return;

        if (!joinResponse.data) {
          throw new Error("Session room details were not returned.");
        }

        setResult({
          sessionId,
          session: sessionResponse.data,
          joinData: joinResponse.data,
        });
      } catch {
        if (cancelled) return;

        setResult({
          sessionId,
          error: "Unable to enter this session. Please try again.",
        });
      }
    };

    void loadRoom();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (!sessionId) {
    return <RoomError message="Session ID is missing." />;
  }

  // A result for a previous session ID counts as still loading.
  const current = result && result.sessionId === sessionId ? result : null;

  if (!current) {
    return <RoomLoading />;
  }

  if ("error" in current) {
    return (
      <RoomError
        message={current.error}
        backHref={getSessionPagePath(sessionId)}
      />
    );
  }

  return (
    <ActiveSessionRoom
      key={sessionId}
      session={current.session}
      sessionId={sessionId}
      token={current.joinData.token}
      livekitUrl={current.joinData.serverUrl}
      canPublish={current.joinData.canPublish}
      role={current.joinData.role}
    />
  );
}
