"use client";

import { useRouter } from "next/navigation";
import ConversationList from "@/components/messages/ConversationList";
import ChatWindow from "@/components/messages/ChatWindow";
import { useState } from "react";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] =
    useState<string | null>(null);

  const router = useRouter();

  return (
   <div className="flex h-full bg-gray-50 overflow-hidden">
      {/* Conversation List */}
      <div
        className={`border-r bg-white transition-all
          ${
            selectedConversation
              ? "hidden md:block md:w-80"
              : "w-full md:w-80"
          }
        `}
      >
        <ConversationList
          selectedId={selectedConversation}
          onSelect={setSelectedConversation}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        <ChatWindow
          conversationId={selectedConversation}
          onBack={() => {
            // Mobile: go back to list
            if (window.innerWidth < 768) {
              setSelectedConversation(null);
            } else {
              // Desktop: go back to account home
              router.push("/account/profile");
            }
          }}
        />
      </div>
    </div>
  );
}


          