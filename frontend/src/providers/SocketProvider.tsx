"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { connectSocket, disconnectSocket } from "@/lib/socket";
import { useAppSelector } from "@/redux/hooks";

interface SocketContextType {
  onlineUserIds: Set<string>;
  isUserOnline: (userId?: string) => boolean;
  isConnected: boolean;
}

interface PresenceResponse {
  onlineUserIds: string[];
}

interface PresenceUserPayload {
  userId: string;
}

const SocketContext = createContext<SocketContextType>({
  onlineUserIds: new Set<string>(),
  isUserOnline: () => false,
  isConnected: false,
});

export const usePresence = () => useContext(SocketContext);

export default function SocketProvider({ children }: { children: ReactNode }) {
  const userId = useAppSelector((state) => state.auth.user?.id);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const initialized = useAppSelector((state) => state.auth.initialized);

  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(
    () => new Set<string>(),
  );
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!initialized || !userId || !accessToken) {
      disconnectSocket();
      setIsConnected(false);
      setOnlineUserIds(new Set<string>());
      return;
    }

    let active = true;
    const socket = connectSocket(accessToken);

    const handleConnect = () => {
      if (!active) return;

      setIsConnected(true);

      socket.emit("presence:get_online", (response: PresenceResponse) => {
        if (!active || !response?.onlineUserIds) return;

        setOnlineUserIds(new Set(response.onlineUserIds));
      });
    };

    const handleDisconnect = () => {
      if (!active) return;

      setIsConnected(false);
    };

    const handlePresenceInit = (data: PresenceResponse) => {
      if (!active || !data?.onlineUserIds) return;

      setOnlineUserIds(new Set(data.onlineUserIds));
    };

    const handleUserOnline = (data: PresenceUserPayload) => {
      if (!active || !data?.userId) return;

      setOnlineUserIds((previous) => {
        const next = new Set(previous);
        next.add(data.userId);
        return next;
      });
    };

    const handleUserOffline = (data: PresenceUserPayload) => {
      if (!active || !data?.userId) return;

      setOnlineUserIds((previous) => {
        const next = new Set(previous);
        next.delete(data.userId);
        return next;
      });
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("presence:init", handlePresenceInit);
    socket.on("user:online", handleUserOnline);
    socket.on("user:offline", handleUserOffline);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      active = false;

      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("presence:init", handlePresenceInit);
      socket.off("user:online", handleUserOnline);
      socket.off("user:offline", handleUserOffline);

      disconnectSocket();
    };
  }, [initialized, userId, accessToken]);

  const isUserOnline = useCallback(
    (targetUserId?: string): boolean => {
      return targetUserId ? onlineUserIds.has(targetUserId) : false;
    },
    [onlineUserIds],
  );

  return (
    <SocketContext.Provider
      value={{ onlineUserIds, isUserOnline, isConnected }}
    >
      {children}
    </SocketContext.Provider>
  );
}
