import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;
let currentAccessToken: string | null = null;

export const connectSocket = (accessToken: string): Socket => {
  if (!accessToken) {
    throw new Error("Access token is required to connect the socket.");
  }

  if (socket && currentAccessToken !== accessToken) {
    socket.auth = { accessToken };
    currentAccessToken = accessToken;

    socket.disconnect();
    socket.connect();

    return socket;
  }

  if (!socket) {
    currentAccessToken = accessToken;

    socket = io(process.env.NEXT_PUBLIC_API_URL as string, {
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      auth: {
        accessToken,
      },
    });

    socket.on("connect", () => {
      console.log("Socket connected cleanly:", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect error:", err.message);
    });

    socket.connect();
  } else if (!socket.connected) {
    socket.auth = { accessToken };
    currentAccessToken = accessToken;
    socket.connect();
  }

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    currentAccessToken = null;
  }
};
