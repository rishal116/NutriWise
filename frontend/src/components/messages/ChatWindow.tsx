"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, Video, ChevronLeft, ShieldCheck, X } from "lucide-react";
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

  // 1. Socket Logic
  useEffect(() => {
    if (!conversationId || !socket) return;

    socket.emit("joinConversation", conversationId);

    const handleReceive = (message: any) => {
      if (message.conversationId === conversationId) {
        setMessages((prev) => [...prev, {
          id: message.id,
          senderId: message.senderId,
          text: message.content || message.text,
          createdAt: message.createdAt,
          status: message.status || "sent"
        }]);
        setIsTyping(false);
      }
    };

    const handleTyping = (data: { conversationId: string; isTyping: boolean }) => {
      if (data.conversationId === conversationId) setIsTyping(data.isTyping);
    };

    const handleDelete = (data: { messageId: string }) => {
      setMessages((prev) => prev.filter((m) => m.id !== data.messageId));
    };

    const handleEdit = (data: { messageId: string; newText: string }) => {
      setMessages((prev) => prev.map((m) => m.id === data.messageId ? { ...m, text: data.newText } : m));
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

  // 3. Handlers
  const onDeleteMessage = async (messageId: string) => {
    try {
      await userChatService.deleteMessage(messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      socket?.emit("deleteMessage", { conversationId, messageId });
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const handleEditInitiated = (id: string, text: string) => {
    setEditingMessage({ id, text });
  };

  // 4. Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: messages.length > 1 ? "smooth" : "auto",
    });
  }, [messages, isTyping]);

  if (!conversationId) return null;

  return (
    <div className="flex flex-col h-full bg-[#fbfdfd] overflow-hidden relative">
      
      {/* --- STICKY HEADER --- */}
      <header className="h-20 border-b border-slate-100 flex items-center justify-between px-6 bg-white/95 backdrop-blur-md z-30 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="md:hidden p-2 -ml-2 hover:bg-slate-50 rounded-xl transition-colors">
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
          
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-100">
              N
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-black text-slate-900 tracking-tight text-sm">Dr. Nutritionist</h2>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active now</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
            <Video className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* --- SCROLLABLE MESSAGES AREA --- */}
      <div className="flex-1 overflow-y-auto px-4 py-8 bg-[#f8faf9]/50 scroll-smooth custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Encryption Notice */}
          <div className="flex justify-center mb-10">
            <span className="px-4 py-1.5 bg-white border border-slate-100 rounded-full text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> End-to-end encrypted
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col gap-6 animate-pulse">
              <div className="h-14 w-2/3 bg-slate-100 rounded-[2rem] rounded-bl-none" />
              <div className="h-14 w-1/2 bg-emerald-50 rounded-[2rem] rounded-br-none self-end" />
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
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-3 px-2 py-2 animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="flex gap-1.5 p-3 bg-white rounded-2xl rounded-bl-none shadow-sm border border-slate-50">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-duration:1s]" />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      {/* --- STICKY INPUT AREA --- */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0 z-40">
        <div className="max-w-4xl mx-auto relative">
          
          {/* Edit Mode Overlay */}
          {editingMessage && (
            <div className="absolute -top-14 left-0 right-0 bg-emerald-50 border border-emerald-100 p-3 flex justify-between items-center rounded-t-2xl animate-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                <div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Editing Message</span>
                  <p className="text-xs text-slate-500 truncate italic max-w-[200px] md:max-w-md">
                    {editingMessage.text}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setEditingMessage(null)}
                className="p-1.5 hover:bg-emerald-100 rounded-full text-emerald-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <MessageInput
            conversationId={conversationId}
            editingMessage={editingMessage}
            onCancelEdit={() => setEditingMessage(null)}
            onMessageSent={(newMessage) => {
              // Only add if it's a new message (not an edit sync)
              if (!editingMessage) {
                setMessages((prev) => [...prev, {
                  ...newMessage,
                  text: newMessage.content || newMessage.text,
                  status: 'sent'
                }]);
              }
              setEditingMessage(null);
            }}
          />
        </div>
      </div>
    </div>
  );
}