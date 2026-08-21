"use client";

import Image from "next/image";
import { ConversationResponseDTO } from "@/dtos/chat/conversation-response.dto";
import { BellOff, Users } from "lucide-react";
import { usePresence } from "@/providers/SocketProvider";

interface ConversationListItemProps {
  conversation: ConversationResponseDTO;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const formatActivityTime = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

export default function ConversationListItem({
  conversation,
  isSelected,
  onSelect,
}: ConversationListItemProps) {
  const { isUserOnline } = usePresence();
  const isGroup = conversation.chatType === "group";
  const name = isGroup
    ? conversation.title || "Group Chat"
    : conversation.participant?.name || "User";

  const avatar = isGroup
    ? conversation.groupAvatar
    : conversation.participant?.profileImage;

  const isOnline =
    !isGroup && conversation.participant?.id
      ? isUserOnline(conversation.participant.id)
      : false;

  const timeDisplay = formatActivityTime(conversation.lastActivityAt || conversation.updatedAt);

  return (
    <button
      onClick={() => onSelect(conversation.id)}
      className={`w-full flex items-center gap-3.5 px-4 py-3.5 transition-all text-left relative group border-b border-slate-100/60 ${
        isSelected
          ? "bg-emerald-50/80 hover:bg-emerald-50"
          : "bg-white hover:bg-slate-50/80"
      }`}
    >
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600 rounded-r-full" />
      )}

      {/* Avatar Container */}
      <div className="relative flex-shrink-0">
        <div
          className={`relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border ${
            isSelected ? "border-emerald-300 shadow-sm" : "border-slate-100"
          } bg-emerald-50`}
        >
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              fill
              sizes="48px"
              className="object-cover"
              unoptimized
            />
          ) : isGroup ? (
            <Users className="w-5 h-5 text-emerald-700" />
          ) : (
            <span className="text-emerald-800 font-bold text-sm">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3
            className={`text-sm font-semibold truncate ${
              isSelected ? "text-emerald-950" : "text-slate-800"
            }`}
          >
            {name}
          </h3>
          <span
            className={`text-[11px] font-medium ml-2 flex-shrink-0 ${
              conversation.unreadCount > 0
                ? "text-emerald-600 font-semibold"
                : "text-slate-400"
            }`}
          >
            {timeDisplay}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-xs truncate leading-relaxed ${
              conversation.unreadCount > 0
                ? "text-slate-900 font-semibold"
                : isSelected
                ? "text-emerald-700/80"
                : "text-slate-500"
            }`}
          >
            {conversation.lastMessage || "No messages yet"}
          </p>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {conversation.isMuted && (
              <BellOff className="w-3.5 h-3.5 text-slate-400" />
            )}

            {conversation.unreadCount > 0 && (
              <span className="min-w-[18px] h-[18px] px-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}