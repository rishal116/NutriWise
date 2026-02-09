import { useRef, useState } from "react";

export const useWebRTC = (sessionId: string) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCall = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true, // 👈 THIS enables mic permission
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = mediaStream;
    }

    setStream(mediaStream);

    // later: send tracks to RTCPeerConnection
  };

  const toggleMic = () => {
    if (!stream) return;
    stream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
  };

  const toggleCamera = () => {
    if (!stream) return;
    stream.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
  };

  const endCall = () => {
    stream?.getTracks().forEach(track => track.stop());
  };

  return {
    localVideoRef,
    remoteVideoRef,
    startCall,
    toggleMic,
    toggleCamera,
    endCall,
  };
};
