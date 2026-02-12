"use client";

import React from "react";
import { useWebRTC } from "@/hooks/common/useWebRTC";

interface Props {
  roomId: string;
}

const VideoCallPage: React.FC<Props> = ({ roomId }) => {
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

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center relative">

      {/* Remote Video (Main Screen) */}
      <div className="w-full h-full flex items-center justify-center bg-gray-900 relative">

        {hasRemoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-white text-xl">
            {isJoined ? "Waiting for user..." : "Click Start Call"}
          </div>
        )}
      </div>

      {/* Local Video (Small Preview) */}
      <div className="absolute bottom-24 right-6 w-52 h-40 bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-600">

        {isVideoOn ? (
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white bg-gray-700">
            Camera Off
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 flex gap-4">

        {!isJoined ? (
          <button
            onClick={startCall}
            className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700"
          >
            Start Call
          </button>
        ) : (
          <>
            <button
              onClick={toggleAudio}
              className={`px-4 py-3 rounded-full ${
                isAudioOn ? "bg-blue-600" : "bg-gray-600"
              } text-white`}
            >
              {isAudioOn ? "Mute" : "Unmute"}
            </button>

            <button
              onClick={toggleVideo}
              className={`px-4 py-3 rounded-full ${
                isVideoOn ? "bg-blue-600" : "bg-gray-600"
              } text-white`}
            >
              {isVideoOn ? "Turn Off Camera" : "Turn On Camera"}
            </button>

            <button
              onClick={endCall}
              className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
              End Call
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCallPage;
