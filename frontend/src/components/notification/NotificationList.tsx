
"use client";

import type { NotificationResponseDTO } from "@/dtos/notification/notification-response.dto";
import NotificationItem from "./NotificationItem";

interface NotificationListProps {
  notifications: NotificationResponseDTO[];
  loading: boolean;
  error: string | null;
  onSelect: (notification: NotificationResponseDTO) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
}

export default function NotificationList({
  notifications,
  loading,
  error,
  onSelect,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
}: NotificationListProps) {
  if (loading && notifications.length === 0) {
    return (
      <div className="divide-y divide-slate-100">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex animate-pulse gap-3 p-4">
            <div className="h-10 w-10 rounded-xl bg-slate-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/5 rounded bg-slate-100" />
              <div className="h-3 w-full rounded bg-slate-100" />
              <div className="h-3 w-1/4 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && notifications.length === 0) {
    return (
      <div className="px-5 py-12 text-center">
        <p className="text-sm font-medium text-rose-600">{error}</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="px-5 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <span aria-hidden="true">🔔</span>
        </div>
        <h3 className="mt-4 text-sm font-semibold text-slate-900">
          You&apos;re all caught up
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          New notifications will appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onSelect={onSelect}
        />
      ))}

      {error && (
        <p role="alert" className="px-4 py-3 text-sm text-rose-600">
          {error}
        </p>
      )}

      {hasMore && (
        <div className="p-4 text-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 disabled:opacity-50"
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
