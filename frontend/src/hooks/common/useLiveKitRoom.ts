"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ConnectionState,
  Room,
  RoomEvent,
  type RemoteParticipant,
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
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [remoteParticipants, setRemoteParticipants] = useState<
    RemoteParticipant[]
  >([]);
  const [activeSpeakers, setActiveSpeakers] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const roomRef = useRef<Room | null>(null);
  const lifecycleRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    if (!token || !serverUrl || !roomId) {
      setRoom(null);
      setConnectionState(ConnectionState.Disconnected);
      setRemoteParticipants([]);
      setActiveSpeakers([]);
      setIsAudioEnabled(false);
      setIsVideoEnabled(false);
      setIsScreenSharing(false);
      setError(null);
      return;
    }

    let cancelled = false;
    const liveKitRoom = new Room();

    setRoom(null);
    setError(null);
    setConnectionState(ConnectionState.Connecting);
    setRemoteParticipants([]);
    setActiveSpeakers([]);
    setIsAudioEnabled(false);
    setIsVideoEnabled(false);
    setIsScreenSharing(false);

    const isCurrentRoom = () => !cancelled && roomRef.current === liveKitRoom;

    const updateParticipants = () => {
      if (!isCurrentRoom()) return;

      setRemoteParticipants(
        Array.from(liveKitRoom.remoteParticipants.values()),
      );
    };

    const handleConnectionStateChanged = (state: ConnectionState) => {
      if (!isCurrentRoom()) return;

      setConnectionState(state);
    };

    const handleActiveSpeakersChanged = (
      speakers: Array<{ identity: string }>,
    ) => {
      if (!isCurrentRoom()) return;

      setActiveSpeakers(speakers.map((speaker) => speaker.identity));
    };

    const handleLocalTrackChanged = () => {
      if (!isCurrentRoom()) return;

      const localParticipant = liveKitRoom.localParticipant;

      setIsAudioEnabled(localParticipant.isMicrophoneEnabled);
      setIsVideoEnabled(localParticipant.isCameraEnabled);
      setIsScreenSharing(localParticipant.isScreenShareEnabled);
    };

    const handleDisconnected = () => {
      if (!isCurrentRoom()) return;

      setRoom(null);
      setConnectionState(ConnectionState.Disconnected);
      setRemoteParticipants([]);
      setActiveSpeakers([]);
      setIsAudioEnabled(false);
      setIsVideoEnabled(false);
      setIsScreenSharing(false);
    };

    liveKitRoom
      .on(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged)
      .on(RoomEvent.ParticipantConnected, updateParticipants)
      .on(RoomEvent.ParticipantDisconnected, updateParticipants)
      .on(RoomEvent.TrackSubscribed, updateParticipants)
      .on(RoomEvent.TrackUnsubscribed, updateParticipants)
      .on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakersChanged)
      .on(RoomEvent.LocalTrackPublished, handleLocalTrackChanged)
      .on(RoomEvent.LocalTrackUnpublished, handleLocalTrackChanged)
      .on(RoomEvent.Disconnected, handleDisconnected);

    const removeListeners = () => {
      liveKitRoom
        .off(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged)
        .off(RoomEvent.ParticipantConnected, updateParticipants)
        .off(RoomEvent.ParticipantDisconnected, updateParticipants)
        .off(RoomEvent.TrackSubscribed, updateParticipants)
        .off(RoomEvent.TrackUnsubscribed, updateParticipants)
        .off(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakersChanged)
        .off(RoomEvent.LocalTrackPublished, handleLocalTrackChanged)
        .off(RoomEvent.LocalTrackUnpublished, handleLocalTrackChanged)
        .off(RoomEvent.Disconnected, handleDisconnected);
    };

    const previousLifecycle = lifecycleRef.current;

    const currentLifecycle = previousLifecycle
      .catch(() => undefined)
      .then(async () => {
        if (cancelled) return;

        roomRef.current = liveKitRoom;

        try {
          await liveKitRoom.connect(serverUrl, token);

          if (cancelled) {
            await liveKitRoom.disconnect();
            return;
          }

          setRoom(liveKitRoom);
          setConnectionState(ConnectionState.Connected);
          updateParticipants();
          handleLocalTrackChanged();
        } catch (err: unknown) {
          if (!cancelled && roomRef.current === liveKitRoom) {
            setError(
              err instanceof Error
                ? err
                : new Error("Failed to connect to the LiveKit room."),
            );
            setConnectionState(ConnectionState.Disconnected);
            setRoom(null);
          }

          if (liveKitRoom.state !== ConnectionState.Disconnected) {
            await liveKitRoom.disconnect().catch(() => undefined);
          }

          if (roomRef.current === liveKitRoom) {
            roomRef.current = null;
          }
        }
      });

    lifecycleRef.current = currentLifecycle;

    return () => {
      cancelled = true;
      removeListeners();

      if (roomRef.current === liveKitRoom) {
        roomRef.current = null;
        setRoom(null);
        setConnectionState(ConnectionState.Disconnected);
        setRemoteParticipants([]);
        setActiveSpeakers([]);
        setIsAudioEnabled(false);
        setIsVideoEnabled(false);
        setIsScreenSharing(false);
      }

      // Wait for a pending connection to settle before disconnecting.
      const cleanupLifecycle = lifecycleRef.current
        .catch(() => undefined)
        .then(async () => {
          if (liveKitRoom.state !== ConnectionState.Disconnected) {
            await liveKitRoom.disconnect();
          }
        });

      lifecycleRef.current = cleanupLifecycle.catch(() => undefined);
    };
  }, [serverUrl, token, roomId]);

  const toggleAudio = useCallback(async () => {
    const currentRoom = roomRef.current;

    if (currentRoom?.state !== ConnectionState.Connected) return;

    try {
      const enabled = !currentRoom.localParticipant.isMicrophoneEnabled;

      await currentRoom.localParticipant.setMicrophoneEnabled(enabled);
      setIsAudioEnabled(enabled);
      setError(null);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to toggle the microphone."),
      );
    }
  }, []);

  const toggleVideo = useCallback(async () => {
    const currentRoom = roomRef.current;

    if (currentRoom?.state !== ConnectionState.Connected) return;

    try {
      const enabled = !currentRoom.localParticipant.isCameraEnabled;

      await currentRoom.localParticipant.setCameraEnabled(enabled);
      setIsVideoEnabled(enabled);
      setError(null);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err : new Error("Failed to toggle the camera."),
      );
    }
  }, []);

  const toggleScreenShare = useCallback(async () => {
    const currentRoom = roomRef.current;

    if (currentRoom?.state !== ConnectionState.Connected) return;

    try {
      const enabled = !currentRoom.localParticipant.isScreenShareEnabled;

      await currentRoom.localParticipant.setScreenShareEnabled(enabled);
      setIsScreenSharing(enabled);
      setError(null);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to toggle screen sharing."),
      );
    }
  }, []);

  const leaveCall = useCallback(async () => {
    const currentRoom = roomRef.current;

    if (!currentRoom) return;

    roomRef.current = null;
    setRoom(null);
    setConnectionState(ConnectionState.Disconnected);
    setRemoteParticipants([]);
    setActiveSpeakers([]);
    setIsAudioEnabled(false);
    setIsVideoEnabled(false);
    setIsScreenSharing(false);

    try {
      await currentRoom.disconnect();
      setError(null);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to disconnect from the LiveKit room."),
      );
    }
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
