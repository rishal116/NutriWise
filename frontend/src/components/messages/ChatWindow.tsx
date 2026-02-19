"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, Video, MoreVertical, ChevronLeft, ShieldCheck } from "lucide-react";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import { userChatService } from "@/services/user/userChat.service";
import { getSocket } from "@/lib/socket";
import { getUserId } from "@/utils/jwt";

interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  status?: "sent" | "delivered" | "read";
}

interface ChatWindowProps {
  conversationId: string | null;
  onBack?: () => void;
}

export default function ChatWindow({ conversationId, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const currentUserId = getUserId();
  const [editingMessage, setEditingMessage] = useState<null | {id: string, text: string}>(null);
  const socket = getSocket();

  // 1. Socket Logic: Messages, Typing, and Deletion
  useEffect(() => {
    if (!conversationId || !socket) return;

    socket.emit("joinConversation", conversationId);

    const handleReceive = (message: any) => {
      if (message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message]);
        setIsTyping(false); // Reset typing when message arrives
      }
    };

    const handleTyping = (data: { conversationId: string; isTyping: boolean }) => {
      if (data.conversationId === conversationId) {
        setIsTyping(data.isTyping);
      }
    };

    const handleDelete = (data: { messageId: string }) => {
      setMessages((prev) => prev.filter((m) => m.id !== data.messageId));
    };

    const handleEdit = (data: { messageId: string; newText: string }) => {
  setMessages((prev) =>
    prev.map((m) =>
      m.id === data.messageId
        ? { ...m, text: data.newText }
        : m
    )
  );
};

socket.on("messageEdited", handleEdit);


    socket.on("receiveMessage", handleReceive);
    socket.on("userTyping", handleTyping);
    socket.on("messageDeleted", handleDelete);

    return () => {
      socket.emit("leaveConversation", conversationId);
      socket.off("messageEdited", handleEdit);
      socket.off("receiveMessage", handleReceive);
      socket.off("userTyping", handleTyping);
      socket.off("messageDeleted", handleDelete);
    };
  }, [conversationId, socket]);

  // 2. Fetch History
  useEffect(() => {
    if (!conversationId) return;
    (async () => {
      try {
        setLoading(true);
        const data = await userChatService.getMessages(conversationId);
        setMessages(data.map((msg: any) => ({
          id: msg.id,
          senderId: msg.senderId,
          text: msg.content,
          createdAt: msg.createdAt,
          status: msg.status || "read",
        })));
      } finally {
        setLoading(false);
      }
    })();
  }, [conversationId]);

  // 3. Message Deletion Handler
  const onDeleteMessage = async (messageId: string) => {
    try {
      await userChatService.deleteMessage(messageId); // API Call
      setMessages((prev) => prev.filter((m) => m.id !== messageId)); // Local Update
      socket?.emit("deleteMessage", { conversationId, messageId }); // Sync with other user
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  

// Pass this to MessageBubble
const handleEditInitiated = (id: string, text: string) => {
  setEditingMessage({ id, text });
  // This could open a modal or change the MessageInput to "Edit Mode"
};

  // 4. Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: messages.length > 1 ? "smooth" : "auto",
    });
  }, [messages, isTyping]);

  if (!conversationId) return null;

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <header className="h-20 border-b border-gray-100 flex items-center justify-between px-6 bg-white/90 backdrop-blur-xl sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold shadow-inner">
              N
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-1">
              <h2 className="font-bold text-gray-900 tracking-tight">Dr. Nutritionist</h2>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-xs font-medium text-emerald-500">Active now</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all">
            <Video className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8 bg-gray-50/50">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Encryption Notice */}
          <div className="flex justify-center mb-8">
            <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[10px] text-gray-400 font-medium uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" /> End-to-end encrypted
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col gap-4 animate-pulse">
              <div className="h-12 w-1/2 bg-gray-200 rounded-2xl" />
              <div className="h-12 w-1/3 bg-gray-200 rounded-2xl self-end" />
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble
  key={msg.id}
  id={msg.id}
  text={msg.text}
  isSender={msg.senderId === currentUserId}
  timestamp={msg.createdAt}
  status={msg.status}
  onDelete={onDeleteMessage}
  onEdit={handleEditInitiated}
/>
              ))}
              
              {/* Real-time Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 px-4 py-2 animate-in fade-in duration-300">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium italic">Nutritionist is typing...</span>
                </div>
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
<MessageInput
  conversationId={conversationId}
  editingMessage={editingMessage}
  onCancelEdit={() => setEditingMessage(null)}
  onMessageSent={(newMessage) =>
    setMessages((prev) => [...prev, newMessage])
  }
/>
        </div>
      </div>
    </div>
  );
}