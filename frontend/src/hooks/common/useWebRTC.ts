"use client";

import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";

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
  type Unsubscribe,
} from "@/socket/video.socket";

const iceServers: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const useWebRTC = (roomId: string) => {
  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const iceQueue = useRef<RTCIceCandidateInit[]>([]);
  const socketListenersRef = useRef<Unsubscribe[]>([]);
  const isStartingRef = useRef(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [isJoined, setIsJoined] = useState(false);
  const [hasRemoteStream, setHasRemoteStream] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  // STOP LOCAL MEDIA STREAM

  const stopLocalStream = (): void => {
    const stream = localStreamRef.current;

    if (!stream) return;

    stream.getTracks().forEach((track) => {
      track.stop();
    });

    localStreamRef.current = null;
  };

  // CLOSE PEER CONNECTION

  const closePeerConnection = (): void => {
    const peer = peerRef.current;

    if (!peer) return;

    peer.close();
    peerRef.current = null;
  };

  // REMOVE SOCKET EVENT LISTENERS

  const unsubscribeSocketListeners = (): void => {
    socketListenersRef.current.forEach((unsubscribe) => {
      unsubscribe();
    });

    socketListenersRef.current = [];
  };

  // CREATE PEER CONNECTION

  const createPeer = (): RTCPeerConnection => {
    const existingPeer = peerRef.current;

    if (existingPeer) {
      return existingPeer;
    }

    const peer = new RTCPeerConnection(iceServers);
    const localStream = localStreamRef.current;

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peer.addTrack(track, localStream);
      });
    }

    peer.onicecandidate = (event) => {
      const socket = socketRef.current;

      if (event.candidate && socket) {
        sendIceCandidate(socket, {
          roomId,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      const stream = event.streams[0];

      if (!stream) return;

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;

        void remoteVideoRef.current.play().catch((error: unknown) => {
          console.warn("Unable to autoplay remote video:", error);
        });
      }

      setHasRemoteStream(true);
    };

    peerRef.current = peer;

    return peer;
  };

  // GET CAMERA AND MICROPHONE

  const getMedia = async (): Promise<MediaStream> => {
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

  // REGISTER SOCKET EVENTS

  const registerSocketEvents = (socket: Socket): void => {
    let isMakingOffer = false;

    socketListenersRef.current.push(
      onCallReady(socket, async () => {
        const peer = createPeer();

        if (isMakingOffer || peer.signalingState !== "stable") {
          return;
        }

        isMakingOffer = true;

        try {
          const offer = await peer.createOffer();
          await peer.setLocalDescription(offer);

          sendOffer(socket, {
            roomId,
            offer,
          });
        } catch (error) {
          console.error("Failed to create WebRTC offer:", error);
        } finally {
          isMakingOffer = false;
        }
      }),
    );

    socketListenersRef.current.push(
      onOffer(socket, async ({ offer }) => {
        try {
          const peer = createPeer();

          await peer.setRemoteDescription(new RTCSessionDescription(offer));

          for (const candidate of iceQueue.current) {
            await peer.addIceCandidate(new RTCIceCandidate(candidate));
          }

          iceQueue.current = [];

          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);

          sendAnswer(socket, {
            roomId,
            answer,
          });
        } catch (error) {
          console.error("Failed to handle WebRTC offer:", error);
        }
      }),
    );

    socketListenersRef.current.push(
      onAnswer(socket, async ({ answer }) => {
        const peer = peerRef.current;

        if (!peer || peer.signalingState !== "have-local-offer") {
          return;
        }

        try {
          await peer.setRemoteDescription(new RTCSessionDescription(answer));

          for (const candidate of iceQueue.current) {
            await peer.addIceCandidate(new RTCIceCandidate(candidate));
          }

          iceQueue.current = [];
        } catch (error) {
          console.error("Failed to handle WebRTC answer:", error);
        }
      }),
    );

    socketListenersRef.current.push(
      onIceCandidate(socket, async ({ candidate }) => {
        const peer = peerRef.current;

        if (!peer || !candidate) return;

        try {
          if (peer.remoteDescription) {
            await peer.addIceCandidate(new RTCIceCandidate(candidate));
          } else {
            iceQueue.current.push(candidate);
          }
        } catch (error) {
          console.error("Failed to add ICE candidate:", error);
        }
      }),
    );
  };

  // START CALL

  const startCall = async (): Promise<void> => {
    if (
      isStartingRef.current ||
      peerRef.current !== null ||
      localStreamRef.current !== null
    ) {
      return;
    }

    isStartingRef.current = true;

    try {
      const socket = getSocket();

      if (!socket) {
        throw new Error(
          "Socket is not initialized. Connect the socket before starting a video call.",
        );
      }

      socketRef.current = socket;

      await getMedia();

      createPeer();
      registerSocketEvents(socket);

      joinVideoRoom(socket, roomId);

      setIsJoined(true);
    } catch (error) {
      console.error("Failed to start video call:", error);

      unsubscribeSocketListeners();
      closePeerConnection();
      stopLocalStream();

      socketRef.current = null;
      iceQueue.current = [];

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }

      setIsJoined(false);
      setHasRemoteStream(false);
    } finally {
      isStartingRef.current = false;
    }
  };

  // TOGGLE AUDIO

  const toggleAudio = (): void => {
    const tracks = localStreamRef.current?.getAudioTracks();

    if (!tracks?.length) return;

    const enabled = !tracks[0].enabled;

    tracks.forEach((track) => {
      track.enabled = enabled;
    });

    setIsAudioOn(enabled);
  };

  // TOGGLE VIDEO

  const toggleVideo = (): void => {
    const tracks = localStreamRef.current?.getVideoTracks();

    if (!tracks?.length) return;

    const enabled = !tracks[0].enabled;

    tracks.forEach((track) => {
      track.enabled = enabled;
    });

    setIsVideoOn(enabled);
  };

  // END CALL

  const endCall = (): void => {
    const socket = socketRef.current;

    unsubscribeSocketListeners();

    if (socket) {
      leaveVideoRoom(socket, roomId);
    }

    closePeerConnection();
    stopLocalStream();

    socketRef.current = null;
    iceQueue.current = [];
    isStartingRef.current = false;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setIsJoined(false);
    setHasRemoteStream(false);
    setIsAudioOn(true);
    setIsVideoOn(true);
  };

  // CLEANUP

  useEffect(() => {
    return () => {
      const socket = socketRef.current;

      unsubscribeSocketListeners();

      if (socket) {
        leaveVideoRoom(socket, roomId);
      }

      const peer = peerRef.current;

      if (peer) {
        peer.close();
        peerRef.current = null;
      }

      const stream = localStreamRef.current;

      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });

        localStreamRef.current = null;
      }

      socketRef.current = null;
      iceQueue.current = [];
      isStartingRef.current = false;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    };
  }, [roomId]);

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
