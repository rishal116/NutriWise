"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Search, MoreVertical, ShieldCheck } from "lucide-react";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import { userChatService } from "@/services/user/userChat.service";
import { getSocket } from "@/lib/socket";
import { getUserId } from "@/utils/jwt";
import { chatSocket } from "@/socket/chat.socket";
import Image from "next/image";

/* ---------------- TYPES ---------------- */

interface Attachment {
  url: string;
  fileName: string;
}

interface Message {
  id: string;
  senderId: string;

  senderFullName: string;
  senderProfileImage?: string;

  content: string;
  createdAt: string;

  status?: "sent" | "delivered" | "read";
  type: "text" | "file";

  isEdited?: boolean;
  editedAt?: Date;

  attachments?: Attachment[];
}

/* FIX: ADD conversation type */
interface Conversation {
  id: string;
  name: string;
  profile?: string;
  chatType: "direct" | "group";
}

/* ---------------- PROPS ---------------- */

interface ChatWindowProps {
  conversation: Conversation | null;
  onBack: () => void;
}

/* ---------------- HELPERS ---------------- */

const formatIndianTime = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getInitial = (name?: string) =>
  name?.trim()?.charAt(0).toUpperCase() || "?";

/* ---------------- COMPONENT ---------------- */

export default function ChatWindow({ conversation, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<null | {
    id: string;
    text: string;
  }>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const socket = getSocket();
  const currentUserId = getUserId();

  /* RESET */
  useEffect(() => {
    setMessageToDelete(null);
    setEditingMessage(null);
    setIsTyping(false);
  }, [conversation?.id]);

  /* SOCKET */
  useEffect(() => {
    if (!conversation?.id || !socket) return;

    chatSocket.join(socket, conversation.id);

    const cleanup = chatSocket.register(socket, {
      onReceive: (message: any) => {
        if (!message?.id) return;

        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;

          return [
            ...prev,
            {
              id: message.id,
              senderId: message.senderId,
              senderFullName: message.senderFullName,
              senderProfileImage: message.senderProfileImage,
              content: message.content,
              createdAt: message.createdAt || new Date().toISOString(),
              isEdited: message.isEdited ?? false,
              editedAt: message.editedAt,
              status: message.status || "sent",
              type: message.type || "text",
              attachments: message.attachments || [],
            },
          ];
        });
      },

      onTyping: (data: { userId: string }) => {
        if (data?.userId !== currentUserId) setIsTyping(true);
      },

      onStopTyping: () => setIsTyping(false),

      onDelete: (data: { messageId: string }) => {
        setMessages((prev) => prev.filter((m) => m.id !== data.messageId));
      },

      onEdit: (data: { messageId: string; content: string }) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === data.messageId
              ? { ...m, content: data.content, isEdited: true }
              : m,
          ),
        );
      },
    });

    return () => {
      chatSocket.leave(socket, conversation.id);
      cleanup();
    };
  }, [conversation?.id, socket, currentUserId]);

  /* FETCH */
  useEffect(() => {
    if (!conversation?.id) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);

        const res = await userChatService.getMessages(conversation.id);
        const data: any[] = res?.data ?? [];

        setMessages(
          data.map((msg) => ({
            id: msg.id,
            senderId: msg.senderId,
            senderFullName: msg.senderFullName,
            senderProfileImage: msg.senderProfileImage,
            content: msg.content,
            createdAt: msg.createdAt,
            isEdited: msg.isEdited ?? false,
            type: msg.type || "text",
            attachments: msg.attachments || [],
          })),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversation?.id]);

  /* AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!conversation) return null;

  const isGroup = conversation.chatType === "group";

  return (
    <div className="flex flex-col h-full bg-[#f1f5f9] overflow-hidden">
      {/* HEADER: Modern Glass Effect */}
      <header className="h-[72px] bg-white/95 backdrop-blur-md border-b border-teal-100 flex items-center justify-between px-6 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-teal-50 rounded-full transition-colors text-teal-700"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-md">
            {conversation.profile ? (
              <Image
                src={conversation.profile}
                alt="profile"
                width={48}
                height={48}
                className="object-cover"
              />
            ) : (
              conversation.name?.charAt(0).toUpperCase()
            )}
          </div>

          <div>
            <h2 className="font-semibold text-slate-900 text-lg leading-tight">
              {conversation.name}
            </h2>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${isTyping ? "bg-emerald-500 animate-pulse" : "bg-teal-500"}`}
              />
              <p className="text-xs font-medium text-slate-500">
                {isTyping ? "typing..." : "Online"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-1 text-teal-700">
          <button className="p-2 hover:bg-teal-50 rounded-full transition-all">
            <Search size={20} />
          </button>
          <button className="p-2 hover:bg-teal-50 rounded-full transition-all">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* MESSAGES AREA: Clean Background */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        <div className="flex justify-center">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white/50 rounded-full text-[11px] font-medium text-slate-500 border border-teal-100 shadow-sm">
            <ShieldCheck size={14} className="text-teal-600" />
            End-to-end encrypted
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-4 text-teal-600">
            Loading messages...
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isMe ? "justify-end" : "justify-start"}`}
              >
                {!isMe && (
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs shrink-0 mt-1">
                    {msg.senderProfileImage ? (
                      <Image
                        src={msg.senderProfileImage}
                        alt=""
                        width={32}
                        height={32}
                      />
                    ) : (
                      getInitial(msg.senderFullName)
                    )}
                  </div>
                )}
                <MessageBubble
                  id={msg.id}
                  text={msg.content}
                  createdAt={msg.createdAt}
                  isEdited={msg.isEdited}
                  editedAt={msg.editedAt}
                  type={msg.type}
                  attachments={msg.attachments}
                  isSender={isMe}
                  timestamp={formatIndianTime(msg.createdAt)}
                />
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT: Elevated Footer */}
      <footer className="p-4 bg-white border-t border-teal-100 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
        <MessageInput
          conversationId={conversation.id}
          editingMessage={editingMessage}
          onCancelEdit={() => setEditingMessage(null)}
          onMessageSent={(newMessage: Message) => {
            setMessages((prev) => [...prev, newMessage]);
          }}
        />
      </footer>
    </div>
  );
}
