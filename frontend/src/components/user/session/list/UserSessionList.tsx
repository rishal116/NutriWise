import { CalendarDays, LoaderCircle } from "lucide-react";

import type { UserSessionListItemDTO } from "@/dtos/user/session/user-session-list.dto";

import UserSessionCard from "./UserSessionCard";

interface UserSessionListProps {
  sessions: UserSessionListItemDTO[];
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
}

export default function UserSessionList({
  sessions,
  hasMore,
  loadingMore,
  onLoadMore,
}: UserSessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-emerald-50">
          <CalendarDays size={26} className="text-emerald-600" />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          No sessions found
        </h2>

        <p className="mt-2 max-w-md text-sm text-gray-500">
          You don&apos;t have any sessions matching these filters. Try changing
          your filters or explore available sessions.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">
          Your registrations
        </h2>

        <span className="text-xs text-gray-500">
          {sessions.length} loaded
        </span>
      </div>

      {/* Session cards */}
      <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {sessions.map((item) => (
          <UserSessionCard key={item.registrationId} item={item} />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingMore && (
              <LoaderCircle size={17} className="animate-spin" />
            )}

            {loadingMore ? "Loading..." : "Load more sessions"}
          </button>
        </div>
      )}

      {!hasMore && (
        <p className="py-2 text-center text-xs text-gray-400">
          You&apos;ve reached the end of your sessions.
        </p>
      )}
    </section>
  );
}