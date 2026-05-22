import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const s = getSocket();
      if (s) {
        setSocket(s);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return socket;
};