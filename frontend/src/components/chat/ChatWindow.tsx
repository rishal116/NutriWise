"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "@/redux/hooks";
import { MessageService } from "@/services/chat/message.service";
import { ConversationResponseDTO } from "@/dtos/chat/conversation-response.dto";
import { MessageResponseDTO } from "@/dtos/chat/message-response.dto";
import { MessageType } from "@/types/chat/message.types";
import { getSocket } from "@/lib/socket";
import {
  chatSocket,
  IncomingMessagePayload,
  DeleteSocketPayload,
  EditSocketPayload,
} from "@/socket/chat.socket";
import { toast } from "sonner";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatLoading from "./ChatLoading";
import ChatError from "./ChatError";

interface ChatWindowProps {
  conversation: ConversationResponseDTO | null;
  onBack: () => void;
  onMarkAsSeen?: (conversationId: string) => void;
  onLastMessageUpdate?: (conversationId: string, lastMessage: string) => void;
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

export default function ChatWindow({
  conversation,
  onBack,
  onMarkAsSeen,
  onLastMessageUpdate,
}: ChatWindowProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id;

  const [messages, setMessages] = useState<MessageResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [hasMoreOlder, setHasMoreOlder] = useState(false);
  const [isPlanExpired, setIsPlanExpired] = useState(false);
  const [editingMessage, setEditingMessage] =
    useState<MessageResponseDTO | null>(null);

  const conversationId = conversation?.id;
  const isReadOnly = conversation ? conversation.status !== "active" : false;

  // Socket instance
  const socket = getSocket();

  // Mark as read and fetch initial messages on conversation selection
  const fetchInitialMessages = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);
    setError(null);
    setIsPlanExpired(false);
    try {
      // 1. Mark as read on backend & update local state
      MessageService.markAsRead(conversationId).catch(() => {});
      if (onMarkAsSeen) onMarkAsSeen(conversationId);

      // 2. Get initial messages
      const res = await MessageService.getMessages(conversationId, 30);
      if (res.success && res.data) {
        const items = res.data.items || [];
        setMessages(items);
        setNextCursor(res.data.nextCursor ?? undefined);
        setHasMoreOlder(res.data.hasMore);
      } else {
        setError(res.message || "Failed to load messages");
      }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Failed to load messages");
      if (msg.includes("expired")) {
        setIsPlanExpired(true);
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [conversationId, onMarkAsSeen]);

  useEffect(() => {
    fetchInitialMessages();
    setEditingMessage(null);
  }, [fetchInitialMessages]);

  // Load older messages (Cursor pagination when scrolling top)
  const handleLoadOlderMessages = useCallback(async () => {
    if (loadingOlder || !hasMoreOlder || !nextCursor || !conversationId) return;
    setLoadingOlder(true);
    try {
      const res = await MessageService.getMessages(
        conversationId,
        30,
        nextCursor,
      );
      if (res.success && res.data) {
        const olderItems = res.data.items || [];
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const filtered = olderItems.filter((m) => !existingIds.has(m.id));
          return [...filtered, ...prev];
        });
        setNextCursor(res.data.nextCursor ?? undefined);
        setHasMoreOlder(res.data.hasMore);
      }
    } catch (err: unknown) {
      console.error(
        "Failed to load older messages:",
        getErrorMessage(err, "Unknown error"),
      );
    } finally {
      setLoadingOlder(false);
    }
  }, [loadingOlder, hasMoreOlder, nextCursor, conversationId]);

  // Socket setup
  useEffect(() => {
    if (!conversationId || !socket) return;
    chatSocket.join(socket, conversationId);

    const cleanup = chatSocket.register(socket, {
      onReceive: (incoming: IncomingMessagePayload) => {
        if (!incoming?.id) return;
        const msgText = incoming.text || incoming.content || "📎 Attachment";

        setMessages((prev) => {
          if (prev.some((m) => m.id === incoming.id)) return prev;
          const formatted: MessageResponseDTO = {
            id: incoming.id,
            conversationId,
            senderId: incoming.senderId,
            text: incoming.text || incoming.content,
            attachments: incoming.attachments || [],
            messageType:
              incoming.messageType || incoming.type || MessageType.TEXT,
            status: incoming.status || "active",
            createdAt: incoming.createdAt
              ? new Date(incoming.createdAt)
              : new Date(),
            updatedAt: incoming.updatedAt
              ? new Date(incoming.updatedAt)
              : new Date(),
          };
          return [...prev, formatted];
        });

        if (onLastMessageUpdate) {
          onLastMessageUpdate(conversationId, msgText);
        }
      },
      onDelete: (data: DeleteSocketPayload) => {
        if (!data?.messageId) return;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === data.messageId ? { ...m, status: "deleted" } : m,
          ),
        );
      },
      onEdit: (data: EditSocketPayload) => {
        if (!data?.messageId) return;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === data.messageId
              ? { ...m, text: data.content || data.text, status: "edited" }
              : m,
          ),
        );
      },
    });

    return () => {
      chatSocket.leave(socket, conversationId);
      cleanup();
    };
  }, [conversationId, socket, onLastMessageUpdate]);

  // Action Handlers
  const handleSendMessage = async (text: string) => {
    if (!conversationId) return;
    try {
      let newMsg: MessageResponseDTO | null = null;

      if (socket && socket.connected) {
        try {
          newMsg = await chatSocket.sendMessage(socket, {
            conversationId,
            text,
            // Required by SendMessagePayload/SendMessageDTO. Defaulting to
            // TEXT since this handler only ever sends plain text (file
            // sends go through handleSendFile/MessageService.sendFile
            // below, not this socket path) — confirm that assumption holds.
            messageType: MessageType.TEXT,
          });
        } catch (socketErr: unknown) {
          const socketErrMsg = getErrorMessage(socketErr, "");
          if (socketErrMsg.includes("expired")) {
            setIsPlanExpired(true);
            toast.error(socketErrMsg);
            throw socketErr;
          }
          // Socket failed, fallback to REST API
          const res = await MessageService.sendMessage(conversationId, text);
          if (res.success && res.data) newMsg = res.data;
        }
      } else {
        const res = await MessageService.sendMessage(conversationId, text);
        if (res.success && res.data) newMsg = res.data;
      }

      if (newMsg) {
        const messageToAppend = newMsg;
        setMessages((prev) => {
          if (prev.some((m) => m.id === messageToAppend.id)) return prev;
          return [...prev, messageToAppend];
        });
        if (onLastMessageUpdate) {
          onLastMessageUpdate(
            conversationId,
            messageToAppend.text || "📎 Attachment",
          );
        }
      }
    } catch (err: unknown) {
      const errMsg = getErrorMessage(err, "Failed to send message");
      if (errMsg.includes("expired")) {
        setIsPlanExpired(true);
      }
      toast.error(errMsg);
      throw err;
    }
  };

  const handleSendFile = async (file: File) => {
    if (!conversationId) return;
    try {
      const res = await MessageService.sendFile(conversationId, file);
      if (res.success && res.data) {
        const newMsg = res.data;
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        if (onLastMessageUpdate) {
          onLastMessageUpdate(conversationId, "📎 Attachment");
        }
      }
    } catch (err: unknown) {
      const errMsg = getErrorMessage(err, "Failed to upload file");
      if (errMsg.includes("expired")) {
        setIsPlanExpired(true);
      }
      toast.error(errMsg);
      throw err;
    }
  };

  const handleSaveEdit = async (messageId: string, newText: string) => {
    try {
      const res = await MessageService.editMessage(messageId, newText);
      if (res.success && res.data) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, text: newText, status: "edited" } : m,
          ),
        );
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to edit message"));
      throw err;
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await MessageService.deleteMessage(messageId);
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, status: "deleted" } : m)),
      );
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to delete message"));
    }
  };

  if (!conversation) return null;

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Header */}
      <ChatHeader conversation={conversation} onBack={onBack} />

      {/* Message List / States */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <ChatLoading type="messages" />
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <ChatError message={error} onRetry={fetchInitialMessages} />
        </div>
      ) : (
        <MessageList
          conversationId={conversation.id}
          messages={messages}
          currentUserId={currentUserId}
          loadingOlder={loadingOlder}
          hasMoreOlder={hasMoreOlder}
          senderAvatar={conversation.participant?.profileImage}
          senderName={conversation.participant?.name}
          onLoadOlder={handleLoadOlderMessages}
          onEditMessage={setEditingMessage}
          onDeleteMessage={handleDeleteMessage}
        />
      )}

      {/* Composer Input */}
      <MessageInput
        conversationId={conversation.id}
        isReadOnly={isReadOnly}
        isPlanExpired={isPlanExpired}
        editingMessage={editingMessage}
        onCancelEdit={() => setEditingMessage(null)}
        onSendMessage={handleSendMessage}
        onSendFile={handleSendFile}
        onSaveEdit={handleSaveEdit}
      />
    </div>
  );
}
