"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Send, X } from "lucide-react";
import type { ChatMessagePayload } from "@/socket/video.socket";
import { CHAT_MAX_LENGTH } from "@/lib/webrtc/config";

interface ChatPanelProps {
  messages: ChatMessagePayload[];
  selfId: string | undefined;
  onSend: (text: string) => void;
  onClose: () => void;
}

const formatTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const ChatPanel = ({ messages, selfId, onSend, onClose }: ChatPanelProps) => {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    onSend(draft);
    setDraft("");
  };

  return (
    <aside className="absolute inset-x-0 bottom-0 z-40 flex h-[65dvh] flex-col rounded-t-2xl border border-white/10 bg-neutral-950 md:static md:h-full md:w-80 md:shrink-0 md:rounded-none md:border-y-0 md:border-r-0">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h2 className="text-sm font-semibold text-white">In-call chat</h2>
        <button
          type="button"
          aria-label="Close chat"
          onClick={onClose}
          className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
        >
          <X size={18} />
        </button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <p className="pt-6 text-center text-xs text-neutral-500">
            Messages are visible only during this call and are not saved.
          </p>
        )}
        {messages.map((message) => {
          const mine = message.senderId === selfId;
          return (
            <div key={message.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-[85%] break-words rounded-2xl px-3 py-2 text-sm ${
                  mine ? "bg-emerald-600 text-white" : "bg-neutral-800 text-neutral-100"
                }`}
              >
                {message.text}
              </div>
              <span className="mt-0.5 text-[10px] text-neutral-500">
                {mine ? "You" : "Partner"} · {formatTime(message.sentAt)}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-white/10 p-3">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={CHAT_MAX_LENGTH}
          placeholder="Type a message"
          className="min-w-0 flex-1 rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500 focus:ring-1 focus:ring-emerald-500"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={!draft.trim()}
          className="rounded-xl bg-emerald-600 p-2.5 text-white hover:bg-emerald-500 disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </form>
    </aside>
  );
};

export default ChatPanel;