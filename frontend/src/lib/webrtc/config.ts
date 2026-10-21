const STUN_SERVER: RTCIceServer = { urls: "stun:stun.l.google.com:19302" };

const buildIceServers = (): RTCIceServer[] => {
  const urls = process.env.NEXT_PUBLIC_TURN_URL;
  const username = process.env.NEXT_PUBLIC_TURN_USERNAME;
  const credential = process.env.NEXT_PUBLIC_TURN_CREDENTIAL;

  if (!urls || !username || !credential) return [STUN_SERVER];
  return [STUN_SERVER, { urls, username, credential }];
};

export const RTC_CONFIG: RTCConfiguration = {
  iceServers: buildIceServers(),
  bundlePolicy: "max-bundle",
};

export const MEDIA_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30, max: 30 },
    facingMode: "user",
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
};

export const CHAT_MAX_LENGTH = 500;
export const CHAT_HISTORY_LIMIT = 200;
export const SOCKET_CONNECT_TIMEOUT_MS = 8000;

export const describeCallError = (err: unknown): string => {
  if (err instanceof DOMException) {
    switch (err.name) {
      case "NotAllowedError":
        return "Camera or microphone permission was denied.";
      case "NotFoundError":
        return "No camera or microphone was found.";
      case "NotReadableError":
        return "Your camera or microphone is being used by another app.";
      default:
        break;
    }
  }
  return err instanceof Error
    ? err.message
    : "Something went wrong while joining the call.";
};