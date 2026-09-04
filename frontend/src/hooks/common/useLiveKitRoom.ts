"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Room,
  RoomEvent,
  RemoteParticipant,
  ConnectionState,
} from "livekit-client";

interface UseLiveKitRoomProps {
  token: string;
  serverUrl: string;
  roomId: string;
}

export function useLiveKitRoom({
  token,
  serverUrl,
  roomId,
}: UseLiveKitRoomProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.Disconnected,
  );
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [remoteParticipants, setRemoteParticipants] = useState<
    RemoteParticipant[]
  >([]);
  const [activeSpeakers, setActiveSpeakers] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const roomRef = useRef<Room | null>(null);

  useEffect(() => {
    const liveKitRoom = new Room();
    roomRef.current = liveKitRoom;
    let cancelled = false;

    const updateParticipants = () => {
      if (cancelled) return;
      setRemoteParticipants(
        Array.from(liveKitRoom.remoteParticipants.values()),
      );
    };

    const handleConnectionStateChanged = (state: ConnectionState) => {
      if (!cancelled) setConnectionState(state);
    };

    const handleActiveSpeakersChanged = (speakers: { identity: string }[]) => {
      if (!cancelled) setActiveSpeakers(speakers.map((s) => s.identity));
    };

    const handleLocalTrackMuteChange = () => {
      if (cancelled) return;
      setIsAudioEnabled(liveKitRoom.localParticipant.isMicrophoneEnabled);
      setIsVideoEnabled(liveKitRoom.localParticipant.isCameraEnabled);
      setIsScreenSharing(liveKitRoom.localParticipant.isScreenShareEnabled);
    };

    liveKitRoom
      .on(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged)
      .on(RoomEvent.ParticipantConnected, updateParticipants)
      .on(RoomEvent.ParticipantDisconnected, updateParticipants)
      .on(RoomEvent.TrackSubscribed, updateParticipants)
      .on(RoomEvent.TrackUnsubscribed, updateParticipants)
      .on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakersChanged)
      .on(RoomEvent.LocalTrackPublished, handleLocalTrackMuteChange)
      .on(RoomEvent.LocalTrackUnpublished, handleLocalTrackMuteChange);

    const connect = async () => {
      try {
        await liveKitRoom.connect(serverUrl, token);
        await Promise.all([
          liveKitRoom.localParticipant.setMicrophoneEnabled(true),
          liveKitRoom.localParticipant.setCameraEnabled(true),
        ]);

        if (cancelled) {
          await liveKitRoom.disconnect();
          return;
        }

        setRoom(liveKitRoom);
        setIsAudioEnabled(true);
        setIsVideoEnabled(true);
        updateParticipants();
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    connect();

    return () => {
      cancelled = true;
      liveKitRoom.disconnect();
      liveKitRoom.removeAllListeners();
      roomRef.current = null;
      setRoom(null);
      setConnectionState(ConnectionState.Disconnected);
    };
  }, [serverUrl, token, roomId]);

  const toggleAudio = useCallback(async () => {
    const r = roomRef.current;
    if (!r) return;
    const next = !r.localParticipant.isMicrophoneEnabled;
    await r.localParticipant.setMicrophoneEnabled(next);
    setIsAudioEnabled(next);
  }, []);

  const toggleVideo = useCallback(async () => {
    const r = roomRef.current;
    if (!r) return;
    const next = !r.localParticipant.isCameraEnabled;
    await r.localParticipant.setCameraEnabled(next);
    setIsVideoEnabled(next);
  }, []);

  const toggleScreenShare = useCallback(async () => {
    const r = roomRef.current;
    if (!r) return;
    const next = !r.localParticipant.isScreenShareEnabled;
    await r.localParticipant.setScreenShareEnabled(next);
    setIsScreenSharing(next);
  }, []);

  const leaveCall = useCallback(() => {
    roomRef.current?.disconnect();
  }, []);

  return {
    room,
    isConnected: connectionState === ConnectionState.Connected,
    connectionState,
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
    remoteParticipants,
    activeSpeakers,
    error,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    leaveCall,
  };
}
