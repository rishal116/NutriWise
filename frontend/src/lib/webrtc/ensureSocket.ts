import type { Socket } from "socket.io-client";
import { getSocket } from "@/lib/socket";
import { SOCKET_CONNECT_TIMEOUT_MS } from "./config";

export const ensureSocket = (): Promise<Socket> =>
  new Promise((resolve, reject) => {
    const socket = getSocket();

    if (!socket) {
      reject(new Error("Not connected to the server. Please refresh the page."));
      return;
    }

    if (socket.connected) {
      resolve(socket);
      return;
    }

    const onConnect = () => {
      clearTimeout(timer);
      resolve(socket);
    };

    const timer = setTimeout(() => {
      socket.off("connect", onConnect);
      reject(new Error("Could not reach the server. Check your connection."));
    }, SOCKET_CONNECT_TIMEOUT_MS);

    socket.once("connect", onConnect);
  });