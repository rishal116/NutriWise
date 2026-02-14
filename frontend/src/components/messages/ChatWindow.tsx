"use client";

import { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import { userChatService } from "@/services/user/userChat.service";
import { connectSocket } from "@/lib/socket";

interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  status?: "sent" | "delivered" | "read";
}



export default function ChatWindow({
  conversationId,
  onBack,
}: {
  conversationId: string | null;
  onBack?: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* ============================= */
  /* Fetch Messages */
  /* ============================= */



useEffect(() => {
  if (!conversationId) return;

  const socket = connectSocket();

  // Join conversation room
  socket.emit("joinConversation", conversationId);

  // Listen for new messages
  socket.on("receiveMessage", (message: any) => {
    const formatted: Message = {
      id: message.id,
      senderId: message.senderId,
      text: message.content,
      createdAt: message.createdAt,
    };

    setMessages((prev) => [...prev, formatted]);
  });

  return () => {
    socket.emit("leaveConversation", conversationId);
    socket.off("receiveMessage");
  };
}, [conversationId]);



  useEffect(() => {
    if (!conversationId) return;

    async function fetchMessages() {
      try {
        setLoading(true);

        // 👇 This is already the array
        const data = await userChatService.getMessages(conversationId as string);

        // Normalize backend → frontend shape
        const formatted: Message[] = data.map((msg: any) => ({
          id: msg.id,
          senderId: msg.senderId,
          text: msg.content,
          createdAt: msg.createdAt,
        }));

        setMessages(formatted);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [conversationId]);

  /* ============================= */
  /* Auto Scroll */
  /* ============================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ============================= */
  /* Empty State */
  /* ============================= */

  if (!conversationId) {
    return (
      <div className="h-full flex items-center justify-center bg-[#f0f2f5]">
        <div className="text-center max-w-sm px-6">
          <div className="bg-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            💬
          </div>
          <h2 className="text-2xl font-light text-gray-600">
            Select a conversation
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Choose a chat to start messaging
          </p>
        </div>
      </div>
    );
  }

  /* ============================= */
  /* Chat UI */
  /* ============================= */

  const currentUserId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId")
      : null;

  return (
    <div className="h-full flex flex-col bg-[#f0f2f5] overflow-hidden">
      {/* Header */}
      <div className="h-14 shrink-0 px-4 border-b flex items-center justify-between bg-[#f0f2f5]">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="md:hidden text-lg">
              ←
            </button>
          )}
          <div className="w-10 h-10 rounded-full bg-gray-300" />
          <div>
            <h3 className="text-sm font-semibold">Conversation</h3>
            <p className="text-xs text-gray-500">active</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-12 py-4 space-y-2">
        {loading ? (
          <p className="text-center text-gray-400 mt-4">
            Loading messages...
          </p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-400 mt-4">
            No messages yet
          </p>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              text={msg.text}
              isSender={msg.senderId === currentUserId}
              timestamp={new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
              status={msg.status}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 bg-white border-t">
        <MessageInput
          conversationId={conversationId}
          onMessageSent={(newMessage: any) => {
            const formatted: Message = {
              id: newMessage.id,
              senderId: newMessage.senderId,
              text: newMessage.content,
              createdAt: newMessage.createdAt,
            };

            setMessages((prev) => [...prev, formatted]);
          }}
        />
      </div>
    </div>
  );
}
