"use client";

import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import ControlButton from "./ControlButton";
import VideoTile from "./VideoTile";

interface PreJoinProps {
  roomId: string;
  stream: MediaStream | null;
  isAudioOn: boolean;
  isVideoOn: boolean;
  isJoining: boolean;
  error: string | null;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onJoin: () => void;
  onBack: () => void;
}

const PreJoin = ({
  roomId,
  stream,
  isAudioOn,
  isVideoOn,
  isJoining,
  error,
  onToggleAudio,
  onToggleVideo,
  onJoin,
  onBack,
}: PreJoinProps) => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-6 overflow-y-auto p-4 md:flex-row md:gap-12 md:p-8">
    <div className="relative w-full max-w-2xl">
      <VideoTile
        stream={stream}
        muted
        mirrored
        videoOff={!stream || !isVideoOn}
        offText="Camera is off"
        className="relative aspect-video w-full"
      />
      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-3">
        <ControlButton
          label={isAudioOn ? "Mute" : "Unmute"}
          variant={isAudioOn ? "default" : "off"}
          onClick={onToggleAudio}
        >
          {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
        </ControlButton>
        <ControlButton
          label={isVideoOn ? "Turn camera off" : "Turn camera on"}
          variant={isVideoOn ? "default" : "off"}
          onClick={onToggleVideo}
        >
          {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
        </ControlButton>
      </div>
    </div>

    <div className="flex w-full max-w-sm flex-col items-center gap-4 text-center">
      <h1 className="text-2xl font-medium text-white">Ready to join?</h1>
      <p className="break-all font-mono text-xs text-neutral-500">{roomId}</p>
      {error && (
        <p role="alert" className="rounded-xl bg-red-500/15 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={onJoin}
        disabled={isJoining}
        className="w-full rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50 sm:w-auto"
      >
        {isJoining ? "Joining…" : "Join now"}
      </button>
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-neutral-400 hover:text-white"
      >
        Go back
      </button>
    </div>
  </div>
);

export default PreJoin;