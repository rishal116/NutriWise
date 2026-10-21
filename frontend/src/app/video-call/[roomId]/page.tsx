"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { nutriMeetingService } from "@/services/nutritionist/nutriMeeting.service";
import { MeetingStatus } from "@/enums/nutritionist/meeting/meeting.enum";
import { useVideoCall, type CallStatus } from "@/hooks/video-call/useVideoCall";
import { useCallChat } from "@/hooks/video-call/useCallChat";
import VideoGrid from "@/components/video-call/VideoGrid";
import ControlBar from "@/components/video-call/ControlBar";
import ChatPanel from "@/components/video-call/ChatPanel";
import PreJoin from "@/components/video-call/PreJoin";
import LeftScreen from "@/components/video-call/LeftScreen";

const STATUS_LABEL: Partial<Record<CallStatus, string>> = {
  joining: "Joining…",
  waiting: "Waiting for the other participant…",
  connecting: "Connecting…",
  reconnecting: "Reconnecting…",
};

const VideoCallPage = () => {
  const params = useParams<{ roomId: string }>();
  const router = useRouter();
  const roomId = params?.roomId ?? "";
  const activeRole = useAppSelector((state) => state.auth.user?.activeRole);
  const isNutritionist = activeRole === "nutritionist";

  const call = useVideoCall(roomId);
  const { messages, send } = useCallChat(call.socket, roomId);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [seenCount, setSeenCount] = useState(0);
  const [actionError, setActionError] = useState<string | null>(null);
  const [hasLeft, setHasLeft] = useState(false);

  useEffect(() => {
    if (isChatOpen) setSeenCount(messages.length);
  }, [isChatOpen, messages.length]);

  const unreadCount = isChatOpen ? 0 : Math.max(0, messages.length - seenCount);

  const handleLeave = () => {
    call.leave();
    setIsChatOpen(false);
    setSeenCount(0);
    setHasLeft(true);
  };

  const handleEndMeeting = async () => {
    try {
      await nutriMeetingService.updateMeetingStatus(
        roomId,
        MeetingStatus.COMPLETED,
      );
    } catch {
      setActionError("Could not end the meeting. Please try again.");
      return;
    }
    call.leave();
    router.back();
  };

  if (!roomId) return null;

  const banner = call.error ?? actionError ?? STATUS_LABEL[call.status] ?? null;
  const isBannerError = Boolean(call.error ?? actionError);

  return (
    <div className="fixed inset-0 flex h-dvh overflow-hidden bg-[#111] font-sans text-white selection:bg-emerald-500/30">
      <main className="relative min-w-0 flex-1">
        {call.isJoined ? (
          <>
            <div className="absolute left-3 top-3 z-20 flex items-center gap-2 md:left-6 md:top-5">
              <span className="max-w-40 truncate font-mono text-xs uppercase tracking-wider text-neutral-300">
                {roomId}
              </span>
              {banner && (
                <span
                  role="status"
                  className={`rounded-full px-3 py-1 text-xs ${
                    isBannerError
                      ? "bg-red-500/20 text-red-300"
                      : "bg-neutral-800 text-neutral-300"
                  }`}
                >
                  {banner}
                </span>
              )}
            </div>

            <VideoGrid
              localStream={call.localStream}
              remoteStream={call.remoteStream}
              isVideoOn={call.isVideoOn}
            />

            <div className="absolute inset-x-0 bottom-4 z-30 flex justify-center pb-[env(safe-area-inset-bottom)]">
              <ControlBar
                isAudioOn={call.isAudioOn}
                isVideoOn={call.isVideoOn}
                isChatOpen={isChatOpen}
                unreadCount={unreadCount}
                canEndMeeting={isNutritionist}
                onToggleAudio={call.toggleAudio}
                onToggleVideo={call.toggleVideo}
                onToggleChat={() => setIsChatOpen((open) => !open)}
                onReact={send}
                onLeave={handleLeave}
                onEndMeeting={handleEndMeeting}
              />
            </div>
          </>
        ) : hasLeft ? (
          <LeftScreen
            onRejoin={() => {
              setActionError(null);
              setHasLeft(false);
            }}
            onBack={() => router.back()}
          />
        ) : (
          <PreJoin
            roomId={roomId}
            stream={call.localStream}
            isAudioOn={call.isAudioOn}
            isVideoOn={call.isVideoOn}
            isJoining={call.status === "joining"}
            error={call.error}
            onToggleAudio={call.toggleAudio}
            onToggleVideo={call.toggleVideo}
            onJoin={call.join}
            onBack={() => router.back()}
          />
        )}
      </main>

      {call.isJoined && isChatOpen && (
        <ChatPanel
          messages={messages}
          selfId={call.socket?.id}
          onSend={send}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default VideoCallPage;