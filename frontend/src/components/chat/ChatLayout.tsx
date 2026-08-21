"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ConversationResponseDTO } from "@/dtos/chat/conversation-response.dto";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import EmptyChatState from "./EmptyChatState";

interface ChatLayoutProps {
  initialConversationId?: string | null;
}

export default function ChatLayout({ initialConversationId }: ChatLayoutProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(initialConversationId || null);
  const [conversations, setConversations] = useState<ConversationResponseDTO[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Handle screen resize for responsive mode
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Find selected conversation object from loaded list, or fallback draft
  const selectedConversation =
    conversations.find((c) => c.id === selectedId) ||
    (selectedId
      ? {
          id: selectedId,
          chatType: "direct" as const,
          purpose: "coaching" as const,
          status: "active" as const,
          unreadCount: 0,
          isMuted: false,
          isArchived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      : null);

  const handleSelectConversation = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleMarkAsSeen = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
    );
  }, []);

  const handleLastMessageUpdate = useCallback(
    (conversationId: string, lastMessage: string) => {
      const nowStr = new Date().toISOString();
      setConversations((prev) => {
        const exists = prev.some((c) => c.id === conversationId);
        if (!exists) return prev;

        return prev.map((c) => {
          if (c.id !== conversationId) return c;
          return {
            ...c,
            lastMessage,
            lastActivityAt: nowStr,
            updatedAt: nowStr,
          };
        });
      });
    },
    []
  );

  const handleBack = () => {
    if (isMobile && selectedId) {
      setSelectedId(null);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans">
      {/* Sidebar - Conversation List */}
      <aside
        className={`flex flex-col bg-white transition-all duration-300 z-20 ${
          isMobile
            ? `fixed inset-0 w-full ${
                selectedId ? "-translate-x-full" : "translate-x-0"
              }`
            : "w-[32%] min-w-[340px] max-w-[420px]"
        }`}
      >
        <ConversationList
          selectedId={selectedId}
          onSelect={handleSelectConversation}
          conversations={conversations}
          setConversations={setConversations}
          isMobile={isMobile}
          onBack={handleBack}
        />
      </aside>

      {/* Main View - Chat Window */}
      <main
        className={`flex-1 flex flex-col bg-white transition-all duration-300 relative ${
          isMobile
            ? `fixed inset-0 ${
                selectedId ? "translate-x-0" : "translate-x-full"
              }`
            : ""
        }`}
      >
        {selectedId && selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            onBack={handleBack}
            onMarkAsSeen={handleMarkAsSeen}
            onLastMessageUpdate={handleLastMessageUpdate}
          />
        ) : (
          <EmptyChatState type="no-selected" />
        )}
      </main>
    </div>
  );
}

