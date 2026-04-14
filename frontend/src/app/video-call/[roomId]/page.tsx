"use client";

import React, { useState, useMemo } from "react";
import { useWebRTC } from "@/hooks/common/useWebRTC";
import { useParams, useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Play,
  Smile,
} from "lucide-react";
import { nutritionistMeetService } from "@/services/nutritionist/nutritionistMeet.service";

const VideoCallPage = () => {
  const params = useParams();
  const router = useRouter();
  const roomId = params?.roomId as string;

  const [showReactions, setShowReactions] = useState(false);
  const [joining, setJoining] = useState(false);
  const reactions = useMemo(() => ["💖", "👍", "👏", "😂", "🔥"], []);

  const {
    localVideoRef,
    remoteVideoRef,
    startCall,
    endCall,
    toggleAudio,
    toggleVideo,
    isAudioOn,
    isVideoOn,
    isJoined,
    hasRemoteStream,
  } = useWebRTC(roomId);

  const handleJoin = async () => {
    setJoining(true);

  try {
   await nutritionistMeetService.updateMeetingStatus(roomId, "ongoing");



    await startCall();
  } catch (err) {
    console.error(err);
  }

  setJoining(false);
  };

  const handleLeave =  async () => {

  endCall();
  router.back();
  };

  if (!roomId) return null;

  return (
    <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center overflow-hidden font-sans selection:bg-emerald-500/30">
      
      {/* MINIMAL TOP INFO */}
      <div className="absolute top-6 left-6 z-50 flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono text-emerald-50/70 tracking-wider uppercase">{roomId}</span>
        </div>
      </div>

      {/* VIDEO LAYOUT */}
      <div className="relative w-full h-full p-4 flex flex-col md:flex-row items-center justify-center gap-4">
        
        {/* LOCAL FEED */}
        <div className={`relative overflow-hidden rounded-2xl border border-white/5 bg-neutral-900 transition-all duration-500 shadow-2xl ${
            hasRemoteStream ? "w-full md:w-1/2 h-1/2 md:h-[70%]" : "w-full max-w-5xl h-[80%]"
        }`}>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover scale-x-[-1] ${!isVideoOn ? "opacity-0" : "opacity-100"}`}
          />
          {!isVideoOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
              <VideoOff size={32} className="text-neutral-600" />
            </div>
          )}
          <div className="absolute bottom-4 left-4 text-[10px] font-bold text-white/50 uppercase tracking-widest bg-black/20 px-2 py-1 rounded">
            You
          </div>
        </div>

        {/* REMOTE FEED */}
        <div className={`relative overflow-hidden rounded-2xl border border-white/5 bg-neutral-950 transition-all duration-500 ${
            hasRemoteStream ? "w-full md:w-1/2 h-1/2 md:h-[70%]" : "hidden"
        }`}>
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute bottom-4 left-4 text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded">
            Partner
          </div>
        </div>
      </div>

      {/* SLIM CONTROL BAR */}
      <div className="absolute bottom-8 flex items-center gap-2 px-3 py-2 bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl z-50">
        {!isJoined ? (
          <button
            onClick={handleJoin}
            disabled={joining}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all text-sm font-bold disabled:opacity-50"
          >
            {joining ? "..." : <Play size={16} fill="currentColor" />}
            {joining ? "Joining" : "Join"}
          </button>
        ) : (
          <>
            <button
              onClick={toggleAudio}
              className={`p-2.5 rounded-xl transition-colors ${
                isAudioOn ? "text-neutral-400 hover:bg-neutral-800 hover:text-white" : "bg-red-500/20 text-red-500"
              }`}
            >
              {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-2.5 rounded-xl transition-colors ${
                isVideoOn ? "text-neutral-400 hover:bg-neutral-800 hover:text-white" : "bg-red-500/20 text-red-500"
              }`}
            >
              {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowReactions(!showReactions)}
                className={`p-2.5 rounded-xl transition-colors ${showReactions ? "bg-emerald-600/20 text-emerald-400" : "text-neutral-400 hover:bg-neutral-800"}`}
              >
                <Smile size={20} />
              </button>
              {showReactions && (
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1 bg-neutral-900 border border-white/10 p-1.5 rounded-xl shadow-2xl">
                  {reactions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => { console.log(emoji); setShowReactions(false); }}
                      className="p-1.5 hover:bg-white/5 rounded-lg text-lg transition-transform hover:scale-125"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-[1px] h-5 bg-white/10 mx-1" />

            <button
              onClick={handleLeave}
              className="p-2.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all"
            >
              <PhoneOff size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCallPage;