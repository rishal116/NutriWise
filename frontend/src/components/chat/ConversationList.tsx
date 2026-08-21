"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { conversationService } from "@/services/chat/conversation.service";
import { ConversationResponseDTO } from "@/dtos/chat/conversation-response.dto";
import ConversationListItem from "./ConversationListItem";
import ConversationSearch from "./ConversationSearch";
import ChatLoading from "./ChatLoading";
import ChatError from "./ChatError";
import EmptyChatState from "./EmptyChatState";

interface ConversationListProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  conversations: ConversationResponseDTO[];
  setConversations: React.Dispatch<
    React.SetStateAction<ConversationResponseDTO[]>
  >;
  isMobile: boolean;
  onBack: () => void;
}

// Narrow an unknown error (axios-shaped or plain Error) into a message string.
function getErrorMessage(err: unknown, fallback: string): string {
  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as { response?: { data?: { message?: unknown } } }).response
      ?.data?.message === "string"
  ) {
    return (err as { response: { data: { message: string } } }).response.data
      .message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export default function ConversationList({
  selectedId,
  onSelect,
  conversations,
  setConversations,
  isMobile,
  onBack,
}: ConversationListProps) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const fetchedRef = useRef(false);

  // Role-aware Back to Dashboard handler
  const handleBackToDashboard = () => {
    const role = user?.activeRole;
    let dashboardRoute = "/user/dashboard";
    if (role === "nutritionist") {
      dashboardRoute = "/nutritionist/dashboard";
    } else if (role === "admin") {
      dashboardRoute = "/admin/dashboard";
    }
    router.push(dashboardRoute);
  };

  // Initial fetch ONCE
  const fetchInitialConversations = useCallback(async () => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const response = await conversationService.getConversations(20);
      if (response.success && response.data) {
        setConversations(response.data.items || []);
        setNextCursor(response.data.nextCursor ?? undefined);
        setHasMore(response.data.hasMore);
      } else {
        setError(response.message || "Failed to load conversations");
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load conversations"));
    } finally {
      setLoading(false);
    }
  }, [setConversations]);

  useEffect(() => {
    fetchInitialConversations();
  }, [fetchInitialConversations]);

  // Load more (Cursor pagination)
  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !nextCursor) return;
    setLoadingMore(true);
    try {
      const response = await conversationService.getConversations(
        20,
        nextCursor
      );
      if (response.success && response.data) {
        const newItems = response.data.items || [];
        setConversations((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const filtered = newItems.filter((item) => !existingIds.has(item.id));
          return [...prev, ...filtered];
        });
        setNextCursor(response.data.nextCursor ?? undefined);
        setHasMore(response.data.hasMore);
      }
    } catch (err: unknown) {
      console.error(
        "Failed to fetch next conversations page:",
        getErrorMessage(err, "Unknown error")
      );
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, nextCursor, setConversations]);

  // Scroll detection for bottom threshold
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollHeight - scrollTop - clientHeight < 100) {
      handleLoadMore();
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const name = (c.chatType === "group" ? c.title : c.participant?.name) ?? "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 select-none">
      {/* Sidebar Top Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleBackToDashboard}
            className="px-2.5 py-1.5 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-slate-900 transition-all flex items-center gap-1.5 border border-slate-200/80 group text-xs font-semibold shadow-2xs"
            aria-label="Back to Dashboard"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
            <span>Dashboard</span>
          </button>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Messages
          </h1>
        </div>
      </div>


      {/* Search Input */}
      <div className="px-4 py-3 border-b border-slate-100">
        <ConversationSearch value={search} onChange={setSearch} />
      </div>

      {/* Conversation List / States */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto custom-scrollbar"
      >
        {loading && conversations.length === 0 ? (
          <ChatLoading type="conversations" />
        ) : error && conversations.length === 0 ? (
          <ChatError message={error} onRetry={() => {
            fetchedRef.current = false;
            fetchInitialConversations();
          }} />
        ) : filteredConversations.length === 0 ? (
          <EmptyChatState type="no-conversations" />
        ) : (
          <div className="divide-y divide-slate-100/50">
            {filteredConversations.map((conv) => (
              <ConversationListItem
                key={conv.id}
                conversation={conv}
                isSelected={selectedId === conv.id}
                onSelect={onSelect}
              />
            ))}

            {loadingMore && (
              <div className="p-4 text-center">
                <div className="w-5 h-5 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto" />
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #10b981;
        }
      `}</style>
    </div>
  );
}