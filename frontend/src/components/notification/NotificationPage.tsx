
"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCheck, RefreshCw } from "lucide-react";

import { notificationService } from "@/services/common/notification.service";
import type { NotificationResponseDTO } from "@/dtos/notification/notification-response.dto";
import type { NotificationQueryDTO } from "@/dtos/notification/notification-query.dto";
import NotificationList from "./NotificationList";

type Filter = "all" | "unread" | "read";

const PAGE_SIZE = 10;

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<NotificationResponseDTO[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<Filter>("all");
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to load unread notification count:", err);
    }
  }, []);

  const loadNotifications = useCallback(
    async (cursor?: string, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const query: NotificationQueryDTO = {
          limit: PAGE_SIZE,
          ...(cursor ? { cursor } : {}),
          ...(filter === "unread"
            ? { isRead: false }
            : filter === "read"
              ? { isRead: true }
              : {}),
        };

        const result = await notificationService.getNotifications(query);

        setNotifications((current) => {
          const incoming = result.items;

          if (!append) return incoming;

          const existingIds = new Set(current.map((item) => item.id));

          return [
            ...current,
            ...incoming.filter((item) => !existingIds.has(item.id)),
          ];
        });

        setNextCursor(result.nextCursor ?? undefined);
        setHasMore(Boolean(result.nextCursor));
      } catch (err) {
        console.error("Failed to load notifications:", err);
        setError("Unable to load notifications. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filter],
  );

  useEffect(() => {
    setNotifications([]);
    setNextCursor(undefined);
    setHasMore(false);

    void loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    void loadUnreadCount();
  }, [loadUnreadCount]);

  const handleSelect = async (
    notification: NotificationResponseDTO,
  ) => {
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
    if (unreadCount === 0 || markingAll) return;

    setMarkingAll(true);
    setError(null);

    try {
      await notificationService.markAllNotificationsRead();

      setNotifications((current) =>
        current.map((item) => ({ ...item, isRead: true })),
      );

      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      setError("Unable to mark all notifications as read.");
    } finally {
      setMarkingAll(false);
    }
  };

  const handleRefresh = async () => {
    setNextCursor(undefined);
    setHasMore(false);
    await loadNotifications();
    await loadUnreadCount();
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Stay up to date with your NutriWise activity.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          aria-label="Refresh notifications"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
          <div>
            <h2 className="font-semibold text-slate-900">Your activity</h2>
            <p className="mt-1 text-xs text-slate-500">
              {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0 || markingAll}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 disabled:opacity-50"
          >
            <CheckCheck className="h-4 w-4" />
            {markingAll ? "Marking..." : "Mark all as read"}
          </button>
        </div>

        <div className="flex gap-1 border-b border-slate-100 px-4 pt-3">
          {(["all", "unread", "read"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={`rounded-t-lg border-b-2 px-3 py-2 text-sm font-medium capitalize transition-colors ${
                filter === value
                  ? "border-emerald-700 text-emerald-800"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {value}
            </button>
          ))}
        </div>

        <NotificationList
          notifications={notifications}
          loading={loading}
          loadingMore={loadingMore}
          error={error}
          onSelect={handleSelect}
          hasMore={hasMore}
          onLoadMore={() => {
            if (nextCursor && !loadingMore) {
              void loadNotifications(nextCursor, true);
            }
          }}
        />
      </section>
    </main>
  );
}
