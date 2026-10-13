"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import type { IncomingMessagePayload } from "@/socket/chat.socket";
import { useAppSelector } from "@/redux/hooks";
import { conversationService } from "@/services/chat/conversation.service";
import type { ConversationListItemDTO } from "@/dtos/chat/conversation-list-item.dto";
import type { ConversationListFilter } from "@/types/chat/chat.types";
import { getSocket } from "@/lib/socket";
import { chatSocket } from "@/socket/chat.socket";

import ConversationListItem from "./ConversationListItem";
import ConversationSearch from "./ConversationSearch";
import ChatLoading from "./ChatLoading";
import ChatError from "./ChatError";
import EmptyChatState from "./EmptyChatState";

type MessagesBasePath = "/user/messages" | "/nutritionist/messages";

interface ConversationListProps {
  filter: ConversationListFilter;
  messagesBasePath: MessagesBasePath;
}

interface ApiErrorLike {
  response?: {
    data?: {
      message?: unknown;
    };
  };
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "object" && err !== null) {
    const message = (err as ApiErrorLike).response?.data?.message;

    if (typeof message === "string") {
      return message;
    }
  }

  if (err instanceof Error) {
    return err.message;
  }

  return fallback;
}

const TITLES: Record<ConversationListFilter, string> = {
  all: "Messages",
  personal: "Personal",
  group: "Groups",
};

function getNavigation(messagesBasePath: MessagesBasePath) {
  return [
    {
      label: "All",
      filter: "all" as const,
      path: messagesBasePath,
    },
    {
      label: "Personal",
      filter: "personal" as const,
      path: `${messagesBasePath}/personal`,
    },
    {
      label: "Groups",
      filter: "group" as const,
      path: `${messagesBasePath}/group`,
    },
  ];
}

export default function ConversationList({
  filter,
  messagesBasePath,
}: ConversationListProps) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const navigation = getNavigation(messagesBasePath);

  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState<ConversationListItemDTO[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);

  const handleBackToDashboard = useCallback(() => {
    const role = user?.activeRole;

    if (role === "nutritionist") {
      router.push("/nutritionist/dashboard");
      return;
    }

    if (role === "admin") {
      router.push("/admin/dashboard");
      return;
    }

    router.push("/user/dashboard");
  }, [router, user?.activeRole]);

  const handleNavigation = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router],
  );

  const fetchConversations = useCallback(
    async (cursor?: string) => {
      const isInitialLoad = !cursor;
      const requestId = isInitialLoad
        ? ++requestIdRef.current
        : requestIdRef.current;

      const isStale = () => requestId !== requestIdRef.current;

      if (isInitialLoad) {
        setLoading(true);
        setLoadingMore(false);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      try {
        const response = await conversationService.getConversations({
          limit: 20,
          cursor,
          filter,
          search: search.trim() || undefined,
        });

        if (isStale()) return;

        if (!response.success || !response.data) {
          throw new Error(response.message || "Failed to load conversations");
        }

        const { items, nextCursor: newCursor, hasMore: more } = response.data;

        setConversations((prev) => {
          if (isInitialLoad) {
            return items;
          }

          const existingIds = new Set(
            prev.map((conversation) => conversation.conversationId),
          );

          return [
            ...prev,
            ...items.filter(
              (conversation) => !existingIds.has(conversation.conversationId),
            ),
          ];
        });

        setNextCursor(newCursor ?? undefined);
        setHasMore(more);
      } catch (err: unknown) {
        if (isStale()) return;

        const message = getErrorMessage(err, "Failed to load conversations");

        if (isInitialLoad) {
          setConversations([]);
          setNextCursor(undefined);
          setHasMore(false);
          setError(message);
        } else {
          console.error("Failed to fetch next conversations page:", message);
        }
      } finally {
        if (!isStale()) {
          if (isInitialLoad) {
            setLoading(false);
          } else {
            setLoadingMore(false);
          }
        }
      }
    },
    [filter, search],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      void fetchConversations();
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [fetchConversations]);

  const handleLoadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore || !nextCursor) {
      return;
    }

    await fetchConversations(nextCursor);
  }, [loading, loadingMore, hasMore, nextCursor, fetchConversations]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;

    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    if (scrollHeight - scrollTop - clientHeight < 100) {
      void handleLoadMore();
    }
  }, [handleLoadMore]);

  const handleIncomingMessage = useCallback(
    (message: IncomingMessagePayload) => {
      if (!message?.id || !message.conversationId) return;

      const preview =
        message.status === "deleted"
          ? "This message was deleted"
          : message.text?.trim() || message.content?.trim() || "📎 Attachment";

      setConversations((prev) => {
        const index = prev.findIndex(
          (item) => item.conversationId === message.conversationId,
        );

        // The conversation may not be in the loaded page.
        if (index === -1) return prev;

        const updated = {
          ...prev[index],
          lastMessagePreview: preview,
          lastMessageSenderId: message.senderId,
          lastActivityAt: message.createdAt
            ? new Date(message.createdAt).toISOString()
            : new Date().toISOString(),
        };

        return [
          updated,
          ...prev.filter(
            (item) => item.conversationId !== message.conversationId,
          ),
        ];
      });
    },
    [],
  );

  const handleSelectConversation = (conversation: ConversationListItemDTO) => {
    if (!conversation.conversationId) {
      console.error("Missing conversation ID:", conversation);
      return;
    }
    console.log(conversation);

    const type = conversation.chatType === "direct" ? "personal" : "group";

    router.push(`${messagesBasePath}/${type}/${conversation.conversationId}`);
  };

  useEffect(() => {
    const socket = getSocket();

    const cleanup = chatSocket.register(socket, {
      onReceive: handleIncomingMessage,
    });

    return cleanup;
  }, [handleIncomingMessage]);

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden border-r border-slate-200/80 bg-white select-none">
      {/* Header */}
      <header className="shrink-0 border-b border-slate-100 p-3 sm:p-4">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleBackToDashboard}
            className="group flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200/80 px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-2xs transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="Back to Dashboard"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-4 w-4 text-slate-500 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <h1 className="min-w-0 truncate text-lg font-bold tracking-tight text-slate-800 sm:text-xl">
            {TITLES[filter]}
          </h1>
        </div>
      </header>

      {/* Messages Navigation */}
      <nav
        aria-label="Message navigation"
        className="shrink-0 border-b border-slate-100 bg-white"
      >
        <div className="flex overflow-x-auto px-3 scrollbar-none sm:px-4">
          {navigation.map((item) => {
            const isActive = item.filter === filter;

            return (
              <button
                key={item.filter}
                type="button"
                onClick={() => handleNavigation(item.path)}
                aria-current={isActive ? "page" : undefined}
                className={`relative shrink-0 px-3 py-3 text-sm font-medium transition-colors sm:px-4 ${
                  isActive
                    ? "text-emerald-600"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {item.label}

                {isActive && (
                  <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-emerald-600 sm:inset-x-4" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Search */}
      <div className="shrink-0 border-b border-slate-100 px-3 py-2.5 sm:px-4 sm:py-3">
        <ConversationSearch value={search} onChange={setSearch} />
      </div>

      {/* Scrollable conversation list */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="custom-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain"
      >
        {loading ? (
          <ChatLoading type="conversations" />
        ) : error ? (
          <ChatError
            message={error}
            onRetry={() => void fetchConversations()}
          />
        ) : conversations.length === 0 ? (
          <EmptyChatState type="no-conversations" />
        ) : (
          <div className="divide-y divide-slate-100/50">
            {conversations.map((conversation) => (
              <ConversationListItem
                key={conversation.conversationId}
                conversation={conversation}
                isSelected={false}
                onSelect={() => handleSelectConversation(conversation)}
              />
            ))}

            {loadingMore && (
              <div className="p-4 text-center">
                <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
