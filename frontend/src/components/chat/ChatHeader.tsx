"use client";

import Image from "next/image";
import { ChevronLeft, MoreVertical, ShieldCheck, Users } from "lucide-react";
import { ConversationResponseDTO } from "@/dtos/chat/conversation-response.dto";
import { usePresence } from "@/providers/SocketProvider";

interface ChatHeaderProps {
  conversation: ConversationResponseDTO;
  onBack: () => void;
}

export default function ChatHeader({ conversation, onBack }: ChatHeaderProps) {
  const { isUserOnline } = usePresence();
  const isGroup = conversation.chatType === "group";
  const title = isGroup
    ? conversation.title || "Group Chat"
    : conversation.participant?.name || "User";

  const avatar = isGroup
    ? conversation.groupAvatar
    : conversation.participant?.profileImage;

  const isActive = conversation.status === "active";
  const isOnline =
    !isGroup && conversation.participant?.id
      ? isUserOnline(conversation.participant.id)
      : false;

  return (
    <header className="h-16 px-4 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between z-10 sticky top-0">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Back Button */}
        <button
          onClick={onBack}
          className="p-1.5 -ml-1 hover:bg-slate-100 rounded-xl text-slate-600 md:hidden transition-colors"
          aria-label="Back to conversations"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-emerald-50 flex items-center justify-center">
            {avatar ? (
              <Image
                src={avatar}
                alt={title}
                fill
                sizes="40px"
                className="object-cover"
                unoptimized
              />
            ) : isGroup ? (
              <Users className="w-5 h-5 text-emerald-700" />
            ) : (
              <span className="text-emerald-800 font-bold text-sm">
                {title.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
          )}
        </div>

        {/* Title & Status */}
        <div className="min-w-0">
          <h2 className="font-bold text-slate-800 text-sm sm:text-base leading-tight truncate">
            {title}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            {!isActive ? (
              <span className="text-[11px] font-semibold text-amber-600 capitalize">
                {conversation.status} (Read-Only)
              </span>
            ) : isOnline ? (
              <span className="text-[11px] font-semibold text-emerald-600">
                ● Online
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-slate-400">
                ○ Offline
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-1 text-slate-400">
        <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest px-3 py-1 bg-emerald-50/60 rounded-full border border-emerald-100/50">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          Secure Chat
        </div>
        <button className="p-2 hover:bg-slate-100 text-slate-500 rounded-xl transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
