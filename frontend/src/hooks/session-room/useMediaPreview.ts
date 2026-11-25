import { useCallback, useEffect, useRef, useState } from "react";

export interface MediaSettings {
  audioEnabled: boolean;
  videoEnabled: boolean;
  /** "" means the browser default device. */
  audioDeviceId: string;
  videoDeviceId: string;
}

export type PreviewErrorKind =
  | "denied"
  | "not-found"
  | "in-use"
  | "unsupported"
  | "unknown";

export interface PreviewError {
  kind: PreviewErrorKind;
  message: string;
}

export interface DevicePreview {
  stream: MediaStream | null;
  active: boolean;
  pending: boolean;
  error: PreviewError | null;
  deviceId: string;
  /** Turns the device off, or (re)starts it, which also retries after an error. */
  toggle: () => void;
}

type DeviceKind = "audio" | "video";

interface Slot {
  stream: MediaStream | null;
  error: PreviewError | null;
  pending: boolean;
  deviceId: string;
}

const KINDS: DeviceKind[] = ["audio", "video"];

const DEVICE_NAMES: Record<DeviceKind, string> = {
  audio: "microphone",
  video: "camera",
};

const INITIAL_SLOTS: Record<DeviceKind, Slot> = {
  audio: { stream: null, error: null, pending: true, deviceId: "" },
  video: { stream: null, error: null, pending: true, deviceId: "" },
};

function toPreviewError(kind: DeviceKind, err: unknown): PreviewError {
  const name = err instanceof Error ? err.name : "";
  const device = DEVICE_NAMES[kind];

  switch (name) {
    case "NotAllowedError":
    case "SecurityError":
      return {
        kind: "denied",
        message: `Access to your ${device} is blocked. Allow it in your browser's site settings.`,
      };
    case "NotFoundError":
      return {
        kind: "not-found",
        message: `No ${device} was found on this device.`,
      };
    case "NotReadableError":
    case "AbortError":
      return {
        kind: "in-use",
        message: `Your ${device} is in use by another application or tab.`,
      };
    case "NotSupportedError":
      return {
        kind: "unsupported",
        message: `Your browser can't access the ${device} here. Use HTTPS and a supported browser.`,
      };
    default:
      return {
        kind: "unknown",
        message: `Couldn't start your ${device}. Please try again.`,
      };
  }
}

async function getMedia(
  constraints: MediaStreamConstraints,
): Promise<MediaStream> {
  const media =
    typeof navigator === "undefined" ? undefined : navigator.mediaDevices;

  if (!media?.getUserMedia) {
    throw new DOMException("Media devices are unavailable", "NotSupportedError");
  }

  return media.getUserMedia(constraints);
}

function stopTracks(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

export function useMediaPreview() {
  // Source of truth is the ref; state only triggers re-renders.
  const slotsRef = useRef<Record<DeviceKind, Slot>>(INITIAL_SLOTS);
  const [slots, setSlots] = useState<Record<DeviceKind, Slot>>(INITIAL_SLOTS);

  // Invalidates in-flight getUserMedia calls (Strict Mode, fast toggling).
  const requestRef = useRef<Record<DeviceKind, number>>({ audio: 0, video: 0 });
  // What the user wants: false only after they switch a device off themselves.
  const wantedRef = useRef<Record<DeviceKind, boolean>>({
    audio: true,
    video: true,
  });

  const patch = useCallback((kind: DeviceKind, changes: Partial<Slot>) => {
    slotsRef.current = {
      ...slotsRef.current,
      [kind]: { ...slotsRef.current[kind], ...changes },
    };
    setSlots(slotsRef.current);
  }, []);

  const stopKind = useCallback(
    (kind: DeviceKind) => {
      requestRef.current[kind] += 1;
      stopTracks(slotsRef.current[kind].stream);
      patch(kind, { stream: null, pending: false });
    },
    [patch],
  );

  const open = useCallback(
    async (kinds: DeviceKind[]) => {
      const tickets: Partial<Record<DeviceKind, number>> = {};

      for (const kind of kinds) {
        requestRef.current[kind] += 1;
        tickets[kind] = requestRef.current[kind];

        stopTracks(slotsRef.current[kind].stream);
        patch(kind, { stream: null, error: null, pending: true });
      }

      const isCurrent = (kind: DeviceKind) =>
        requestRef.current[kind] === tickets[kind];

      const succeed = (kind: DeviceKind, stream: MediaStream) => {
        if (!isCurrent(kind)) {
          stopTracks(stream);
          return;
        }
        const deviceId = stream.getTracks()[0]?.getSettings().deviceId ?? "";
        patch(kind, { stream, deviceId, pending: false });
      };

      const fail = (kind: DeviceKind, err: unknown) => {
        if (isCurrent(kind)) {
          patch(kind, { error: toPreviewError(kind, err), pending: false });
        }
      };

      // One combined request means one permission prompt, not two racing ones.
      if (kinds.length === 2) {
        try {
          const both = await getMedia({ audio: true, video: true });

          succeed("audio", new MediaStream(both.getAudioTracks()));
          succeed("video", new MediaStream(both.getVideoTracks()));
          return;
        } catch (err: unknown) {
          const { kind } = toPreviewError("video", err);

          // Nothing to gain from retrying separately.
          if (kind === "denied" || kind === "unsupported") {
            kinds.forEach((k) => fail(k, err));
            return;
          }
          // Otherwise one device is missing or busy: try each on its own so
          // the working one still starts.
        }
      }

      for (const kind of kinds) {
        try {
          succeed(kind, await getMedia({ [kind]: true }));
        } catch (err: unknown) {
          fail(kind, err);
        }
      }
    },
    [patch],
  );

  // Request on mount, release on unmount.
  useEffect(() => {
    void open(KINDS);

    return () => {
      KINDS.forEach((kind) => stopKind(kind));
    };
  }, [open, stopKind]);

  // If the user flips a blocked permission to "Allow" in the address bar,
  // start that device without making them click anything.
  useEffect(() => {
    if (!navigator.permissions?.query) return;

    let cancelled = false;
    const cleanups: Array<() => void> = [];
    const permissionNames: Record<DeviceKind, string> = {
      audio: "microphone",
      video: "camera",
    };

    KINDS.forEach((kind) => {
      navigator.permissions
        .query({ name: permissionNames[kind] as PermissionName })
        .then((status) => {
          if (cancelled) return;

          const handleChange = () => {
            if (
              status.state === "granted" &&
              wantedRef.current[kind] &&
              slotsRef.current[kind].error?.kind === "denied"
            ) {
              void open([kind]);
            }
          };

          status.addEventListener("change", handleChange);
          cleanups.push(() =>
            status.removeEventListener("change", handleChange),
          );
        })
        .catch(() => {
          // Some browsers don't support these permission names.
        });
    });

    return () => {
      cancelled = true;
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [open]);

  const toggle = useCallback(
    (kind: DeviceKind) => {
      if (slotsRef.current[kind].stream) {
        wantedRef.current[kind] = false;
        stopKind(kind);
        return;
      }

      wantedRef.current[kind] = true;
      void open([kind]);
    },
    [open, stopKind],
  );

  const toDevicePreview = (kind: DeviceKind): DevicePreview => {
    const slot = slots[kind];

    return {
      stream: slot.stream,
      active: slot.stream !== null,
      pending: slot.pending,
      error: slot.error,
      deviceId: slot.deviceId,
      toggle: () => toggle(kind),
    };
  };

  const audio = toDevicePreview("audio");
  const video = toDevicePreview("video");

  const getSettings = (): MediaSettings => ({
    audioEnabled: audio.active,
    videoEnabled: video.active,
    audioDeviceId: audio.deviceId,
    videoDeviceId: video.deviceId,
  });

  // Must run before joining so the camera is never held twice.
  const release = () => {
    KINDS.forEach((kind) => stopKind(kind));
  };

  // Restart whatever the user wanted on and that isn't failing.
  const resume = () => {
    const kinds = KINDS.filter(
      (kind) =>
        wantedRef.current[kind] &&
        !slotsRef.current[kind].stream &&
        !slotsRef.current[kind].error,
    );

    if (kinds.length) void open(kinds);
  };

  return { audio, video, getSettings, release, resume };
}