import { useEffect, useRef, useState } from "react";
import { connectSocket, disconnectSocket } from "@/lib/socket";

export const useWebRTC = (roomId: string) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<any>(null);
  const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]);

  const [isJoined, setIsJoined] = useState(false);
  const [hasRemoteStream, setHasRemoteStream] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  // Create or return existing peer
  const createPeer = () => {
    if (peerRef.current) return peerRef.current;

    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });

    peer.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit("ice-candidate", {
          roomId,
          candidate: event.candidate,
          senderId: socketRef.current.id,
        });
      }
    };

    peer.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setHasRemoteStream(true);
      }
    };

    peerRef.current = peer;
    return peer;
  };

  const ensureLocalStream = async () => {
    if (!streamRef.current) {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: isVideoOn,
          audio: isAudioOn,
        });
        streamRef.current = localStream;
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    }
  };

  const processIceCandidates = async () => {
    if (peerRef.current && peerRef.current.remoteDescription) {
      while (iceCandidatesQueue.current.length > 0) {
        const candidate = iceCandidatesQueue.current.shift();
        if (candidate) {
          try {
            await peerRef.current.addIceCandidate(candidate);
          } catch (err) {
            console.error("Error adding queued ICE candidate:", err);
          }
        }
      }
    }
  };

  useEffect(() => {
    socketRef.current = connectSocket();

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
      socketRef.current.emit("join_room", roomId);
    });

    const handleOffer = async ({ offer, senderId }: any) => {
      if (socketRef.current.id === senderId) return;

      const peer = createPeer();
      await ensureLocalStream();

      // Add local tracks if not already added
      streamRef.current!.getTracks().forEach((track) => {
        if (!peer.getSenders().find((s) => s.track === track)) {
          peer.addTrack(track, streamRef.current!);
        }
      });

      try {
        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socketRef.current.emit("answer", {
          roomId,
          answer,
          senderId: socketRef.current.id,
        });
        setIsJoined(true);
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    };

    const handleAnswer = async ({ answer, senderId }: any) => {
      if (socketRef.current.id === senderId) return;
      if (!peerRef.current) return;

      try {
        await peerRef.current.setRemoteDescription(answer);
        await processIceCandidates();
      } catch (err) {
        console.error("Error handling answer:", err);
      }
    };

    const handleIce = async ({ candidate, senderId }: any) => {
      if (socketRef.current.id === senderId) return;
      if (!peerRef.current) return;

      const iceCandidate = new RTCIceCandidate(candidate);

      if (peerRef.current.remoteDescription) {
        try {
          await peerRef.current.addIceCandidate(iceCandidate);
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      } else {
        iceCandidatesQueue.current.push(iceCandidate);
      }
    };

    socketRef.current.on("offer", handleOffer);
    socketRef.current.on("answer", handleAnswer);
    socketRef.current.on("ice-candidate", handleIce);

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave_room", roomId);
        socketRef.current.off("offer");
        socketRef.current.off("answer");
        socketRef.current.off("ice-candidate");
      }
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      if (peerRef.current) peerRef.current.close();
      iceCandidatesQueue.current = [];
      disconnectSocket();
    };
  }, [roomId]);

  const startCall = async () => {
    const peer = createPeer();
    await ensureLocalStream();

    // Add local tracks
    streamRef.current!.getTracks().forEach((track) => {
      if (!peer.getSenders().find((s) => s.track === track)) {
        peer.addTrack(track, streamRef.current!);
      }
    });

    try {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      socketRef.current.emit("offer", {
        roomId,
        offer,
        senderId: socketRef.current.id,
      });

      setIsJoined(true);
    } catch (err) {
      console.error("Failed to start call:", err);
    }
  };

  const toggleAudio = () => {
    if (!streamRef.current) return;
    streamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsAudioOn(track.enabled);
    });
  };

  const toggleVideo = () => {
    if (!streamRef.current) return;
    streamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsVideoOn(track.enabled);
    });
  };

  const endCall = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    if (peerRef.current) peerRef.current.close();
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    iceCandidatesQueue.current = [];
    socketRef.current?.emit("leave_room", roomId);

    setIsJoined(false);
    setHasRemoteStream(false);
    setIsAudioOn(true);
    setIsVideoOn(true);

    streamRef.current = null;
    peerRef.current = null;
  };

  return {
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
  };
};
