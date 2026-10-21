"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import {
  joinVideoRoom,
  leaveVideoRoom,
  sendAnswer,
  sendIceCandidate,
  onAnswer,
  onCallReady,
  onIceCandidate,
  onJoinedAsSecond,
  onOffer,
  onPeerLeft,
  onRoomFull,
  onWaitingForPeer,
  type Unsubscribe,
} from "@/socket/video.socket";
import { RTC_CONFIG, describeCallError } from "@/lib/webrtc/config";
import { ensureSocket } from "@/lib/webrtc/ensureSocket";
import { flushPendingIce, sendNewOffer } from "@/lib/webrtc/signaling";
import { useLocalMedia } from "./useLocalMedia";
import { notifyVideoCallConnected } from "@/socket/video.socket";

export type CallStatus =
  "idle" | "joining" | "waiting" | "connecting" | "connected" | "reconnecting";

export const useVideoCall = (roomId: string) => {
  const {
    stream: localStream,
    isAudioOn,
    isVideoOn,
    acquire,
    release,
    toggleAudio,
    toggleVideo: toggleVideoRaw,
  } = useLocalMedia();

  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);
  const unsubscribersRef = useRef<Unsubscribe[]>([]);
  const joinedRef = useRef(false);
  const joiningRef = useRef(false);
  const isOffererRef = useRef(false);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<CallStatus>("idle");
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closePeer = useCallback(() => {
    const peer = peerRef.current;
    if (peer) {
      peer.onicecandidate = null;
      peer.ontrack = null;
      peer.onconnectionstatechange = null;
      peer.close();
    }
    peerRef.current = null;
    pendingIceRef.current = [];
    setRemoteStream(null);
  }, []);

  const createPeer = useCallback(
    (activeSocket: Socket, media: MediaStream): RTCPeerConnection => {
      closePeer();

      const peer = new RTCPeerConnection(RTC_CONFIG);
      media.getTracks().forEach((track) => peer.addTrack(track, media));

      peer.onicecandidate = ({ candidate }) => {
        if (candidate) {
          sendIceCandidate(activeSocket, {
            roomId,
            candidate: candidate.toJSON(),
          });
        }
      };

      peer.ontrack = ({ streams }) => {
        if (streams[0]) setRemoteStream(streams[0]);
      };

      peer.onconnectionstatechange = () => {
        if (peerRef.current !== peer) return;

        switch (peer.connectionState) {
          case "connected":
            setStatus("connected");
            notifyVideoCallConnected(activeSocket, roomId);
            break;
          case "disconnected":
            setStatus("reconnecting");
            break;
          case "failed":
            setStatus("reconnecting");
            if (isOffererRef.current) {
              sendNewOffer(activeSocket, peer, roomId, true).catch(() =>
                setError("Connection lost. Please leave and rejoin."),
              );
            }
            break;
          default:
            break;
        }
      };

      peerRef.current = peer;
      return peer;
    },
    [roomId, closePeer],
  );

  const teardown = useCallback(() => {
    unsubscribersRef.current.forEach((off) => off());
    unsubscribersRef.current = [];
    closePeer();
    release();
    joinedRef.current = false;
    socketRef.current = null;
    setSocket(null);
    setIsJoined(false);
    setStatus("idle");
  }, [closePeer, release]);

  const leave = useCallback(() => {
    if (joinedRef.current && socketRef.current) {
      leaveVideoRoom(socketRef.current, roomId);
    }
    teardown();
  }, [roomId, teardown]);

  const join = useCallback(async () => {
    if (!roomId || joinedRef.current || joiningRef.current) return;

    joiningRef.current = true;
    setError(null);
    setStatus("joining");

    try {
      const activeSocket = await ensureSocket();
      const media = await acquire();

      socketRef.current = activeSocket;
      setSocket(activeSocket);

      unsubscribersRef.current = [
        onWaitingForPeer(activeSocket, () => setStatus("waiting")),
        onJoinedAsSecond(activeSocket, () => setStatus("connecting")),
        onRoomFull(activeSocket, () => {
          teardown();
          setError("This call already has two participants.");
        }),
        onCallReady(activeSocket, () => {
          isOffererRef.current = true;
          setStatus("connecting");
          const peer = createPeer(activeSocket, media);
          sendNewOffer(activeSocket, peer, roomId).catch(() =>
            setError("Could not start the call. Please try again."),
          );
        }),
        onOffer(activeSocket, async ({ offer }) => {
          setStatus("connecting");

          let peer = peerRef.current;
          if (!peer) {
            isOffererRef.current = false;
            peer = createPeer(activeSocket, media);
          }

          try {
            await peer.setRemoteDescription(offer);
            await flushPendingIce(peer, pendingIceRef.current);
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            sendAnswer(activeSocket, { roomId, answer });
          } catch {
            setError("Could not answer the call. Please try again.");
          }
        }),
        onAnswer(activeSocket, async ({ answer }) => {
          const peer = peerRef.current;
          if (!peer || peer.signalingState !== "have-local-offer") return;

          try {
            await peer.setRemoteDescription(answer);
            await flushPendingIce(peer, pendingIceRef.current);
          } catch {
            setError("Could not complete the connection. Please try again.");
          }
        }),
        onIceCandidate(activeSocket, async ({ candidate }) => {
          if (!candidate) return;

          const peer = peerRef.current;
          if (peer?.remoteDescription) {
            try {
              await peer.addIceCandidate(candidate);
            } catch {
              // Candidate for a closed session; ignore.
            }
          } else {
            pendingIceRef.current.push(candidate);
          }
        }),
        onPeerLeft(activeSocket, () => {
          closePeer();
          setStatus("waiting");
        }),
      ];

      const handleDisconnect = () => setStatus("reconnecting");
      const handleReconnect = () => {
        if (!joinedRef.current) return;
        closePeer();
        setStatus("joining");
        joinVideoRoom(activeSocket, roomId);
      };
      activeSocket.on("disconnect", handleDisconnect);
      activeSocket.on("connect", handleReconnect);
      unsubscribersRef.current.push(
        () => activeSocket.off("disconnect", handleDisconnect),
        () => activeSocket.off("connect", handleReconnect),
      );

      joinedRef.current = true;
      setIsJoined(true);
      joinVideoRoom(activeSocket, roomId);
    } catch (err) {
      teardown();
      setError(describeCallError(err));
    } finally {
      joiningRef.current = false;
    }
  }, [roomId, acquire, createPeer, closePeer, teardown]);

  const toggleVideo = useCallback(async () => {
    try {
      await toggleVideoRaw();
    } catch (err) {
      setError(describeCallError(err));
    }
  }, [toggleVideoRaw]);

  useEffect(() => leave, [leave]);

  return {
    socket,
    localStream,
    remoteStream,
    status,
    isJoined,
    error,
    isAudioOn,
    isVideoOn,
    join,
    leave,
    toggleAudio,
    toggleVideo,
  };
};
