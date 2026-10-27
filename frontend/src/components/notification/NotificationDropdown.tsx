"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CheckCheck } from "lucide-react";

import { notificationService } from "@/services/common/notification.service";
import type { NotificationResponseDTO } from "@/dtos/notification/notification-response.dto";
import NotificationList from "./NotificationList";

interface NotificationDropdownProps {
  notificationsHref: string;
  open: boolean;
}

const DROPDOWN_LIMIT = 5;

export default function NotificationDropdown({
  notificationsHref,
  open,
}: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<NotificationResponseDTO[]>(
    [],
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [result, count] = await Promise.all([
        notificationService.getNotifications({ limit: DROPDOWN_LIMIT }),
        notificationService.getUnreadCount(),
      ]);

      setNotifications(result.items);
      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to load notification dropdown:", err);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) void refresh();
  }, [open, refresh]);

  const handleSelect = async (notification: NotificationResponseDTO) => {
    if (notification.isRead) return;

    try {
      await notificationService.markNotificationRead(notification.id);

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, isRead: true } : item,
        ),
      );

      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      setError("Unable to mark notification as read.");
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;

    try {
      await notificationService.markAllNotificationsRead();

      setNotifications((current) =>
        current.map((item) => ({ ...item, isRead: true })),
      );

      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      setError("Unable to mark all notifications as read.");
    }
  };

  if (!open) return null;

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
          <p className="mt-0.5 text-xs text-slate-500">{unreadCount} unread</p>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 disabled:opacity-50"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Mark all read
        </button>
      </div>

      <div className="max-h-[min(65vh,28rem)] overflow-y-auto">
        <NotificationList
          notifications={notifications}
          loading={loading}
          loadingMore={false}
          error={error}
          onSelect={handleSelect}
        />
      </div>

      <Link
        href={notificationsHref}
        className="block border-t border-slate-100 px-4 py-3 text-center text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
      >
        View all notifications
      </Link>
    </div>
  );
}
