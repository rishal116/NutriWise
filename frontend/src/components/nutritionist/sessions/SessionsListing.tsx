"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Plus } from "lucide-react";
import { nutriSessionService } from "@/services/nutritionist/nutriSession.service";
import type { NutriSessionListResponseDTO } from "@/dtos/nutritionist/session/session-list-response.dto";
import type {
  GetNutriSessionsQueryDTO,
  NutriSessionSortOption,
} from "@/dtos/nutritionist/session/session-list-query.dto";
import type {
  SessionStatus,
  SessionType,
} from "@/types/nutritionist/session/session.types";
import SessionFilters from "@/components/nutritionist/sessions/SessionFilters";
import SessionCard from "@/components/nutritionist/sessions/SessionCard";
import SessionCardSkeleton from "@/components/nutritionist/sessions/SessionCardSkeleton";
import SessionListState from "@/components/nutritionist/sessions/SessionListState";
import { PAGE_LIMIT } from "@/components/nutritionist/sessions/session-list.constants";

export default function SessionsListing() {
  const [sessions, setSessions] = useState<NutriSessionListResponseDTO[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<SessionStatus | "">("");
  const [type, setType] = useState<SessionType | "">("");
  const [sortBy, setSortBy] = useState<NutriSessionSortOption>("latest");

  const cursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(false);
  const fetchingMoreRef = useRef(false);
  const requestIdRef = useRef(0);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [search]);

  // Identity changes whenever a filter changes, which triggers the reset below.
  const fetchSessions = useCallback(
    async (reset: boolean) => {
      if (!reset && (fetchingMoreRef.current || !hasMoreRef.current)) {
        return;
      }

      const requestId = reset ? ++requestIdRef.current : requestIdRef.current;

      setError(null);

      if (reset) {
        cursorRef.current = null;
        hasMoreRef.current = false;
        fetchingMoreRef.current = false;

        setInitialLoading(true);
        setLoadingMore(false);
        setHasMore(false);
      } else {
        fetchingMoreRef.current = true;
        setLoadingMore(true);
      }

      try {
        const query: GetNutriSessionsQueryDTO = {
          limit: PAGE_LIMIT,
          cursor: reset ? undefined : (cursorRef.current ?? undefined),
          search: debouncedSearch || undefined,
          status: status || undefined,
          type: type || undefined,
          sortBy,
        };

        const response = await nutriSessionService.getSessions(query);

        // Ignore responses belonging to an outdated filter or request.
        if (requestId !== requestIdRef.current) {
          return;
        }

        setSessions((previous) =>
          reset ? response.items : [...previous, ...response.items],
        );

        cursorRef.current = response.nextCursor;
        hasMoreRef.current = response.hasMore;
        setHasMore(response.hasMore);
      } catch {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setError("We couldn't load your sessions. Please try again.");

        if (reset) {
          setSessions([]);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          if (reset) {
            setInitialLoading(false);
          } else {
            fetchingMoreRef.current = false;
            setLoadingMore(false);
          }
        }
      }
    },
    [debouncedSearch, status, type, sortBy],
  );

  useEffect(() => {
    void fetchSessions(true);
  }, [fetchSessions]);

  // Fetch the next cursor page when the sentinel approaches the viewport.
  // initialLoading is a dependency so the observer re-attaches when the sentinel mounts.
  useEffect(() => {
    const node = sentinelRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void fetchSessions(false);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [fetchSessions, initialLoading, sessions.length]);

  const showEmpty = !initialLoading && !error && sessions.length === 0;

  const showInitialError =
    !initialLoading && Boolean(error) && sessions.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link
          href="/nutritionist/sessions/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-emerald-800"
        >
          <Plus className="h-4 w-4" />
          Create Session
        </Link>
      </div>

      <SessionFilters
        search={search}
        type={type}
        status={status}
        sortBy={sortBy}
        onSearchChange={setSearch}
        onTypeChange={setType}
        onStatusChange={setStatus}
        onSortChange={setSortBy}
      />

      {showInitialError && (
        <SessionListState
          type="error"
          message={error ?? undefined}
          onRetry={() => void fetchSessions(true)}
        />
      )}

      {showEmpty && <SessionListState type="empty" />}

      {initialLoading && (
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          aria-label="Loading sessions"
          aria-busy="true"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <SessionCardSkeleton key={index} />
          ))}
        </div>
      )}

      {!initialLoading && sessions.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sessions.map((session) => (
              <SessionCard key={session.sessionId} session={session} />
            ))}
          </div>

          <div
            ref={sentinelRef}
            className="flex min-h-10 items-center justify-center py-2"
          >
            {loadingMore && (
              <div
                className="flex items-center gap-2 text-sm font-medium text-slate-500"
                role="status"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading more sessions...
              </div>
            )}

            {!hasMore && !loadingMore && !error && (
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                You&apos;ve reached the end of the list
              </p>
            )}

            {error && !loadingMore && (
              <button
                type="button"
                onClick={() => void fetchSessions(false)}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Retry loading more
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}