"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, MessageCircle, Sparkles } from "lucide-react";
import ConversationList from "@/components/messages/ConversationList";
import ChatWindow from "@/components/messages/ChatWindow";

export default function MessagesPage() {
  const router = useRouter();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handleBack = () => {
    if (isMobile && selectedConversation) {
      setSelectedConversation(null);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-white border-r border-emerald-100 transition-all duration-300 z-20
        ${
          isMobile
            ? `fixed inset-0 w-full ${selectedConversation ? "-translate-x-full" : "translate-x-0"}`
            : "w-[30%] min-w-[350px] max-w-[420px]"
        }`}
      >
        <div className="p-6 border-b border-emerald-50 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Messages</h1>
          <Sparkles className="w-5 h-5 text-emerald-500 opacity-70" />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <ConversationList
            selectedId={selectedConversation}
            onSelect={setSelectedConversation}
            isMobile={isMobile}
            onBack={handleBack}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col bg-white transition-all duration-300 relative
        ${
          isMobile
            ? `fixed inset-0 ${selectedConversation ? "translate-x-0" : "translate-x-full"}`
            : ""
        }`}
      >
        {selectedConversation ? (
          <ChatWindow conversationId={selectedConversation} onBack={handleBack} />
        ) : (
          <EmptyState />
        )}
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1fae5; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b981; }
      `}</style>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-12 bg-emerald-50/20">
      <div className="relative mb-8">
        {/* Outer pulse rings */}
        <div className="absolute inset-0 m-auto w-32 h-32 border border-emerald-200 rounded-full animate-ping opacity-20" />
        <div className="absolute inset-0 m-auto w-48 h-48 border border-emerald-100 rounded-full animate-pulse opacity-40" />
        
        {/* Main Icon Circle */}
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-900/5 border border-emerald-50 relative z-10 rotate-3">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-inner">
            <MessageCircle className="w-7 h-7" />
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        Select a <span className="text-emerald-600">Conversation</span>
      </h2>
      
      <p className="text-slate-500 max-w-xs text-sm leading-relaxed mb-8">
        Choose a contact from the list to view your message history and start chatting.
      </p>

      <div className="flex items-center gap-2 text-emerald-800/30 text-[10px] font-bold uppercase tracking-[0.3em] mt-auto">
        <ShieldCheck className="w-4 h-4" />
        Secure Communication
      </div>
    </div>
  );
}