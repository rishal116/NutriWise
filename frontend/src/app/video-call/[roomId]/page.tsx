"use client";

import React, { useState } from "react";
import { useWebRTC } from "@/hooks/common/useWebRTC";
import { useParams } from "next/navigation";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Play, Smile, Heart, ThumbsUp } from "lucide-react";

const VideoCallPage = () => {
  const params = useParams();
  const roomId = (params.id || params.roomId) as string;
  const [showReactions, setShowReactions] = useState(false);

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
  console.log("local video: ",localVideoRef);

  console.log("remote video: ",remoteVideoRef);
  

  // Reaction Handler (Requires socket implementation in hook)
  const sendReaction = (emoji: string) => {
    console.log("Sending reaction:", emoji);
    // socketRef.current.emit("reaction", { roomId, emoji });
    setShowReactions(false);
  };

  return (
    <div className="w-full h-screen bg-neutral-950 flex flex-col items-center justify-center overflow-hidden font-sans">
      
      {/* Video Grid Container */}
      <div className={`relative w-full h-full p-4 gap-4 flex flex-col md:flex-row items-center justify-center transition-all duration-500 ${hasRemoteStream ? "bg-black" : "bg-neutral-900"}`}>
        
        {/* Local Video Card */}
        <div className={`relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-all duration-500 ease-in-out ${
          hasRemoteStream 
            ? "w-full md:w-1/2 h-1/2 md:h-[80%]" // Split view
            : "w-full md:w-[80%] h-[80%] max-w-5xl" // Full screen (solo)
        }`}>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover mirror ${!isVideoOn ? 'hidden' : 'block'}`}
          />
          {!isVideoOn && (
            <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-neutral-400">
              <div className="text-center">
                <div className="w-20 h-20 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <VideoOff size={32} />
                </div>
                <p>Your camera is off</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm text-white">
            You { !isAudioOn && "• Muted" }
          </div>
        </div>

        {/* Remote Video Card */}
        {hasRemoteStream && (
          <div className="relative w-full md:w-1/2 h-1/2 md:h-[80%] overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-neutral-800">
            <video
  ref={remoteVideoRef}
  autoPlay
  playsInline
  className={`w-full h-full object-cover ${
    hasRemoteStream ? "block" : "hidden"
  }`}
/>
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm text-white">
              Remote Participant
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="absolute bottom-8 flex items-center gap-3 px-6 py-4 bg-neutral-900/90 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl z-50">
        {!isJoined ? (
          <button onClick={startCall} className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all font-semibold">
            <Play size={20} fill="currentColor" /> Ready to Join?
          </button>
        ) : (
          <>
            <button onClick={toggleAudio} className={`p-3.5 rounded-full transition-all ${isAudioOn ? "bg-neutral-800 hover:bg-neutral-700" : "bg-red-500"}`}>
              {isAudioOn ? <Mic size={22} /> : <MicOff size={22} />}
            </button>

            <button onClick={toggleVideo} className={`p-3.5 rounded-full transition-all ${isVideoOn ? "bg-neutral-800 hover:bg-neutral-700" : "bg-red-500"}`}>
              {isVideoOn ? <Video size={22} /> : <VideoOff size={22} />}
            </button>

            {/* Reactions Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowReactions(!showReactions)}
                className="p-3.5 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-all text-yellow-400"
              >
                <Smile size={22} />
              </button>
              
              {showReactions && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 bg-neutral-800 p-2 rounded-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-4">
                  {['💖', '👍', '👏', '😂', '🔥'].map(emoji => (
                    <button 
                      key={emoji}
                      onClick={() => sendReaction(emoji)}
                      className="hover:scale-125 transition-transform text-2xl p-1"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-[1px] h-6 bg-neutral-700 mx-1" />

            <button onClick={endCall} className="p-3.5 bg-red-600 hover:bg-red-500 text-white rounded-full transition-all rotate-[135deg]">
              <PhoneOff size={22} />
            </button>
          </>
        )}
      </div>

      {/* Info Overlay */}
      <div className="absolute top-6 left-6 text-neutral-400 text-sm font-medium flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Meeting ID: <span className="text-white select-all">{roomId}</span>
      </div>
    </div>
  );
};

export default VideoCallPage;