"use client";

import { MessageSquare, Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import ControlButton from "./ControlButton";
import EndMeetingDialog from "./EndMeetingDialog";
import ReactionPicker from "./ReactionPicker";

interface ControlBarProps {
  isAudioOn: boolean;
  isVideoOn: boolean;
  isChatOpen: boolean;
  unreadCount: number;
  canEndMeeting: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleChat: () => void;
  onReact: (emoji: string) => void;
  onLeave: () => void;
  onEndMeeting: () => void;
}

const ControlBar = ({
  isAudioOn,
  isVideoOn,
  isChatOpen,
  unreadCount,
  canEndMeeting,
  onToggleAudio,
  onToggleVideo,
  onToggleChat,
  onReact,
  onLeave,
  onEndMeeting,
}: ControlBarProps) => (
  <div className="flex items-center gap-2 sm:gap-3">
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
    <ReactionPicker onSelect={onReact} />
    <ControlButton
      label="Chat"
      variant={isChatOpen ? "active" : "default"}
      badge={unreadCount}
      onClick={onToggleChat}
    >
      <MessageSquare size={20} />
    </ControlButton>
    <ControlButton label="Leave call" variant="danger" onClick={onLeave}>
      <PhoneOff size={20} />
    </ControlButton>
    {canEndMeeting && <EndMeetingDialog onConfirm={onEndMeeting} />}
  </div>
);

export default ControlBar;