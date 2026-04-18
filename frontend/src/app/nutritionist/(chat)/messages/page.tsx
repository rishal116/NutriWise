"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import ConversationList from "@/components/nutritionist/message/ConversationList";
import ChatWindow from "@/components/nutritionist/message/ChatWindow";
import { userChatService } from "@/services/user/userChat.service";

type ChatType = "direct" | "group";

interface ConversationAPI {
  id: string;
  chatType: ChatType;
  otherUserName?: string | null;
  otherUserProfile?: string | null;
  title?: string | null;
  groupAvatar?: string | null;
  memberCount?: number;
  lastMessage?: string | null;
  lastMessageAt?: string | Date | null;
}

interface Conversation {
  id: string;
  chatType: ChatType;
  name: string;
  profile?: string;
  lastMessage: string;
  lastMessageAt: number; // timestamp
  memberCount?: number;
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(350);
  const [isResizing, setIsResizing] = useState(false);
  const router = useRouter();

  // Resize Logic
  // Updated Resize Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(280, Math.min(e.clientX, 600));
      setSidebarWidth(newWidth);
    };

    if (isResizing) {
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", () => setIsResizing(false));
    } else {
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isResizing]);

  // Fetch Logic
  const fetchConversations = useCallback(async (nextCursor?: string | null) => {
    try {
      setLoading(true);
      const res = await userChatService.listUsers(
        "nutritionist",
        nextCursor ?? undefined,
        20,
      );
      const data: ConversationAPI[] = res.data ?? [];
      const formatted: Conversation[] = data.map((u) => ({
        id: u.id,
        chatType: u.chatType,
        name:
          u.chatType === "direct"
            ? (u.otherUserName ?? "User")
            : (u.title ?? "Group"),
        profile:
          u.chatType === "direct"
            ? (u.otherUserProfile ?? undefined)
            : (u.groupAvatar ?? undefined),
        lastMessage: u.lastMessage ?? "No messages yet",
        lastMessageAt: u.lastMessageAt
          ? new Date(u.lastMessageAt).getTime()
          : 0,
        memberCount: u.memberCount,
      }));
      setConversations((prev) =>
        nextCursor ? [...prev, ...formatted] : formatted,
      );
      setCursor(res.nextCursor);
      setHasMore(res.hasMore);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const sortedConversations = useMemo(
    () => [...conversations].sort((a, b) => b.lastMessageAt - a.lastMessageAt),
    [conversations],
  );

  const handleBack = () => {
    if (isMobile && selectedConversation) setSelectedConversation(null);
    else router.back();
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden">
      {/* SIDEBAR */}
      {/* On mobile, if a conversation is selected, hide the sidebar completely. */}
      {/* On desktop, always show the sidebar with the dynamic width. */}
      <aside
        style={{ width: isMobile ? "100%" : `${sidebarWidth}px` }}
        className={`
          ${isMobile && selectedConversation ? "hidden" : "flex"} 
          flex-col bg-white/70 backdrop-blur-xl border-r border-emerald-100/50 
          shadow-xl shadow-emerald-500/5 z-20 shrink-0
        `}
      >
        <ConversationList
          conversations={sortedConversations}
          loading={loading}
          selectedId={selectedConversation?.id ?? null}
          onSelect={setSelectedConversation}
          onBack={handleBack}
          onLoadMore={async () => {
            if (hasMore && !loading) await fetchConversations(cursor);
          }}
        />

        {/* Resizer Handle (Only for desktop) */}
        {!isMobile && (
          <div
            onMouseDown={() => setIsResizing(true)}
            className="group absolute right-0 top-0 bottom-0 w-1 cursor-col-resize z-50 flex items-center justify-center"
          >
            <div className="w-[2px] h-12 bg-emerald-200 group-hover:bg-emerald-500 transition-colors" />
          </div>
        )}
      </aside>

      {/* MAIN CHAT WINDOW */}
      {/* On mobile, use fixed positioning to fill the screen when active. */}
      {/* On desktop, use flex-1 to fill remaining space. */}
      <main
        className={`
          ${
            isMobile
              ? selectedConversation
                ? "fixed inset-0 z-50 bg-white"
                : "hidden"
              : "flex"
          } 
          flex-1 flex-col min-w-0 relative bg-white/30 backdrop-blur-sm
        `}
      >
        {selectedConversation ? (
          <ChatWindow conversation={selectedConversation} onBack={handleBack} />
        ) : (
          /* Empty state only visible on desktop */
          <div className="hidden md:flex items-center justify-center h-full text-emerald-900/30 font-medium">
            Select a conversation to start chatting
          </div>
        )}
      </main>
    </div>
  );
}
