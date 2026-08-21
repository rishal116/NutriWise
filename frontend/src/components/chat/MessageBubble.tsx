"use client";

import Image from "next/image";
import { MessageResponseDTO } from "@/dtos/chat/message-response.dto";
import { MessageType } from "@/types/chat/message.types";
import { CheckCheck } from "lucide-react";
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

const formatMessageTime = (dateInput: Date | string) => {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function MessageBubble({
  message,
  isSender,
  senderAvatar,
  senderName,
  onEdit,
  onDelete,
}: MessageBubbleProps) {
  const isSystem = message.messageType === MessageType.SYSTEM;
  const isDeleted = message.status === "deleted" || Boolean(message.deletedAt);
  const isEdited = message.status === "edited" || Boolean(message.editedAt);

  if (isSystem) {
    return (
      <div className="flex justify-center my-3 px-4">
        <div className="px-3.5 py-1 bg-slate-100/90 text-slate-500 text-[11px] font-medium rounded-full border border-slate-200/50 shadow-2xs text-center max-w-md">
          {message.text}
        </div>
      </div>
    );
  }

  const messageTime = formatMessageTime(message.createdAt);

  return (
    <div
      className={`flex w-full mb-3 group ${
        isSender ? "justify-end" : "justify-start"
      }`}
    >
      {!isSender && (
        <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mr-2.5 mt-1 border border-slate-200/60 bg-emerald-50 flex items-center justify-center">
          {senderAvatar ? (
            <Image
              src={senderAvatar}
              alt={senderName || "User"}
              fill
              sizes="32px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="text-emerald-800 font-bold text-xs">
              {(senderName || "U").charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      )}

      <div
        className={`relative max-w-[85%] sm:max-w-[70%] flex flex-col ${
          isSender ? "items-end" : "items-start"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-0.5">
          {isSender && !isDeleted && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
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
          className={`relative px-4 py-2.5 rounded-2xl shadow-2xs transition-all ${
            isSender
              ? "bg-emerald-700 text-white rounded-tr-none"
              : "bg-white text-slate-800 border border-slate-200/70 rounded-tl-none"
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
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words font-normal">
                  {message.text}
                </p>
              )}
            </>
          )}

          {/* Timestamp & Status */}
          <div
            className={`flex items-center justify-end gap-1 mt-1 text-[10px] select-none ${
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
                <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
