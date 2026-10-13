"use client";

import { useRef, useEffect, type UIEvent } from "react";

import { MessageResponseDTO } from "@/dtos/chat/message-response.dto";

import MessageBubble from "./MessageBubble";
import ChatLoading from "./ChatLoading";
import EmptyChatState from "./EmptyChatState";

interface MessageListProps {
  conversationId?: string;
  messages: MessageResponseDTO[];
  currentUserId?: string;
  loadingOlder: boolean;
  hasMoreOlder: boolean;
  senderAvatar?: string;
  senderName?: string;
  onLoadOlder: () => void;
  onEditMessage: (message: MessageResponseDTO) => void;
  onDeleteMessage: (messageId: string) => void;
}

export default function MessageList({
  conversationId,
  messages,
  currentUserId,
  loadingOlder,
  hasMoreOlder,
  senderAvatar,
  senderName,
  onLoadOlder,
  onEditMessage,
  onDeleteMessage,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const prevScrollHeightRef = useRef(0);
  const isInitialLoadRef = useRef(true);
  const isPrependingRef = useRef(false);
  const prevMessageCountRef = useRef(0);
  const prevConversationIdRef = useRef(conversationId);

  useEffect(() => {
    if (conversationId === prevConversationIdRef.current) return;

    prevConversationIdRef.current = conversationId;
    prevScrollHeightRef.current = 0;
    isInitialLoadRef.current = true;
    isPrependingRef.current = false;
    prevMessageCountRef.current = 0;

    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [conversationId]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;

    if (
      container.scrollTop <= 80 &&
      hasMoreOlder &&
      !loadingOlder &&
      !isPrependingRef.current
    ) {
      prevScrollHeightRef.current = container.scrollHeight;
      isPrependingRef.current = true;
      onLoadOlder();
    }
  };

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    // Wait until the initial messages have arrived, then scroll to the bottom.
    if (isInitialLoadRef.current && messages.length > 0) {
      container.scrollTop = container.scrollHeight;
      isInitialLoadRef.current = false;
      prevMessageCountRef.current = messages.length;
      return;
    }

    // Preserve the viewport when older messages are prepended.
    if (isPrependingRef.current) {
      if (loadingOlder) return;

      const previousHeight = prevScrollHeightRef.current;
      const heightDifference = container.scrollHeight - previousHeight;

      if (previousHeight > 0 && heightDifference >= 0) {
        container.scrollTop += heightDifference;
      }

      prevScrollHeightRef.current = 0;
      isPrependingRef.current = false;
      prevMessageCountRef.current = messages.length;
      return;
    }

    // Scroll down when new messages are appended.
    if (messages.length > prevMessageCountRef.current) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }

    prevMessageCountRef.current = messages.length;
  }, [messages, loadingOlder]);

  if (messages.length === 0 && !loadingOlder) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden">
        <EmptyChatState type="no-messages" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-4 custom-scrollbar sm:px-6"
    >
      {loadingOlder && <ChatLoading type="inline" />}

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-1">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isSender={msg.senderId === currentUserId}
            senderAvatar={senderAvatar}
            senderName={senderName}
            onEdit={onEditMessage}
            onDelete={onDeleteMessage}
          />
        ))}
      </div>

      <div ref={bottomRef} className="h-2 shrink-0" />
    </div>
  );
}
