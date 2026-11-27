
"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";

import type { RootState } from "@/redux/store";
import type { SessionRoomDetailsResponseDTO } from "@/dtos/public/session/session-room-details-response.dto";
import type { SessionRoomJoinResponseDTO } from "@/dtos/public/session/session-room-join-response.dto";
import type { MediaSettings } from "@/hooks/session-room/useMediaPreview";

import { sessionRoomService } from "@/services/public/sessionRoom.service";
import { getErrorMessage } from "@/utils/getErrorMessage";

import LeftMeetingScreen from "@/components/session/room/LeftMeetingScreen";
import PreJoinScreen from "@/components/session/room/PreJoinScreen";
import SessionUnavailable from "@/components/session/room/SessionUnavailable";

import {
  RoomConnecting,
  RoomError,
  RoomLoading,
} from "@/components/session/room/RoomStates";

import {
  isJoinableStatus,
  type LeaveReason,
} from "@/components/session/room/session-room.utils";

const ActiveSessionRoom = dynamic(
  () => import("@/components/session/room/ActiveSessionRoom"),
  { ssr: false, loading: () => <RoomConnecting /> },
);

type Phase =
  | { name: "prejoin" }
  | {
      name: "active";
      joinData: SessionRoomJoinResponseDTO;
      media: MediaSettings;
    }
  | { name: "left"; reason: LeaveReason };

function SessionRoomFlow({ roomId }: { roomId: string }) {
  const [session, setSession] =
    useState<SessionRoomDetailsResponseDTO | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>({ name: "prejoin" });

  const activeRole = useSelector(
    (state: RootState) => state.auth.user?.activeRole,
  );

  const backHref =
    activeRole === "user" ? "/user/sessions" : "/nutritionist/sessions";

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response =
          await sessionRoomService.getSessionRoomDetails(roomId);

        if (cancelled) return;

        if (!response.data) {
          throw new Error("Session details were not returned.");
        }

        setSession(response.data);
      } catch {
        if (!cancelled) {
          setLoadError("Unable to open this session. Please try again.");
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [roomId]);

  const handleJoin = useCallback(
    async (media: MediaSettings): Promise<string | null> => {
      try {
        const response = await sessionRoomService.joinSession(roomId);

        if (!response.data) {
          return "Session room details were not returned.";
        }

        setPhase({ name: "active", joinData: response.data, media });

        return null;
      } catch (err: unknown) {
        return getErrorMessage(err);
      }
    },
    [roomId],
  );

  const handleLeft = useCallback((reason: LeaveReason) => {
    setPhase({ name: "left", reason });
  }, []);

  const handleRejoin = useCallback(
    (fresh: SessionRoomDetailsResponseDTO) => {
      setSession(fresh);
      setPhase({ name: "prejoin" });
    },
    [],
  );

  if (loadError) {
    return <RoomError message={loadError} backHref={backHref} />;
  }

  if (!session) return <RoomLoading />;

  if (phase.name === "left") {
    return (
      <LeftMeetingScreen
        roomId={roomId}
        reason={phase.reason}
        backHref={backHref}
        onRejoin={handleRejoin}
      />
    );
  }

  if (phase.name === "active") {
    return (
      <ActiveSessionRoom
        session={session}
        roomId={roomId}
        token={phase.joinData.token}
        livekitUrl={phase.joinData.serverUrl}
        canPublish={phase.joinData.canPublish}
        role={phase.joinData.role}
        initialMedia={phase.media}
        onLeft={handleLeft}
      />
    );
  }

  if (!isJoinableStatus(session.status)) {
    return <SessionUnavailable status={session.status} backHref={backHref} />;
  }

  return (
    <PreJoinScreen
      title={session.title}
      status={session.status}
      nutritionistName={session.nutritionist.name}
      scheduledAt={session.scheduledAt}
      backHref={backHref}
      onJoin={handleJoin}
    />
  );
}

export default function SessionRoomClient() {
  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId;

  if (!roomId) {
    return <RoomError message="Room ID is missing." />;
  }

  return <SessionRoomFlow key={roomId} roomId={roomId} />;
}
