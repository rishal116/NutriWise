"use client";

import { useCallback, useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import {
  onChatMessage,
  sendChatMessage,
  type ChatMessagePayload,
} from "@/socket/video.socket";
import { CHAT_HISTORY_LIMIT, CHAT_MAX_LENGTH } from "@/lib/webrtc/config";

/** In-memory only: history lives in React state and is lost on leave/refresh. */
export const useCallChat = (socket: Socket | null, roomId: string) => {
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);

  useEffect(() => {
    if (!socket) {
      setMessages([]);
      return;
    }

    return onChatMessage(socket, (message) => {
      setMessages((prev) => [...prev, message].slice(-CHAT_HISTORY_LIMIT));
    });
  }, [socket]);

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim().slice(0, CHAT_MAX_LENGTH);
      if (!socket || !trimmed) return;
      sendChatMessage(socket, { roomId, text: trimmed });
    },
    [socket, roomId],
  );

  return { messages, send };
};
