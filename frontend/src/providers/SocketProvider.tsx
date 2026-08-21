"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { connectSocket } from "@/lib/socket";
import { useAppSelector } from "@/redux/hooks";

interface SocketContextType {
  onlineUserIds: Set<string>;
  isUserOnline: (userId?: string) => boolean;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  onlineUserIds: new Set(),
  isUserOnline: () => false,
  isConnected: false,
});

export const usePresence = () => useContext(SocketContext);

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAppSelector((state) => state.auth.user);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    const socket = connectSocket();

    const handleConnect = () => {
      setIsConnected(true);
      socket.emit("presence:get_online", (res: { onlineUserIds: string[] }) => {
        if (res?.onlineUserIds) {
          setOnlineUserIds(new Set(res.onlineUserIds));
        }
      });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handlePresenceInit = (data: { onlineUserIds: string[] }) => {
      if (data?.onlineUserIds) {
        setOnlineUserIds(new Set(data.onlineUserIds));
      }
    };

    const handleUserOnline = (data: { userId: string }) => {
      if (data?.userId) {
        setOnlineUserIds((prev) => new Set([...prev, data.userId]));
      }
    };

    const handleUserOffline = (data: { userId: string }) => {
      if (data?.userId) {
        setOnlineUserIds((prev) => {
          const next = new Set(prev);
          next.delete(data.userId);
          return next;
        });
      }
    };

    if (socket.connected) {
      handleConnect();
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("presence:init", handlePresenceInit);
    socket.on("user:online", handleUserOnline);
    socket.on("user:offline", handleUserOffline);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("presence:init", handlePresenceInit);
      socket.off("user:online", handleUserOnline);
      socket.off("user:offline", handleUserOffline);
    };
  }, [user]);

  const isUserOnline = (userId?: string): boolean => {
    if (!userId) return false;
    return onlineUserIds.has(userId);
  };

  return (
    <SocketContext.Provider value={{ onlineUserIds, isUserOnline, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

