"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, MessageCircle } from "lucide-react";
import ConversationList from "@/components/messages/ConversationList";
import ChatWindow from "@/components/messages/ChatWindow";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBack = () => {
    if (isMobile && selectedConversation) {
      setSelectedConversation(null);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden font-sans">
      
      {/* 1. Sidebar */}
      <aside
        className={`
          flex flex-col bg-white border-r border-emerald-100 transition-all duration-300 ease-in-out z-50
          ${isMobile 
            ? `fixed inset-0 w-full transform ${selectedConversation ? "-translate-x-full" : "translate-x-0"}` 
            : "w-[30%] min-w-[350px] max-w-[420px]"
          }
        `}
      >
        <ConversationList
          selectedId={selectedConversation}
          onSelect={(id) => setSelectedConversation(id)}
          isMobile={isMobile}
          onBack={handleBack}
        />
      </aside>

      {/* 2. Main Chat Area */}
      <main className={`
        flex-1 flex flex-col min-w-0 relative bg-[#fdfefd] transition-transform duration-300
        ${isMobile 
          ? `fixed inset-0 transform ${selectedConversation ? "translate-x-0" : "translate-x-full"}` 
          : "flex"
        }
      `}>
        {selectedConversation ? (
          <ChatWindow 
            conversationId={selectedConversation} 
            onBack={handleBack} 
          />
        ) : (
          /* Branded Empty State */
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-8 bg-emerald-50/30">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-emerald-100 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-3xl">🍃</span>
                </div>
              </div>
              {/* Decorative rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-emerald-100/50 rounded-full animate-pulse" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-3 tracking-tight">
              Your Wellness Journey, <span className="text-emerald-600">Connected.</span>
            </h2>
            <p className="text-gray-500 max-w-sm text-sm leading-relaxed mb-8">
              Chat with your NutriWise guide to fine-tune your nutrition plan and reach your health goals faster.
            </p>
            
            <div className="flex gap-3">
               <div className="px-5 py-2.5 bg-white border border-emerald-100 text-emerald-700 rounded-2xl text-xs font-semibold shadow-sm flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Start a Conversation
               </div>
            </div>
            
            <div className="absolute bottom-10 flex items-center gap-2 text-emerald-800/40 text-[10px] font-bold uppercase tracking-[0.2em]">
              <ShieldCheck className="w-4 h-4" />
              NutriWise Secure Messaging
            </div>
          </div>
        )}
      </main>
    </div>
  );
}