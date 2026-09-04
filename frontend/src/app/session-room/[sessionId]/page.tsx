"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Mic,
  MicOff,
  PhoneOff,
  Users,
  Video,
  VideoOff,
  WifiOff,
} from "lucide-react";
import { Room, RoomEvent, type RemoteParticipant } from "livekit-client";

import { publicSessionService } from "@/services/public/publicSession.service";
import { PublicSessionDetailsResponseDTO } from "@/dtos/public/session/public-session-details-response.dto";
import { SessionRoomJoinResponseDTO } from "@/dtos/public/session/session-room-join-response.dto";

import LiveKitLocalVideo from "@/components/common/LiveKitLocalVideo";
import LiveKitRemoteVideo from "@/components/common/LiveKitRemoteVideo";

export default function SessionRoomPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [session, setSession] =
    useState<PublicSessionDetailsResponseDTO | null>(null);
  const [joinData, setJoinData] = useState<SessionRoomJoinResponseDTO | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    const loadRoom = async () => {
      try {
        setLoading(true);
        setError(null);

        const sessionResponse =
          await publicSessionService.getSessionDetails(sessionId);
        if (cancelled) return;
        setSession(sessionResponse.data);

        const joinResponse = await publicSessionService.joinSession(sessionId);
        if (cancelled) return;
        setJoinData(joinResponse.data);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load session room:", err);
        setError("Unable to enter this session.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadRoom();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (loading) {
    return <RoomLoading />;
  }

  if (error || !session || !joinData) {
    return (
      <RoomError
        message={error || "This session is not available."}
        sessionId={sessionId}
      />
    );
  }

  return (
    <ActiveSessionRoom
      session={session}
      sessionId={sessionId}
      token={joinData.token}
      livekitUrl={joinData.serverUrl}
      canPublish={joinData.canPublish}
    />
  );
}

interface ActiveSessionRoomProps {
  session: PublicSessionDetailsResponseDTO;
  sessionId: string;
  token: string;
  livekitUrl: string;
  canPublish: boolean;
}

function ActiveSessionRoom({
  session,
  sessionId,
  token,
  livekitUrl,
  canPublish,
}: ActiveSessionRoomProps) {
  const router = useRouter();

  const [room, setRoom] = useState<Room | null>(null);
  const [connected, setConnected] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const [remoteParticipants, setRemoteParticipants] = useState<
    RemoteParticipant[]
  >([]);

  useEffect(() => {
    const liveKitRoom = new Room();
    let cancelled = false;

    const updateParticipants = () => {
      if (cancelled) return;
      setRemoteParticipants(
        Array.from(liveKitRoom.remoteParticipants.values()),
      );
    };

    const handleConnected = () => {
      if (cancelled) return;
      setConnected(true);
      setConnectError(null);
      updateParticipants();
    };

    const handleDisconnected = () => {
      if (cancelled) return;
      setConnected(false);
    };

    const handleReconnecting = () => {
      if (!cancelled) setIsReconnecting(true);
    };

    const handleReconnected = () => {
      if (!cancelled) setIsReconnecting(false);
    };

    liveKitRoom
      .on(RoomEvent.Connected, handleConnected)
      .on(RoomEvent.Disconnected, handleDisconnected)
      .on(RoomEvent.Reconnecting, handleReconnecting)
      .on(RoomEvent.Reconnected, handleReconnected)
      .on(RoomEvent.ParticipantConnected, updateParticipants)
      .on(RoomEvent.ParticipantDisconnected, updateParticipants)
      .on(RoomEvent.TrackSubscribed, updateParticipants)
      .on(RoomEvent.TrackUnsubscribed, updateParticipants);

    const connectToRoom = async () => {
      try {
        await liveKitRoom.connect(livekitUrl, token);

        if (cancelled) {
          await liveKitRoom.disconnect();
          return;
        }

        if (canPublish) {
          await liveKitRoom.localParticipant.setMicrophoneEnabled(true);
          await liveKitRoom.localParticipant.setCameraEnabled(true);
        }

        if (cancelled) return;

        setRoom(liveKitRoom);
        setIsAudioEnabled(canPublish);
        setIsVideoEnabled(canPublish);
        updateParticipants();
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to connect to LiveKit:", err);
        setConnected(false);
        setConnectError(
          err instanceof Error ? err.message : "Failed to connect to session.",
        );
      }
    };

    void connectToRoom();

    return () => {
      cancelled = true;
      liveKitRoom.removeAllListeners();
      if (liveKitRoom.state !== "disconnected") {
        liveKitRoom.disconnect();
      }
    };
  }, [livekitUrl, token, canPublish]);

  const toggleAudio = useCallback(async () => {
    if (!room) return;
    const next = !room.localParticipant.isMicrophoneEnabled;
    await room.localParticipant.setMicrophoneEnabled(next);
    setIsAudioEnabled(next);
  }, [room]);

  const toggleVideo = useCallback(async () => {
    if (!room) return;
    const next = !room.localParticipant.isCameraEnabled;
    await room.localParticipant.setCameraEnabled(next);
    setIsVideoEnabled(next);
  }, [room]);

  const handleLeave = useCallback(async () => {
    await room?.disconnect();
    router.back();
  }, [room, router]);

  if (connectError) {
    return <RoomError message={connectError} sessionId={sessionId} />;
  }

  if (!connected || !room) {
    return <RoomConnecting />;
  }

  const localParticipant = room.localParticipant;
  const participantCount = remoteParticipants.length + 1;

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0f] text-white">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] px-4 sm:px-6">
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold sm:text-base">
            {session.title}
          </h1>
          <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              Live
            </span>
            {isReconnecting && (
              <span className="flex items-center gap-1 text-amber-400">
                <WifiOff className="h-3 w-3" />
                Reconnecting…
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-gray-300">
          <Users className="h-3.5 w-3.5" />
          {participantCount}
        </div>
      </header>

      <main className="relative flex-1 overflow-hidden p-3 sm:p-5">
        <div
          className={`grid h-full min-h-[500px] gap-3 ${
            remoteParticipants.length === 0
              ? "grid-cols-1"
              : "grid-cols-1 sm:grid-cols-2"
          }`}
        >
          {remoteParticipants.map((participant) => (
            <ParticipantTile key={participant.identity}>
              <LiveKitRemoteVideo participant={participant} />
              <ParticipantLabel>
                {participant.name || participant.identity}
              </ParticipantLabel>
            </ParticipantTile>
          ))}

          {remoteParticipants.length === 0 && (
            <ParticipantTile>
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.04]">
                    <Users className="h-7 w-7 text-gray-500" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-gray-300">
                    Waiting for participants
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Other participants will appear here.
                  </p>
                </div>
              </div>
            </ParticipantTile>
          )}

          <ParticipantTile>
            {isVideoEnabled ? (
              <LiveKitLocalVideo participant={localParticipant} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.06] text-2xl font-semibold text-gray-300">
                  You
                </div>
              </div>
            )}
            <ParticipantLabel>You</ParticipantLabel>
            {!isVideoEnabled && (
              <div className="absolute right-3 top-3 rounded-lg bg-black/60 p-2 backdrop-blur-sm">
                <VideoOff className="h-4 w-4 text-gray-300" />
              </div>
            )}
          </ParticipantTile>
        </div>
      </main>

      <footer className="flex h-20 shrink-0 items-center justify-center border-t border-white/[0.06] bg-[#0a0a0f]/80 px-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {canPublish && (
            <>
              <ControlButton
                active={isAudioEnabled}
                onClick={() => void toggleAudio()}
                label={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
                icon={isAudioEnabled ? Mic : MicOff}
              />

              <ControlButton
                active={isVideoEnabled}
                onClick={() => void toggleVideo()}
                label={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
                icon={isVideoEnabled ? Video : VideoOff}
              />
            </>
          )}

          <button
            type="button"
            onClick={() => void handleLeave()}
            aria-label="Leave session"
            className="ml-2 flex h-12 w-14 items-center justify-center rounded-full bg-red-600 transition hover:bg-red-500 active:scale-95"
          >
            <PhoneOff className="h-5 w-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}

function ParticipantTile({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-[300px] overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
      {children}
    </div>
  );
}

function ParticipantLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
      {children}
    </div>
  );
}

interface ControlButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

function ControlButton({
  active,
  onClick,
  label,
  icon: Icon,
}: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-12 w-12 items-center justify-center rounded-full transition active:scale-95 ${
        active
          ? "bg-white/[0.06] hover:bg-white/[0.1]"
          : "bg-red-500 hover:bg-red-600"
      }`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

function RoomLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-500" />
        <p className="mt-4 text-sm text-gray-400">
          Preparing your session room...
        </p>
      </div>
    </div>
  );
}

interface RoomErrorProps {
  message: string;
  sessionId: string;
}

function RoomError({ message, sessionId }: RoomErrorProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
          <VideoOff className="h-6 w-6 text-red-400" />
        </div>
        <h1 className="mt-5 text-xl font-semibold text-white">
          Unable to join session
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-400">{message}</p>
        <button
          type="button"
          onClick={() => router.push(`/communities/sessions/${sessionId}`)}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Session
        </button>
      </div>
    </div>
  );
}

function RoomConnecting() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-500" />
        <p className="mt-4 text-sm text-gray-400">
          Connecting to live session...
        </p>
      </div>
    </div>
  );
}
