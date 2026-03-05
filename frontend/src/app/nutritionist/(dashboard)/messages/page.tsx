"use client";

import { useRouter } from "next/navigation";
import ConversationList from "@/components/nutritionist/message/ConversationList";
import ChatWindow from "@/components/messages/ChatWindow";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Sparkles } from "lucide-react";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* --- CONVERSATION SIDEBAR --- */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`border-r border-slate-100 bg-white shadow-sm z-20 transition-all duration-500 ease-in-out
          ${selectedConversation ? "hidden md:block md:w-[400px]" : "w-full md:w-[400px]"}
        `}
      >
        <div className="h-full flex flex-col">
          <ConversationList
            selectedId={selectedConversation}
            onSelect={setSelectedConversation}
          />
        </div>
      </motion.div>

      {/* --- CHAT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#fbfdfd] relative">
        <AnimatePresence mode="wait">
          {selectedConversation ? (
            <motion.div 
              key="chat-window"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full w-full"
            >
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
            </motion.div>
          ) : (
            <motion.div 
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden md:flex flex-col items-center justify-center h-full text-center p-12 bg-gradient-to-b from-white to-[#f8faf9]"
            >
              {/* Floating Icon Container */}
              <div className="relative mb-8">
                <motion.div 
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [12, 15, 12]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="w-32 h-32 bg-emerald-50 rounded-[3rem] flex items-center justify-center relative z-10"
                >
                  <div className="w-16 h-16 bg-emerald-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-emerald-200">
                    <span className="text-white font-black text-3xl">!</span>
                  </div>
                </motion.div>
                
                {/* Decorative Sparkles */}
                <motion.div 
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 text-emerald-300"
                >
                  <Sparkles size={24} />
                </motion.div>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Inbox</h2>
                <p className="text-slate-400 mt-3 max-w-[280px] font-bold text-sm leading-relaxed uppercase tracking-wider">
                  Select a client from the sidebar to start a consultation or review their progress.
                </p>
              </motion.div>

              {/* Subtle background brand mark */}
              <div className="absolute bottom-12 opacity-[0.03] select-none pointer-events-none">
                 <h1 className="text-[12rem] font-black text-emerald-900">N</h1>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}