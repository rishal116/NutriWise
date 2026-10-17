import { useCallback, useEffect, useRef, useState } from "react";
import {
  DisconnectReason,
  Room,
  RoomEvent,
  type RemoteParticipant,
} from "livekit-client";

export type RoomConnectionStatus = "connecting" | "connected" | "disconnected";
export type MediaDevice = "microphone" | "camera";

export interface LocalMediaState {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  canPublish: boolean;
  canPublishData: boolean;
}

interface UseLiveKitRoomOptions {
  token: string;
  livekitUrl: string;
  canPublish: boolean;
}

const DUPLICATE_IDENTITY_MESSAGE =
  "Another connection is using this account in the same session. Close other session tabs or devices and try again.";

const noop = (): void => undefined;

let pendingTeardown: Promise<void> = Promise.resolve();

function describeMediaError(device: MediaDevice, err: unknown): string {
  const name = err instanceof Error ? err.name : "";
  const deviceName = device === "microphone" ? "Microphone" : "Camera";

  if (name === "NotAllowedError" || name === "SecurityError") {
    return `${deviceName} access was blocked. Allow it in your browser's site settings and try again.`;
  }

  if (name === "NotFoundError" || name === "OverconstrainedError") {
    return `No ${device} was found on this device.`;
  }

  if (name === "NotReadableError") {
    return `Your ${device} is in use by another application.`;
  }

  return `Couldn't turn on your ${device}. Please try again.`;
}

function readLocalState(
  room: Room,
  fallbackCanPublish: boolean,
): LocalMediaState {
  const participant = room.localParticipant;

  return {
    isAudioEnabled: participant.isMicrophoneEnabled,
    isVideoEnabled: participant.isCameraEnabled,
    canPublish: participant.permissions?.canPublish ?? fallbackCanPublish,
    canPublishData: participant.permissions?.canPublishData ?? false,
  };
}

export function useLiveKitRoom({
  token,
  livekitUrl,
  canPublish,
}: UseLiveKitRoomOptions) {
  const [room, setRoom] = useState<Room | null>(null);
  const [status, setStatus] = useState<RoomConnectionStatus>("connecting");
  const [connectError, setConnectError] = useState<string | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [local, setLocal] = useState<LocalMediaState>({
    isAudioEnabled: false,
    isVideoEnabled: false,
    canPublish,
    canPublishData: false,
  });
  const [notice, setNotice] = useState<string | null>(null);
  const [remoteParticipants, setRemoteParticipants] = useState<
    RemoteParticipant[]
  >([]);

  const roomRef = useRef<Room | null>(null);
  const leavingRef = useRef(false);

  // The consumer is keyed by session, so a new token means a fresh mount and
  // no state needs resetting here.
  useEffect(() => {
    let cancelled = false;
    let connectAttempt: Promise<void> | null = null;

    const roomInstance = new Room({
      stopLocalTrackOnUnpublish: true,
      disconnectOnPageLeave: true,
    });

    roomRef.current = roomInstance;
    leavingRef.current = false;

    const updateParticipants = () => {
      if (cancelled) return;

      setRemoteParticipants(
        Array.from(roomInstance.remoteParticipants.values()),
      );
    };

    const syncLocal = () => {
      if (cancelled) return;

      setLocal(readLocalState(roomInstance, canPublish));
    };

    const handleTrackStateChange = () => {
      syncLocal();
      updateParticipants();
    };

    const handleDisconnected = (reason?: DisconnectReason) => {
      if (cancelled || leavingRef.current) return;

      setRoom(null);

      if (reason === DisconnectReason.DUPLICATE_IDENTITY) {
        setConnectError(DUPLICATE_IDENTITY_MESSAGE);
        return;
      }

      setStatus("disconnected");
      setIsReconnecting(false);
    };

    const handleReconnecting = () => {
      if (!cancelled) {
        setIsReconnecting(true);
      }
    };

    const handleReconnected = () => {
      if (cancelled) return;

      setIsReconnecting(false);
      syncLocal();
      updateParticipants();
    };

    roomInstance
      .on(RoomEvent.Disconnected, handleDisconnected)
      .on(RoomEvent.Reconnecting, handleReconnecting)
      .on(RoomEvent.Reconnected, handleReconnected)
      .on(RoomEvent.ParticipantConnected, updateParticipants)
      .on(RoomEvent.ParticipantDisconnected, updateParticipants)
      .on(RoomEvent.TrackSubscribed, updateParticipants)
      .on(RoomEvent.TrackUnsubscribed, updateParticipants)
      .on(RoomEvent.TrackPublished, updateParticipants)
      .on(RoomEvent.TrackUnpublished, updateParticipants)
      .on(RoomEvent.LocalTrackPublished, syncLocal)
      .on(RoomEvent.LocalTrackUnpublished, syncLocal)
      .on(RoomEvent.TrackMuted, handleTrackStateChange)
      .on(RoomEvent.TrackUnmuted, handleTrackStateChange)
      .on(RoomEvent.ParticipantPermissionsChanged, syncLocal);

    const start = async () => {
      // Never connect while an older instance is still tearing down.
      await pendingTeardown;

      if (cancelled) return;

      connectAttempt = roomInstance.connect(livekitUrl, token, {
        autoSubscribe: true,
        peerConnectionTimeout: 20000,
      });

      try {
        await connectAttempt;
      } catch (err: unknown) {
        if (cancelled) return;

        setConnectError(
          err instanceof Error ? err.message : "Failed to connect to session.",
        );
        setStatus("disconnected");
        return;
      }

      if (cancelled) return;

      setRoom(roomInstance);
      setStatus("connected");
      syncLocal();
      updateParticipants();

      const participant = roomInstance.localParticipant;

      if (!(participant.permissions?.canPublish ?? canPublish)) return;

      // Device failures must never break the meeting itself.
      try {
        await participant.setMicrophoneEnabled(true);
      } catch (err: unknown) {
        if (!cancelled) {
          setNotice(describeMediaError("microphone", err));
        }
      }

      if (cancelled) return;

      try {
        await participant.setCameraEnabled(true);
      } catch (err: unknown) {
        if (!cancelled) {
          setNotice(describeMediaError("camera", err));
        }
      }

      syncLocal();
    };

    // Deferred so React Strict Mode's throwaway first mount is cleaned up
    // before any connection (and its identity) reaches the server.
    const timer = setTimeout(() => void start(), 0);

    return () => {
      clearTimeout(timer);
      cancelled = true;

      roomInstance
        .off(RoomEvent.Disconnected, handleDisconnected)
        .off(RoomEvent.Reconnecting, handleReconnecting)
        .off(RoomEvent.Reconnected, handleReconnected)
        .off(RoomEvent.ParticipantConnected, updateParticipants)
        .off(RoomEvent.ParticipantDisconnected, updateParticipants)
        .off(RoomEvent.TrackSubscribed, updateParticipants)
        .off(RoomEvent.TrackUnsubscribed, updateParticipants)
        .off(RoomEvent.TrackPublished, updateParticipants)
        .off(RoomEvent.TrackUnpublished, updateParticipants)
        .off(RoomEvent.LocalTrackPublished, syncLocal)
        .off(RoomEvent.LocalTrackUnpublished, syncLocal)
        .off(RoomEvent.TrackMuted, handleTrackStateChange)
        .off(RoomEvent.TrackUnmuted, handleTrackStateChange)
        .off(RoomEvent.ParticipantPermissionsChanged, syncLocal);

      if (roomRef.current === roomInstance) {
        roomRef.current = null;
      }

      const attempt = connectAttempt;

      // The connection never started, so there is nothing to disconnect.
      if (!attempt) return;

      // Wait for the in-flight connect to settle, then disconnect. New
      // instances wait for this before connecting.
      const teardown: Promise<void> = attempt
        .catch(noop)
        .then(() => roomInstance.disconnect())
        .catch(noop);

      pendingTeardown = pendingTeardown.then(() => teardown);
    };
  }, [canPublish, livekitUrl, token]);

  const toggleDevice = useCallback(
    async (device: MediaDevice) => {
      if (!room || !local.canPublish) return;

      const participant = room.localParticipant;
      const enabled =
        device === "microphone"
          ? participant.isMicrophoneEnabled
          : participant.isCameraEnabled;

      setNotice(null);

      try {
        if (device === "microphone") {
          await participant.setMicrophoneEnabled(!enabled);
        } else {
          await participant.setCameraEnabled(!enabled);
        }
      } catch (err: unknown) {
        if (roomRef.current === room) {
          setNotice(describeMediaError(device, err));
        }
      }

      // Skip if the room was torn down while the browser prompt was open.
      if (roomRef.current === room) {
        setLocal(readLocalState(room, canPublish));
      }
    },
    [room, local.canPublish, canPublish],
  );

  const leave = useCallback(async () => {
    leavingRef.current = true;
    await roomRef.current?.disconnect();
  }, []);

  const dismissNotice = useCallback(() => setNotice(null), []);

  return {
    room,
    status,
    connectError,
    isReconnecting,
    local,
    notice,
    dismissNotice,
    remoteParticipants,
    toggleDevice,
    leave,
  };
}
