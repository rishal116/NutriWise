"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircle, RefreshCw } from "lucide-react";

import type {
  SessionRegistrationStatus,
} from "@/constants/common/session-registration.constants";
import type { SessionStatus } from "@/constants/common/session.constants";

import type { UserSessionListItemDTO } from "@/dtos/user/session/user-session-list.dto";
import type {
  UserSessionListQueryDTO,
  UserSessionSortBy,
} from "@/dtos/user/session/user-session-list-query.dto";

import { userSessionService } from "@/services/user/user-session.service";

import UserSessionFilters from "./UserSessionFilters";
import UserSessionList from "./UserSessionList";

export default function UserSessionsClient() {
  const [sessions, setSessions] = useState<UserSessionListItemDTO[]>([]);

  const [searchInput, setSearchInput] = useState("");
  const [registrationStatus, setRegistrationStatus] =
    useState<SessionRegistrationStatus | "">("");
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | "">("");

  const [query, setQuery] = useState<UserSessionListQueryDTO>({
    sortBy: "upcoming",
    limit: 10,
  });

  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const requestIdRef = useRef(0);

  const fetchSessions = useCallback(
    async (cursor?: string, append = false) => {
      const requestId = ++requestIdRef.current;

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const response = await userSessionService.getUserSessions({
          ...query,
          ...(cursor ? { cursor } : {}),
        });

        const result = response.data;

        if (!result) {
          throw new Error("Session list data was not returned.");
        }

        if (requestId !== requestIdRef.current) return;

        setSessions((previous) =>
          append ? [...previous, ...result.items] : result.items,
        );

        setNextCursor(result.nextCursor);
        setHasMore(result.hasMore);
      } catch {
        if (requestId !== requestIdRef.current) return;

        setError("Unable to load your sessions. Please try again.");

        if (!append) {
          setSessions([]);
          setNextCursor(null);
          setHasMore(false);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [query],
  );

  useEffect(() => {
    void fetchSessions();
  }, [fetchSessions, refreshKey]);

  function handleFilterSubmit() {
    setQuery((previous) => ({
      ...previous,
      search: searchInput.trim() || undefined,
      registrationStatus: registrationStatus || undefined,
      sessionStatus: sessionStatus || undefined,
      cursor: undefined,
    }));
  }

  function handleResetFilters() {
    setSearchInput("");
    setRegistrationStatus("");
    setSessionStatus("");

    setQuery({
      sortBy: "upcoming",
      limit: 10,
    });
  }

  function handleSortChange(sortBy: UserSessionSortBy) {
    setQuery((previous) => ({
      ...previous,
      sortBy,
      cursor: undefined,
    }));
  }

  function handleLoadMore() {
    if (!nextCursor || !hasMore || loadingMore || loading) return;

    void fetchSessions(nextCursor, true);
  }

  function handleRefresh() {
    setRefreshKey((previous) => previous + 1);
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            My sessions
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your registrations and keep track of upcoming sessions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading || loadingMore}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </section>

      <UserSessionFilters
        search={searchInput}
        registrationStatus={registrationStatus}
        sessionStatus={sessionStatus}
        sortBy={query.sortBy ?? "upcoming"}
        onSearchChange={setSearchInput}
        onRegistrationStatusChange={setRegistrationStatus}
        onSessionStatusChange={setSessionStatus}
        onSortChange={handleSortChange}
        onSubmit={handleFilterSubmit}
        onReset={handleResetFilters}
      />

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-red-700">{error}</p>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading || loadingMore}
            className="text-sm font-semibold text-red-700 hover:underline disabled:opacity-50"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-56 items-center justify-center rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <LoaderCircle
              size={20}
              className="animate-spin text-emerald-600"
            />
            Loading your sessions...
          </div>
        </div>
      ) : (
        <UserSessionList
          sessions={sessions}
          hasMore={hasMore}
          loadingMore={loadingMore}
          onLoadMore={handleLoadMore}
        />
      )}
    </main>
  );
}