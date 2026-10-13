"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BellOff, Users } from "lucide-react";

import { ConversationListItemDTO } from "@/dtos/chat/conversation-list-item.dto";
import { usePresence } from "@/providers/SocketProvider";

interface ConversationListItemProps {
  conversation: ConversationListItemDTO;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const formatActivityTime = (dateString?: string): string => {
  if (!dateString) {
    return "—";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const now = new Date();

  const isToday =
    date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    }) ===
    now.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

  if (isToday) {
    return date.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const isYesterday =
    date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    }) ===
    yesterday.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

  if (isYesterday) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function ConversationListItem({
  conversation,
  isSelected,
  onSelect,
}: ConversationListItemProps) {
  const { isUserOnline } = usePresence();

  const isGroup = conversation.chatType === "group";

  const name =
    conversation.title?.trim() || (isGroup ? "Group Chat" : "Unknown User");

  const avatar = conversation.avatar?.trim();

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [avatar]);

  const isOnline =
    !isGroup && Boolean(conversation.otherUserId)
      ? isUserOnline(conversation.otherUserId!)
      : false;

  const timeDisplay = formatActivityTime(conversation.lastActivityAt);

  const showImage = Boolean(avatar) && !imageError;

  const fallbackContent = isGroup ? (
    <Users className="h-5 w-5 text-emerald-700" />
  ) : (
    <span className="text-sm font-bold text-emerald-800">
      {name.charAt(0).toUpperCase()}
    </span>
  );

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.conversationId)}
      className={`relative flex w-full items-center gap-3.5 border-b border-slate-100/60 px-4 py-3.5 text-left transition-all ${
        isSelected
          ? "bg-emerald-50/80 hover:bg-emerald-50"
          : "bg-white hover:bg-slate-50/80"
      }`}
    >
      {isSelected && (
        <div className="absolute bottom-0 left-0 top-0 w-1 rounded-r-full bg-emerald-600" />
      )}

      <div className="relative shrink-0">
        <div
          className={`relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border bg-emerald-50 ${
            isSelected ? "border-emerald-300 shadow-sm" : "border-slate-100"
          }`}
        >
          {showImage ? (
            <Image
              src={avatar!}
              alt={name}
              fill
              sizes="48px"
              className="object-cover"
              unoptimized
              onError={() => setImageError(true)}
            />
          ) : (
            fallbackContent
          )}
        </div>

        {isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-baseline justify-between">
          <h3
            className={`truncate text-sm font-semibold ${
              isSelected ? "text-emerald-950" : "text-slate-800"
            }`}
          >
            {name}
          </h3>

          <span
            className={`ml-2 shrink-0 text-[11px] font-medium ${
              conversation.unreadCount > 0
                ? "font-semibold text-emerald-600"
                : "text-slate-400"
            }`}
          >
            {timeDisplay}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={`truncate text-xs leading-relaxed ${
              conversation.unreadCount > 0
                ? "font-semibold text-slate-900"
                : isSelected
                  ? "text-emerald-700/80"
                  : "text-slate-500"
            }`}
          >
            {conversation.lastMessagePreview?.trim() || "No messages yet"}
          </p>

          <div className="flex shrink-0 items-center gap-1.5">
            {conversation.isMuted && (
              <BellOff className="h-3.5 w-3.5 text-slate-400" />
            )}

            {conversation.unreadCount > 0 && (
              <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[10px] font-bold text-white shadow-sm">
                {conversation.unreadCount > 99
                  ? "99+"
                  : conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
