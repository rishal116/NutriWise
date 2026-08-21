"use client";

import { MessageSquare, ShieldCheck, Sparkles, UserX } from "lucide-react";

interface EmptyChatStateProps {
  type: "no-conversations" | "no-selected" | "no-messages";
}

export default function EmptyChatState({ type }: EmptyChatStateProps) {
  if (type === "no-conversations") {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 h-full min-h-[300px]">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-sm border border-emerald-100/50">
          <UserX className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          No conversations yet
        </h3>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
          Start a conversation with your nutritionist or client to begin
          messaging.
        </p>
      </div>
    );
  }

  if (type === "no-messages") {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 my-auto">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-sm border border-emerald-100">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          Start the conversation
        </h3>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
          Send your first message to kick off the discussion.
        </p>
      </div>
    );
  }

  return (
    <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-12 bg-slate-50/50 h-full">
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-900/5 border border-emerald-50 relative z-10 rotate-3">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-inner">
            <MessageSquare className="w-7 h-7" />
          </div>
        </div>
        <div className="absolute inset-0 m-auto w-32 h-32 border border-emerald-200/50 rounded-full animate-ping opacity-20" />
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        Select a <span className="text-emerald-600">Conversation</span>
      </h2>
      <p className="text-slate-500 max-w-xs text-sm leading-relaxed mb-8">
        Choose a contact from the list to view your message history and start
        chatting.
      </p>

      <div className="flex items-center gap-2 text-emerald-800/30 text-[10px] font-bold uppercase tracking-[0.3em]">
        <ShieldCheck className="w-4 h-4" />
        NutriWise Secure Messaging
      </div>
    </div>
  );
}
