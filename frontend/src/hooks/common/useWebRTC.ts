"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket";

import {
  joinVideoRoom,
  leaveVideoRoom,
  sendOffer,
  sendAnswer,
  sendIceCandidate,
  onOffer,
  onAnswer,
  onIceCandidate,
  onCallReady,
} from "@/socket/video.socket";

const iceServers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const useWebRTC = (roomId: string) => {

  const socketRef = useRef<any>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const iceQueue = useRef<RTCIceCandidateInit[]>([]);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [isJoined, setIsJoined] = useState(false);
  const [hasRemoteStream, setHasRemoteStream] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  /* -------------------------
     CREATE PEER CONNECTION
  ------------------------- */

  const createPeer = () => {
    if (peerRef.current) return peerRef.current;
    

    const peer = new RTCPeerConnection(iceServers);
    

    // Add tracks ONLY ONCE here
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        peer.addTrack(track, localStreamRef.current!);
      });
    }

    peer.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        sendIceCandidate(socketRef.current, {
          roomId,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
  console.log("REMOTE TRACK RECEIVED", event);

  const stream = event.streams[0];

  if (remoteVideoRef.current) {
    remoteVideoRef.current.srcObject = stream;
    remoteVideoRef.current.play().catch(()=>{});
  }

  setHasRemoteStream(true);
};

peer.oniceconnectionstatechange = () => {
  console.log("ICE STATE:", peer.iceConnectionState);
};

peer.onconnectionstatechange = () => {
  console.log("PEER STATE:", peer.connectionState);
};

    peerRef.current = peer;
    return peer;
  };

  /* -------------------------
     GET CAMERA + MIC
  ------------------------- */

  const getMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStreamRef.current = stream;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    return stream;
  };

  /* -------------------------
     START CALL
  ------------------------- */

  const startCall = async () => {
    try {
      socketRef.current = getSocket();

      await getMedia();
      createPeer();



      joinVideoRoom(socketRef.current, roomId);

      registerSocketEvents();

      setIsJoined(true);
    } catch (err) {
      console.error("Start call error:", err);
    }
  };

  /* -------------------------
     SOCKET EVENTS
  ------------------------- */

  const registerSocketEvents = () => {
    const socket = socketRef.current;

let isMakingOffer = false;

onCallReady(socket, async () => {
  const peer = createPeer();

  if (isMakingOffer) return;
  if (peer.signalingState !== "stable") return;

  isMakingOffer = true;

  try {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    sendOffer(socket, { roomId, offer });
  } catch (err) {
    console.error(err);
  } finally {
    isMakingOffer = false;
  }
});

    onOffer(socket, async ({ offer }) => {
      const peer = createPeer();

      await peer.setRemoteDescription(new RTCSessionDescription(offer));

      // process queued ICE candidates
      iceQueue.current.forEach(async (c) => {
        await peer.addIceCandidate(new RTCIceCandidate(c));
      });

      iceQueue.current = [];

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      sendAnswer(socket, { roomId, answer });
    });

    onAnswer(socket, async ({ answer }) => {
  if (!peerRef.current) return;

  const peer = peerRef.current;

  // prevent wrong state error
  if (peer.signalingState !== "have-local-offer") {
    console.warn("Ignoring answer, state:", peer.signalingState);
    return;
  }

  await peer.setRemoteDescription(
    new RTCSessionDescription(answer)
  );

  // process queued ICE candidates
  for (const c of iceQueue.current) {
    await peer.addIceCandidate(new RTCIceCandidate(c));
  }

  iceQueue.current = [];
});

    onIceCandidate(socket, async ({ candidate }) => {
      if (!peerRef.current || !candidate) return;

      try {
        if (peerRef.current.remoteDescription) {
          await peerRef.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } else {
          iceQueue.current.push(candidate);
        }
      } catch (err) {
        console.error("ICE error:", err);
      }
    });
  };

  /* -------------------------
     CONTROLS
  ------------------------- */

  const toggleAudio = () => {
    if (!localStreamRef.current) return;

    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsAudioOn(track.enabled);
    });
  };

  const toggleVideo = () => {
    if (!localStreamRef.current) return;

    localStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsVideoOn(track.enabled);
    });
  };

  /* -------------------------
     END CALL
  ------------------------- */

  const endCall = () => {
    if (socketRef.current) {
      leaveVideoRoom(socketRef.current, roomId);
    }

    peerRef.current?.close();
    peerRef.current = null;

    localStreamRef.current?.getTracks().forEach((track) => track.stop());

    setIsJoined(false);
    setHasRemoteStream(false);
  };

  /* -------------------------
     CLEANUP
  ------------------------- */

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