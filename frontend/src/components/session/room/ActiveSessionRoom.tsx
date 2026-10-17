"use client";

import { useCallback, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import {
  Hand,
  MessageSquare,
  Mic,
  MicOff,
  PhoneOff,
  Video,
  VideoOff,
  X,
} from "lucide-react";

import type { PublicSessionDetailsResponseDTO } from "@/dtos/public/session/public-session-details-response.dto";
import type { SessionRoomJoinResponseDTO } from "@/dtos/public/session/session-room-join-response.dto";

import LiveKitLocalVideo from "@/components/session/LiveKitLocalVideo";
import LiveKitRemoteVideo from "@/components/session/LiveKitRemoteVideo";
import ParticipantGrid from "@/components/session/ParticipantGrid";
import ParticipantTile from "@/components/session/ParticipantTile";
import SessionChatPanel from "@/components/session/SessionChatPanel";
import ControlButton from "@/components/session/room/ControlButton";
import RoomHeader from "@/components/session/room/RoomHeader";
import {
  RoomConnecting,
  RoomDisconnected,
  RoomError,
  getSessionPagePath,
} from "@/components/session/room/RoomStates";
import { useLiveKitRoom } from "@/hooks/useLiveKitRoom";
import { useRoomSignals } from "@/hooks/useRoomSignals";
import { useSessionLifecycle } from "@/hooks/useSessionLifecycle";

interface ActiveSessionRoomProps {
  session: PublicSessionDetailsResponseDTO;
  sessionId: string;
  token: string;
  livekitUrl: string;
  canPublish: boolean;
  role: SessionRoomJoinResponseDTO["role"];
}

interface BannerProps {
  tone: "warning" | "error";
  children: ReactNode;
  onDismiss?: () => void;
}

function Banner({ tone, children, onDismiss }: BannerProps) {
  const toneClass =
    tone === "error"
      ? "bg-red-500/10 text-red-300"
      : "bg-amber-500/10 text-amber-300";

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex shrink-0 items-center justify-center gap-3 px-4 py-2 text-xs ${toneClass}`}
    >
      <span>{children}</span>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 rounded-full p-1 hover:bg-white/10"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export default function ActiveSessionRoom({
  session,
  sessionId,
  token,
  livekitUrl,
  canPublish,
  role,
}: ActiveSessionRoomProps) {
  const router = useRouter();

  const {
    room,
    status,
    connectError,
    isReconnecting,
    local,
    notice,
    dismissNotice,
    remoteParticipants,
    toggleDevice,
    leave,
  } = useLiveKitRoom({ token, livekitUrl, canPublish });

  const lifecycle = useSessionLifecycle({
    sessionId,
    initialStatus: session.status,
    isHost: role === "host",
  });

  const { messages, raisedHands, sendMessage, toggleHand } = useRoomSignals(
    room,
    local.canPublishData,
  );

  const [chatOpen, setChatOpen] = useState(false);
  const [seenAt, setSeenAt] = useState(0);

  const unreadCount = chatOpen
    ? 0
    : messages.filter((message) => !message.own && message.sentAt > seenAt)
        .length;

  const backHref = getSessionPagePath(sessionId);

  const closeChat = () => {
    setSeenAt(Date.now());
    setChatOpen(false);
  };

  // Leaving only disconnects this participant. It never changes the session.
  const handleLeave = useCallback(async () => {
    try {
      await leave();
    } finally {
      router.back();
    }
  }, [leave, router]);

  const handleEndSession = async () => {
    const ended = await lifecycle.end();

    if (!ended) return;

    try {
      await leave();
    } finally {
      router.push(backHref);
    }
  };

  if (connectError) {
    return <RoomError message={connectError} backHref={backHref} />;
  }

  if (status === "disconnected") {
    return <RoomDisconnected backHref={backHref} />;
  }

  if (status === "connecting" || !room) {
    return <RoomConnecting />;
  }

  const localParticipant = room.localParticipant;
  const localRaised = raisedHands.has(localParticipant.identity);
  const localName = localParticipant.name || "You";

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#0a0a0f] text-white">
      <RoomHeader
        title={session.title}
        status={lifecycle.status}
        role={role}
        participantCount={remoteParticipants.length + 1}
        isReconnecting={isReconnecting}
        pendingAction={lifecycle.pendingAction}
        canStart={lifecycle.canStart}
        canEnd={lifecycle.canEnd}
        onStart={() => void lifecycle.start()}
        onEnd={() => void handleEndSession()}
      />

      {!local.canPublish && (
        <Banner tone="warning">
          Microphone and camera are unavailable: this session&apos;s access
          token does not allow publishing.
        </Banner>
      )}

      {lifecycle.error && (
        <Banner tone="error" onDismiss={lifecycle.clearError}>
          {lifecycle.error}
        </Banner>
      )}

      {notice && (
        <Banner tone="error" onDismiss={dismissNotice}>
          {notice}
        </Banner>
      )}

      <div className="flex min-h-0 flex-1">
        <main className="flex min-w-0 flex-1 flex-col p-2 sm:p-4">
          <div className="min-h-0 flex-1">
            <ParticipantGrid>
              {remoteParticipants.map((participant) => (
                <ParticipantTile
                  key={participant.identity}
                  name={participant.name || participant.identity}
                  micOn={participant.isMicrophoneEnabled}
                  cameraOn={participant.isCameraEnabled}
                  raised={raisedHands.has(participant.identity)}
                >
                  <LiveKitRemoteVideo participant={participant} />
                </ParticipantTile>
              ))}

              <ParticipantTile
                name={role === "host" ? "You (Host)" : "You"}
                avatarName={localName}
                micOn={local.isAudioEnabled}
                cameraOn={local.isVideoEnabled}
                raised={localRaised}
              >
                {local.isVideoEnabled ? (
                  <LiveKitLocalVideo participant={localParticipant} />
                ) : null}
              </ParticipantTile>
            </ParticipantGrid>
          </div>

          {remoteParticipants.length === 0 && (
            <p className="pt-2 text-center text-xs text-gray-500">
              Waiting for others to join…
            </p>
          )}
        </main>

        <SessionChatPanel
          messages={messages}
          open={chatOpen}
          canSend={local.canPublishData}
          onSend={sendMessage}
          onClose={closeChat}
        />
      </div>

      <footer className="flex h-16 shrink-0 items-center justify-center border-t border-white/[0.06] bg-[#0a0a0f] px-2 pb-[env(safe-area-inset-bottom)] sm:h-20 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <ControlButton
            danger
            pressed={local.isAudioEnabled}
            disabled={!local.canPublish}
            onClick={() => void toggleDevice("microphone")}
            label={
              !local.canPublish
                ? "Microphone unavailable: you don't have permission to publish"
                : local.isAudioEnabled
                  ? "Mute microphone"
                  : "Unmute microphone"
            }
            icon={local.isAudioEnabled ? Mic : MicOff}
          />

          <ControlButton
            danger
            pressed={local.isVideoEnabled}
            disabled={!local.canPublish}
            onClick={() => void toggleDevice("camera")}
            label={
              !local.canPublish
                ? "Camera unavailable: you don't have permission to publish"
                : local.isVideoEnabled
                  ? "Turn off camera"
                  : "Turn on camera"
            }
            icon={local.isVideoEnabled ? Video : VideoOff}
          />

          <ControlButton
            pressed={localRaised}
            disabled={!local.canPublishData}
            onClick={() => void toggleHand()}
            label={
              !local.canPublishData
                ? "Raise hand unavailable for your role"
                : localRaised
                  ? "Lower hand"
                  : "Raise hand"
            }
            icon={Hand}
          />

          <ControlButton
            pressed={chatOpen}
            onClick={() => (chatOpen ? closeChat() : setChatOpen(true))}
            label={chatOpen ? "Close chat" : "Open chat"}
            icon={MessageSquare}
            badge={unreadCount}
          />

          <button
            type="button"
            onClick={() => void handleLeave()}
            aria-label="Leave session"
            title="Leave session"
            className="ml-1 flex h-11 w-14 items-center justify-center rounded-full bg-red-600 transition hover:bg-red-500 active:scale-95 sm:ml-2 sm:h-12 sm:w-16"
          >
            <PhoneOff className="h-5 w-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
