"use client";

import { useEffect } from "react";
import { connectSocket } from "@/lib/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function SocketProvider({ children }: { children: React.ReactNode }) {

  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (token) {
      connectSocket(token);
    }
  }, [token]);

  return <>{children}</>;
}