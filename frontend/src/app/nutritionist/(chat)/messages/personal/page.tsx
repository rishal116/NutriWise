"use client";

import { MessageCircle } from "lucide-react";

import ChatLayout from "@/components/chat/ChatLayout";

export default function PersonalMessagesPage() {
  return (
    <div className="flex h-dvh min-h-0 w-full overflow-hidden bg-white">
      <aside className="h-full w-full min-w-0 shrink-0 overflow-hidden md:w-[320px] lg:w-[380px]">
        <ChatLayout
          filter="personal"
          messagesBasePath="/nutritionist/messages"
        />
      </aside>

      <main className="hidden min-h-0 min-w-0 flex-1 flex-col items-center justify-center border-l border-slate-200 bg-slate-50 md:flex">
        <div className="flex max-w-sm flex-col items-center gap-3 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <MessageCircle className="h-8 w-8 text-emerald-600" />
          </div>

          <h2 className="text-lg font-semibold text-slate-800">
            Personal messages
          </h2>

          <p className="text-sm text-slate-500">
            Select a personal conversation to start chatting.
          </p>
        </div>
      </main>
    </div>
  );
}