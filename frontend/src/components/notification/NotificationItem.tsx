"use client";

import {
  Bell,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  MessageCircle,
  Star,
} from "lucide-react";

import type { NotificationResponseDTO } from "@/dtos/notification/notification-response.dto";

interface NotificationItemProps {
  notification: NotificationResponseDTO;
  onSelect: (notification: NotificationResponseDTO) => void;
}

function getNotificationIcon(type: NotificationResponseDTO["type"]) {
  const normalizedType = String(type).toLowerCase();

  if (normalizedType.includes("message")) return MessageCircle;
  if (normalizedType.includes("payment")) return CreditCard;
  if (
    normalizedType.includes("session") ||
    normalizedType.includes("booking")
  ) {
    return CalendarDays;
  }
  if (normalizedType.includes("review") || normalizedType.includes("rating")) {
    return Star;
  }
  if (
    normalizedType.includes("program") ||
    normalizedType.includes("completed")
  ) {
    return CheckCircle2;
  }

  return Bell;
}

function formatNotificationDate(date: string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

export default function NotificationItem({
  notification,
  onSelect,
}: NotificationItemProps) {
  const Icon = getNotificationIcon(notification.type);

  return (
    <button
      type="button"
      onClick={() => onSelect(notification)}
      className={`flex w-full items-start gap-3 border-b border-slate-100 px-4 py-4 text-left transition-colors hover:bg-slate-50 ${
        notification.isRead ? "bg-white" : "bg-emerald-50/40"
      }`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        <Icon className="h-5 w-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-slate-900">
            {notification.title}
          </span>

          {!notification.isRead && (
            <span
              aria-label="Unread"
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600"
            />
          )}
        </span>

        <span className="mt-1 block text-sm leading-5 text-slate-600">
          {notification.message}
        </span>

        {notification.senderName && (
          <span className="mt-1 block text-xs text-slate-500">
            From {notification.senderName}
          </span>
        )}

        <span className="mt-2 block text-xs text-slate-400">
          {formatNotificationDate(notification.createdAt)}
        </span>
      </span>
    </button>
  );
}
