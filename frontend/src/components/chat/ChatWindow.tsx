"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "@/redux/hooks";
import { MessageService } from "@/services/chat/message.service";
import { ConversationResponseDTO } from "@/dtos/chat/conversation-response.dto";
import { MessageResponseDTO } from "@/dtos/chat/message-response.dto";
import { MessageType } from "@/types/chat/message.types";
import { getSocket } from "@/lib/socket";
import { getErrorMessage } from "@/utils/getErrorMessage";
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

  const socket = getSocket();

  const fetchInitialMessages = useCallback(async () => {
    if (!conversationId) return;

    setLoading(true);
    setError(null);
    setIsPlanExpired(false);
    setMessages([]);

    try {
      MessageService.markAsRead(conversationId).catch(() => {});
      onMarkAsSeen?.(conversationId);

      const res = await MessageService.getMessages(conversationId, 30);

      if (res.success && res.data) {
        setMessages(res.data.items || []);
        setNextCursor(res.data.nextCursor ?? undefined);
        setHasMoreOlder(res.data.hasMore);
      } else {
        setError(res.message || "Failed to load messages");
      }
    } catch (err: unknown) {
      const message = getErrorMessage(err);

      if (message.toLowerCase().includes("expired")) {
        setIsPlanExpired(true);
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [conversationId, onMarkAsSeen]);

  useEffect(() => {
    void fetchInitialMessages();
    setEditingMessage(null);
  }, [fetchInitialMessages]);

  const handleLoadOlderMessages = useCallback(async () => {
    if (loadingOlder || !hasMoreOlder || !nextCursor || !conversationId) {
      return;
    }

    setLoadingOlder(true);

    try {
      const res = await MessageService.getMessages(
        conversationId,
        30,
        nextCursor,
      );

      if (res.success && res.data) {
        const olderItems = res.data.items || [];

        setMessages((previous) => {
          const existingIds = new Set(previous.map((message) => message.id));
          const filtered = olderItems.filter(
            (message) => !existingIds.has(message.id),
          );

          return [...filtered, ...previous];
        });

        setNextCursor(res.data.nextCursor ?? undefined);
        setHasMoreOlder(res.data.hasMore);
      }
    } catch (err: unknown) {
      console.error("Failed to load older messages:", getErrorMessage(err));
    } finally {
      setLoadingOlder(false);
    }
  }, [loadingOlder, hasMoreOlder, nextCursor, conversationId]);

  useEffect(() => {
    if (!conversationId || !socket) return;

    chatSocket.join(socket, conversationId);

    const cleanup = chatSocket.register(socket, {
      onReceive: (incoming: IncomingMessagePayload) => {
        if (!incoming?.id) return;

        const messagePreview =
          incoming.text || incoming.content || "📎 Attachment";

        setMessages((previous) => {
          if (previous.some((message) => message.id === incoming.id)) {
            return previous;
          }

          const formatted: MessageResponseDTO = {
            id: incoming.id,
            conversationId,
            senderId: incoming.senderId,
            text: incoming.text || incoming.content,
            attachments: incoming.attachments || [],
            messageType:
              incoming.messageType || incoming.type || MessageType.TEXT,
            replyTo: incoming.replyTo,
            status: incoming.status || "active",
            createdAt: incoming.createdAt
              ? new Date(incoming.createdAt)
              : new Date(),
          };

          return [...previous, formatted];
        });

        onLastMessageUpdate?.(conversationId, messagePreview);
      },

      onDelete: (data: DeleteSocketPayload) => {
        if (!data?.messageId) return;

        setMessages((previous) =>
          previous.map((message) =>
            message.id === data.messageId
              ? { ...message, status: "deleted" }
              : message,
          ),
        );
      },

      onEdit: (data: EditSocketPayload) => {
        if (!data?.messageId) return;

        setMessages((previous) =>
          previous.map((message) =>
            message.id === data.messageId
              ? {
                  ...message,
                  text: data.content || data.text,
                  status: "edited",
                }
              : message,
          ),
        );
      },
    });

    return () => {
      chatSocket.leave(socket, conversationId);
      cleanup();
    };
  }, [conversationId, socket, onLastMessageUpdate]);

  const handleSendMessage = async (text: string) => {
    if (!conversationId) return;

    try {
      let newMessage: MessageResponseDTO | null = null;

      if (socket?.connected) {
        try {
          newMessage = await chatSocket.sendMessage(socket, {
            conversationId,
            text,
            messageType: MessageType.TEXT,
          });
        } catch (socketError: unknown) {
          const message = getErrorMessage(socketError);

          if (message.toLowerCase().includes("expired")) {
            setIsPlanExpired(true);
            toast.error(message);
            throw socketError;
          }

          const response = await MessageService.sendMessage(
            conversationId,
            text,
          );

          if (response.success && response.data) {
            newMessage = response.data;
          } else {
            throw new Error(response.message || "Failed to send message");
          }
        }
      } else {
        const response = await MessageService.sendMessage(conversationId, text);

        if (response.success && response.data) {
          newMessage = response.data;
        } else {
          throw new Error(response.message || "Failed to send message");
        }
      }

      if (newMessage) {
        setMessages((previous) => {
          if (previous.some((message) => message.id === newMessage.id)) {
            return previous;
          }

          return [...previous, newMessage];
        });

        onLastMessageUpdate?.(
          conversationId,
          newMessage.text || "📎 Attachment",
        );
      }
    } catch (err: unknown) {
      const message = getErrorMessage(err);

      if (message.toLowerCase().includes("expired")) {
        setIsPlanExpired(true);
      }

      toast.error(message);
      throw err;
    }
  };

  const handleSendFile = async (file: File) => {
    if (!conversationId) return;

    try {
      const response = await MessageService.sendFile(conversationId, file);

      if (response.success && response.data) {
        const newMessage = response.data;

        setMessages((previous) => {
          if (previous.some((message) => message.id === newMessage.id)) {
            return previous;
          }

          return [...previous, newMessage];
        });

        onLastMessageUpdate?.(
          conversationId,
          file.type.startsWith("audio/") ? "🎤 Voice message" : "📎 Attachment",
        );
      } else {
        throw new Error(response.message || "Failed to send attachment");
      }
    } catch (err: unknown) {
      const message = getErrorMessage(err);

      if (message.toLowerCase().includes("expired")) {
        setIsPlanExpired(true);
      }

      toast.error(message);
      throw err;
    }
  };

  const handleSaveEdit = async (messageId: string, newText: string) => {
    try {
      const response = await MessageService.editMessage(messageId, newText);

      if (response.success && response.data) {
        setMessages((previous) =>
          previous.map((message) =>
            message.id === messageId
              ? { ...message, text: newText, status: "edited" }
              : message,
          ),
        );
      } else {
        throw new Error(response.message || "Failed to edit message");
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await MessageService.deleteMessage(messageId);

      setMessages((previous) =>
        previous.map((message) =>
          message.id === messageId
            ? { ...message, status: "deleted" }
            : message,
        ),
      );
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  if (!conversation) return null;

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-slate-50">
      {/* Fixed-height header: never scrolls with messages */}
      <div className="relative z-20 shrink-0 bg-white">
        <ChatHeader conversation={conversation} onBack={onBack} />
      </div>

      {/* Only the message area can shrink and scroll */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        {loading ? (
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
            <ChatLoading type="messages" />
          </div>
        ) : error ? (
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
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
      </div>

      {/* Fixed-height composer: stays visible at the bottom */}
      <div className="relative z-10 shrink-0 bg-white">
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
    </div>
  );
}
