"use client";

import { useEffect, useRef, useState } from "react";
import { connectSocket } from "@/lib/socket";

const iceServers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const useWebRTC = (roomId: string) => {
  const socketRef = useRef<any>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [isJoined, setIsJoined] = useState(false);
  const [hasRemoteStream, setHasRemoteStream] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  // --------------------------
  // Create Peer
  // --------------------------
  const createPeer = () => {
    const peer = new RTCPeerConnection(iceServers);

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("ice-candidate", {
          roomId,
          candidate: event.candidate,
        });
      }
    };

   peer.ontrack = (event) => {
  const stream = event.streams[0];

  setHasRemoteStream(true);

  // Wait for React to render video
  setTimeout(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = stream;
    }
  }, 0);
}

    peer.onconnectionstatechange = () => {
      console.log("Connection:", peer.connectionState);
    };

    return peer;
  };

  // --------------------------
  // Get Media
  // --------------------------
  const getMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStreamRef.current = stream;
    localVideoRef.current!.srcObject = stream;

    return stream;
  };

  // --------------------------
  // Start Call
  // --------------------------
  const startCall = async () => {
    socketRef.current = connectSocket();

    await getMedia();

    socketRef.current.emit("join_room", roomId);
    setIsJoined(true);

    registerSocketEvents();
  };

  // --------------------------
  // Socket Events
  // --------------------------
  const registerSocketEvents = () => {
    const socket = socketRef.current;

    socket.on("ready_for_call", async () => {
      peerRef.current = createPeer();

      localStreamRef.current!.getTracks().forEach((track) => {
        peerRef.current!.addTrack(track, localStreamRef.current!);
      });

      const offer = await peerRef.current!.createOffer();
      await peerRef.current!.setLocalDescription(offer);

      socket.emit("offer", { roomId, offer });
    });

    socket.on("offer", async ({ offer }) => {
      peerRef.current = createPeer();

      localStreamRef.current!.getTracks().forEach((track) => {
        peerRef.current!.addTrack(track, localStreamRef.current!);
      });

      await peerRef.current!.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await peerRef.current!.createAnswer();
      await peerRef.current!.setLocalDescription(answer);

      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", async ({ answer }) => {
      await peerRef.current!.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      if (peerRef.current) {
        await peerRef.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }
    });
  };

  // --------------------------
  // Controls
  // --------------------------
  const toggleAudio = () => {
    localStreamRef.current!.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsAudioOn(track.enabled);
    });
  };

  const toggleVideo = () => {
    localStreamRef.current!.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsVideoOn(track.enabled);
    });
  };

  const endCall = () => {
    peerRef.current?.close();
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    socketRef.current?.disconnect();
    setIsJoined(false);
    setHasRemoteStream(false);
  };

  useEffect(() => {
    return () => {
      endCall();
    };
  }, []);

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
