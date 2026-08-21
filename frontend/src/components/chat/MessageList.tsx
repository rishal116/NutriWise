"use client";

import { useRef, useEffect, UIEvent } from "react";
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
  const prevScrollHeightRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);
  const isPrependingRef = useRef<boolean>(false);
  const prevMessageCountRef = useRef<number>(0);
  const prevConversationIdRef = useRef<string | undefined>(conversationId);

  // Reset scroll state if conversation changes
  useEffect(() => {
    if (conversationId !== prevConversationIdRef.current) {
      isInitialLoadRef.current = true;
      prevMessageCountRef.current = 0;
      prevConversationIdRef.current = conversationId;
    }
  }, [conversationId]);


  // Mark that the next messages update is an older-message prepend,
  // so the scroll-preserving branch below knows to run instead of
  // treating it as a new-message append.
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop < 80 && hasMoreOlder && !loadingOlder) {
      if (containerRef.current) {
        prevScrollHeightRef.current = containerRef.current.scrollHeight;
        isPrependingRef.current = true;
      }
      onLoadOlder();
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Initial load: jump to bottom, no animation.
    if (isInitialLoadRef.current && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
      isInitialLoadRef.current = false;
      prevMessageCountRef.current = messages.length;
      return;
    }

    // Older messages prepended: preserve the user's viewport position
    // instead of yanking them back to the top or bottom.
    if (isPrependingRef.current && prevScrollHeightRef.current > 0) {
      const currentScrollHeight = containerRef.current.scrollHeight;
      const heightDifference = currentScrollHeight - prevScrollHeightRef.current;
      containerRef.current.scrollTop = heightDifference;
      prevScrollHeightRef.current = 0;
      isPrependingRef.current = false;
      prevMessageCountRef.current = messages.length;
      return;
    }

    // New message appended at the bottom (sent or received via socket):
    // scroll it into view.
    if (messages.length > prevMessageCountRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessageCountRef.current = messages.length;
  }, [messages]);

  if (messages.length === 0 && !loadingOlder) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <EmptyChatState type="no-messages" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 custom-scrollbar"
    >
      {/* Top Loading indicator for cursor pagination */}
      {loadingOlder && <ChatLoading type="inline" />}

      <div className="max-w-4xl mx-auto flex flex-col gap-1">
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

      <div ref={bottomRef} className="h-2" />
    </div>
  );
}