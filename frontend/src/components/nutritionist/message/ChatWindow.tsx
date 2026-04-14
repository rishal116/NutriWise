"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Search, MoreVertical, ShieldCheck, Zap, Trash2 } from "lucide-react";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import { userChatService } from "@/services/user/userChat.service";
import { getSocket } from "@/lib/socket";
import { getUserId } from "@/utils/jwt";
import { chatSocket } from "@/socket/chat.socket";

interface Attachment {
  url: string;
  fileName: string;
}

interface Message {
  id: string;
  senderId: string;
  text?: string;
  createdAt: string;
  status?: "sent" | "delivered" | "read";
  type: "text" | "file";
  isEdited?: boolean;
  editedAt?:Date;
  attachments?: Attachment[];
}

interface ChatWindowProps {
  conversationId: string | null;
  onBack: () => void;
}

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

export default function ChatWindow({ conversationId, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<null | { id: string; text: string }>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const socket = getSocket();
  const currentUserId = getUserId();

  /* ---------- FIX: Reset state when switching chats ---------- */
  useEffect(() => {
    setMessageToDelete(null);
    setEditingMessage(null);
    setIsTyping(false);
  }, [conversationId]);

  /* ---------- SOCKET HANDLING ---------- */
  useEffect(() => {
    if (!conversationId || !socket) return;

    chatSocket.join(socket, conversationId);

    const cleanup = chatSocket.register(socket, {
      onReceive: (message: any) => {
        if (!message?.id) return;
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, {
            id: message.id,
            senderId: message.senderId,
            text: message.content,
            createdAt: message.createdAt || new Date().toISOString(),
            isEdited: message.isEdited ?? false,
            editedAt:message.editedAt,
            status: message.status || "sent",
            type: message.type || "text",
            attachments: message.attachments || [],
          }];
        });
      },
      onTyping: (data: any) => {
        if (data?.userId !== currentUserId) setIsTyping(true);
      },
      onStopTyping: () => setIsTyping(false),
      onDelete: (data: any) => {
        if (!data?.messageId) return;
        setMessages((prev) => prev.filter((m) => m.id !== data.messageId));
      },
      onEdit: (data: any) => {
        if (!data?.messageId) return;
        setMessages((prev) => prev.map((m) =>
          m.id === data.messageId ? { ...m, text: data.content, isEdited: true } : m
        ));
      },
    });

    return () => {
      chatSocket.leave(socket, conversationId);
      cleanup();
    };
  }, [conversationId, socket, currentUserId]);

  /* ---------- FETCH MESSAGES ---------- */
  useEffect(() => {
    if (!conversationId) return;
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await userChatService.getMessages(conversationId);
        const data = res?.data ?? [];
        setMessages(data.map((msg: any) => ({
          id: msg.id,
          senderId: msg.senderId,
          text: msg.content,
          createdAt: msg.createdAt || new Date().toISOString(),
          isEdited: msg.isEdited ?? false,
          status: msg.status || "read",
          editedAt:msg.editedAt,
          type: msg.type || "text",
          attachments: msg.attachments || [],
        })));
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [conversationId]);

  /* ---------- DELETE MESSAGE ---------- */
  const confirmDelete = async () => {
    if (!messageToDelete) return;
    try {
      await userChatService.deleteMessage(messageToDelete);
      setMessages((prev) => prev.filter((m) => m.id !== messageToDelete));
      socket?.emit("deleteMessage", { conversationId, messageId: messageToDelete });
    } finally {
      setMessageToDelete(null);
    }
  };

  /* ---------- SCROLL TO BOTTOM ---------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: messages.length > 1 ? "smooth" : "auto",
    });
  }, [messages, isTyping]);

  if (!conversationId) return null;

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden relative">
      
      {/* HEADER */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-emerald-50 flex items-center justify-between px-6 z-30 shadow-sm sticky top-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-emerald-700 hover:bg-emerald-50 rounded-xl md:hidden transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200/50">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>

          <div>
            <h2 className="font-bold text-slate-800 text-base leading-tight">Conversation</h2>
            <div className="flex items-center gap-1.5">
              {isTyping ? (
                <span className="flex gap-1 items-center">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce" />
                  <span className="text-[11px] font-medium text-emerald-600 ml-1">Typing...</span>
                </span>
              ) : (
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Online</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          
          <div className="flex justify-center mb-6">
            <div className="px-4 py-1.5 bg-white border border-emerald-50 rounded-full flex items-center gap-2 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest leading-none">
                Secure Connection
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
              <p className="text-xs font-bold text-emerald-800/20 uppercase tracking-widest">Loading</p>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                id={msg.id}
                text={msg.text || ""}
                createdAt={msg.createdAt}
                isEdited={msg.isEdited}
                editedAt={msg.editedAt}
                type={msg.type}
                attachments={msg.attachments}
                isSender={msg.senderId === currentUserId}
                timestamp={formatIndianTime(msg.createdAt)}
                status={msg.status}
                onDelete={setMessageToDelete}
                onEdit={(id, text) => setEditingMessage({ id, text })}
              />
            ))
          )}
        </div>
        <div ref={bottomRef} className="h-4" />
      </div>

      {/* INPUT */}
      <footer className="p-6 bg-white border-t border-emerald-50">
        <div className="max-w-4xl mx-auto">
          <MessageInput
            conversationId={conversationId}
            editingMessage={editingMessage}
            onCancelEdit={() => setEditingMessage(null)}
           onMessageSent={(newMessage: any) => {
  if (!editingMessage) {
    if (!newMessage?.text && (!newMessage?.attachments || newMessage.attachments.length === 0)) {
      return;
    }

    setMessages((prev) => {
      if (prev.some((m) => m.id === newMessage.id)) return prev;

      return [
        ...prev,
        {
          id: newMessage.id,
          senderId: newMessage.senderId,
          text: newMessage.text || "",
          createdAt: newMessage.createdAt || new Date().toISOString(),
          type: newMessage.type || "text",
          attachments: newMessage.attachments || [],
          status: "sent",
        },
      ];
    });
  }

  setEditingMessage(null);
}}
          />
        </div>
      </footer>

      {/* DELETE MODAL */}
      {messageToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-emerald-50 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-500">
              <Trash2 className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Message?</h3>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed">
              This message will be removed for both participants. This action cannot be undone.
            </p>

            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmDelete}
                className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-200"
              >
                Delete
              </button>
              <button 
                onClick={() => setMessageToDelete(null)}
                className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1fae5; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b981; }
      `}</style>
    </div>
  );
}