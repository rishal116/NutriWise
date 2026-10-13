"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, MoreVertical, ShieldCheck, Users } from "lucide-react";

import { ConversationResponseDTO } from "@/dtos/chat/conversation-response.dto";
import { usePresence } from "@/providers/SocketProvider";

interface ChatHeaderProps {
  conversation: ConversationResponseDTO;
  onBack: () => void;
}

const formatConversationTime = (dateInput?: string): string => {
  if (!dateInput) return "";

  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function ChatHeader({ conversation, onBack }: ChatHeaderProps) {
  const [imageError, setImageError] = useState(false);
  const { isUserOnline } = usePresence();

  const isGroup = conversation.chatType === "group";
  const isActive = conversation.status === "active";

  const title = isGroup
    ? conversation.title?.trim() || "Group Chat"
    : conversation.participant?.name?.trim() || "User";

  const avatar = isGroup
    ? conversation.avatar?.trim()
    : conversation.participant?.profileImage?.trim();

  const participantId = conversation.participant?.id;

  const isOnline =
    !isGroup && participantId ? isUserOnline(participantId) : false;

  const conversationTime = formatConversationTime(conversation.lastActivityAt);

  useEffect(() => {
    setImageError(false);
  }, [avatar]);

  return (
    <header className="relative z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-4">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="-ml-1 rounded-xl p-1.5 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
          aria-label="Back to conversations"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="relative h-10 w-10 shrink-0">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-emerald-50">
            {avatar && !imageError ? (
              <Image
                src={avatar}
                alt={title}
                fill
                sizes="40px"
                className="object-cover"
                unoptimized
                onError={() => setImageError(true)}
              />
            ) : isGroup ? (
              <Users className="h-5 w-5 text-emerald-700" />
            ) : (
              <span className="text-sm font-bold text-emerald-800">
                {title.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {isOnline && (
            <span
              className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500"
              aria-label="Online"
            />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="truncate text-sm font-bold leading-tight text-slate-800 sm:text-base">
              {title}
            </h2>

            {conversationTime && (
              <span className="shrink-0 text-[10px] font-medium text-slate-400">
                {conversationTime}
              </span>
            )}
          </div>

          <div className="mt-0.5 flex items-center gap-1.5">
            {!isActive ? (
              <span className="text-[11px] font-semibold capitalize text-amber-600">
                {conversation.status} (Read-Only)
              </span>
            ) : isGroup ? (
              <span className="text-[11px] font-semibold text-slate-400">
                Group Chat
              </span>
            ) : isOnline ? (
              <span className="text-[11px] font-semibold text-emerald-600">
                Online
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-slate-400">
                Offline
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 text-slate-400">
        <div className="hidden items-center gap-1 rounded-full border border-emerald-100/50 bg-emerald-50/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-800/60 sm:flex">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          Secure Chat
        </div>

        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-xl p-2 text-slate-400 opacity-60"
          aria-label="Conversation options unavailable"
          title="Conversation options are not available yet"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
