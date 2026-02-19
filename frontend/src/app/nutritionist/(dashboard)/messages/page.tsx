"use client";

import { useRouter } from "next/navigation";
import ConversationList from "@/components/messages/ConversationList";
import ChatWindow from "@/components/messages/ChatWindow";
import { useState } from "react";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="flex h-screen bg-[#f8faf9] overflow-hidden">
      {/* --- CONVERSATION SIDEBAR --- */}
      <div
        className={`border-r border-emerald-50 bg-white transition-all duration-300
          ${selectedConversation ? "hidden md:block md:w-96" : "w-full md:w-96"}
        `}
      >
        <ConversationList
          selectedId={selectedConversation}
          onSelect={setSelectedConversation}
        />
      </div>

      {/* --- CHAT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#fbfdfd]">
        {selectedConversation ? (
          <ChatWindow
            conversationId={selectedConversation}
            onBack={() => {
              if (window.innerWidth < 768) {
                setSelectedConversation(null);
              } else {
                router.push("/account/profile");
              }
            }}
          />
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mb-6">
               <div className="w-12 h-12 bg-emerald-600 rounded-2xl rotate-12 flex items-center justify-center shadow-lg shadow-emerald-200">
                  <span className="text-white font-bold text-xl -rotate-12">!</span>
               </div>
            </div>
            <h2 className="text-2xl font-black text-gray-900">Your Inbox</h2>
            <p className="text-gray-500 mt-2 max-w-xs font-medium">
              Select a client from the sidebar to start a consultation or review their progress.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}