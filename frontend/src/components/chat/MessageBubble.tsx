
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CheckCheck } from "lucide-react";

import { MessageResponseDTO } from "@/dtos/chat/message-response.dto";
import { MessageType } from "@/types/chat/message.types";

import MessageAttachment from "./MessageAttachment";
import MessageActions from "./MessageActions";

interface MessageBubbleProps {
  message: MessageResponseDTO;
  isSender: boolean;
  senderAvatar?: string;
  senderName?: string;
  onEdit?: (message: MessageResponseDTO) => void;
  onDelete: (messageId: string) => void;
}

const formatMessageTime = (dateInput: Date | string): string => {
  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const renderMessageText = (text: string, isSender: boolean) => {
  const urlRegex = /https?:\/\/[^\s<>"']+/g;
  const parts = text.split(urlRegex);
  const urls = text.match(urlRegex) ?? [];

  let urlIndex = 0;

  return parts.map((part, index) => {
    if (index % 2 === 1) {
      const rawUrl = urls[urlIndex++];
      const trailingPunctuation = rawUrl.match(/[.,!?;:)\]]+$/)?.[0] ?? "";
      const url = rawUrl.slice(0, rawUrl.length - trailingPunctuation.length);

      return (
        <span key={`${index}-${url}`}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`break-all underline underline-offset-2 ${
              isSender
                ? "text-emerald-100 hover:text-white"
                : "text-emerald-700 hover:text-emerald-900"
            }`}
          >
            {url}
          </a>
          {trailingPunctuation}
        </span>
      );
    }

    return part ? (
      <span key={`${index}-${part}`}>{part}</span>
    ) : null;
  });
};

export default function MessageBubble({
  message,
  isSender,
  senderAvatar,
  senderName,
  onEdit,
  onDelete,
}: MessageBubbleProps) {
  const [imageError, setImageError] = useState(false);

  const isSystem = message.messageType === MessageType.SYSTEM;

  const isDeleted =
    message.status === "deleted" || Boolean(message.deletedAt);

  const isEdited =
    message.status === "edited" || Boolean(message.editedAt);

  useEffect(() => {
    setImageError(false);
  }, [senderAvatar]);

  if (isSystem) {
    return (
      <div className="my-3 flex justify-center px-4">
        <div className="max-w-md rounded-full border border-slate-200/50 bg-slate-100/90 px-3.5 py-1 text-center text-[11px] font-medium text-slate-500 shadow-2xs">
          {message.text}
        </div>
      </div>
    );
  }

  const messageTime = formatMessageTime(message.createdAt);
  const showAvatar = Boolean(senderAvatar) && !imageError;

  return (
    <div
      className={`group mb-3 flex w-full ${
        isSender ? "justify-end" : "justify-start"
      }`}
    >
      {!isSender && (
        <div className="relative mr-2.5 mt-1 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200/60 bg-emerald-50">
          {showAvatar ? (
            <Image
              src={senderAvatar!}
              alt={senderName || "User"}
              fill
              sizes="32px"
              className="object-cover"
              unoptimized
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="text-xs font-bold text-emerald-800">
              {(senderName || "U").charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      )}

      <div
        className={`relative flex max-w-[85%] flex-col sm:max-w-[70%] ${
          isSender ? "items-end" : "items-start"
        }`}
      >
        <div className="mb-0.5 flex items-center gap-1.5">
          {isSender && !isDeleted && (
            <div className="opacity-0 transition-opacity group-hover:opacity-100">
              <MessageActions
                messageId={message.id}
                text={message.text}
                canEdit={message.messageType === MessageType.TEXT}
                onEdit={() => onEdit?.(message)}
                onDelete={() => onDelete(message.id)}
              />
            </div>
          )}
        </div>

        <div
          className={`relative rounded-2xl px-4 py-2.5 shadow-2xs transition-all ${
            isSender
              ? "rounded-tr-none bg-emerald-700 text-white"
              : "rounded-tl-none border border-slate-200/70 bg-white text-slate-800"
          }`}
        >
          {isDeleted ? (
            <p className="text-xs italic opacity-75">
              This message was deleted
            </p>
          ) : (
            <>
              {message.attachments && message.attachments.length > 0 && (
                <MessageAttachment
                  attachments={message.attachments}
                  messageType={message.messageType}
                  isSender={isSender}
                />
              )}

              {message.text && (
                <p className="whitespace-pre-wrap break-words text-xs font-normal leading-relaxed sm:text-sm">
                  {renderMessageText(message.text, isSender)}
                </p>
              )}
            </>
          )}

          <div
            className={`mt-1 flex select-none items-center justify-end gap-1 text-[10px] ${
              isSender ? "text-emerald-100/90" : "text-slate-400"
            }`}
          >
            {isEdited && !isDeleted && (
              <span className="font-medium uppercase tracking-tighter opacity-80">
                edited
              </span>
            )}

            <span>{messageTime}</span>

            {isSender && !isDeleted && (
              <div className="ml-0.5">
                <CheckCheck className="h-3.5 w-3.5 text-emerald-200" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
