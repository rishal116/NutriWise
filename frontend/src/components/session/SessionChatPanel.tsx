"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { MessageSquare, Send, X } from "lucide-react";

import type { ChatMessage } from "@/hooks/useRoomSignals";

interface SessionChatPanelProps {
  messages: ChatMessage[];
  open: boolean;
  canSend: boolean;
  onSend: (text: string) => Promise<boolean>;
  onClose: () => void;
}

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function SessionChatPanel({
  messages,
  open,
  canSend,
  onSend,
  onClose,
}: SessionChatPanelProps) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, open]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    setSending(true);
    const ok = await onSend(draft);
    if (ok) setDraft("");
    setSending(false);
  };

  return (
    <aside
      aria-label="Meeting chat"
      className={
        open
          ? "fixed inset-0 z-40 flex flex-col bg-[#1f2023] md:static md:inset-auto md:z-auto md:my-4 md:mr-4 md:w-96 md:shrink-0 md:rounded-3xl lg:w-[400px]"
          : "hidden"
      }
    >
      <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-4">
        <h2 className="text-lg font-medium">In-call messages</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="rounded-full p-2 text-gray-300 transition hover:bg-white/[0.08] hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-2">
        <div className="rounded-2xl bg-white/[0.05] p-4 text-center">
          <p className="flex items-center justify-center gap-2 text-sm font-medium text-gray-200">
            <MessageSquare className="h-4 w-4" />
            Messages are temporary
          </p>
          <p className="mt-2 text-xs leading-relaxed text-gray-400">
            Only people in this meeting can see them, and they disappear when
            you leave.
          </p>
        </div>

        {messages.map((m) => (
          <div key={m.id}>
            <div className="flex items-baseline gap-2 text-xs">
              <span className="font-semibold text-white">{m.senderName}</span>
              <span className="text-gray-400">{formatTime(m.sentAt)}</span>
            </div>
            <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-gray-200">
              {m.text}
            </p>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="shrink-0 px-4 pb-4 pt-2"
      >
        {!canSend && (
          <p className="mb-2 px-1 text-xs text-amber-400">
            Sending messages isn&apos;t permitted for your role in this session.
          </p>
        )}
        <div className="flex items-center rounded-full border border-white/15 py-1 pl-5 pr-1 focus-within:border-emerald-500">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={500}
            disabled={!canSend}
            placeholder="Send a message"
            aria-label="Message"
            className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-gray-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!canSend || sending || !draft.trim()}
            aria-label="Send message"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-300 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </aside>
  );
}
