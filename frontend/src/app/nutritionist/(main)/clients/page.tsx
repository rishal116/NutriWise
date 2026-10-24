"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, UsersRound } from "lucide-react";
import { toast } from "sonner";

import {
  ClientSortBy,
  ClientStatusFilter,
  type GetClientsQueryDTO,
} from "@/dtos/nutritionist/client/client-request.dto";
import type { ClientListItemDTO } from "@/dtos/nutritionist/client/client-response.dto";
import { nutriClientService } from "@/services/nutritionist/nutri-client.service";

import ClientCard from "@/components/nutritionist/client/ClientCard";
import ClientEmptyState from "@/components/nutritionist/client/ClientEmptyState";
import ClientGridSkeleton from "@/components/nutritionist/client/ClientGridSkeleton";

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 400;

const STATUS_TABS: {
  value: ClientStatusFilter;
  label: string;
}[] = [
  { value: ClientStatusFilter.ALL, label: "All clients" },
  { value: ClientStatusFilter.UPCOMING, label: "Upcoming" },
  { value: ClientStatusFilter.ACTIVE, label: "Active" },
  { value: ClientStatusFilter.PAUSED, label: "Paused" },
  { value: ClientStatusFilter.COMPLETED, label: "Completed" },
  { value: ClientStatusFilter.CANCELLED, label: "Cancelled" },
];

const SORT_OPTIONS: {
  value: ClientSortBy;
  label: string;
}[] = [
  { value: ClientSortBy.LATEST, label: "Latest" },
  { value: ClientSortBy.NAME_ASC, label: "Name (A–Z)" },
  { value: ClientSortBy.NAME_DESC, label: "Name (Z–A)" },
  { value: ClientSortBy.START_DATE, label: "Start date" },
  { value: ClientSortBy.END_DATE, label: "End date" },
  { value: ClientSortBy.PROGRESS, label: "Progress" },
];

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);

    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

export default function NutritionistClientsPage() {
  const router = useRouter();

  const [clients, setClients] = useState<ClientListItemDTO[]>([]);
  const [status, setStatus] = useState<ClientStatusFilter>(
    ClientStatusFilter.ALL,
  );
  const [sortBy, setSortBy] = useState<ClientSortBy>(ClientSortBy.LATEST);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const cursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(false);
  const fetchingMoreRef = useRef(false);
  const generationRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const buildQuery = useCallback(
    (cursor: string | null): GetClientsQueryDTO => ({
      limit: PAGE_SIZE,
      cursor: cursor ?? undefined,
      search: debouncedSearch.trim() || undefined,
      status,
      sortBy,
    }),
    [debouncedSearch, status, sortBy],
  );

  const loadFirstPage = useCallback(async () => {
    const generation = ++generationRef.current;

    fetchingMoreRef.current = false;
    cursorRef.current = null;
    hasMoreRef.current = false;

    setLoading(true);
    setLoadingMore(false);
    setHasMore(false);
    setLoadError(false);
    setClients([]);

    try {
      const response = await nutriClientService.getClients(buildQuery(null));

      if (generation !== generationRef.current) {
        return;
      }

      setClients(response.items);
      cursorRef.current = response.nextCursor;
      hasMoreRef.current = response.hasMore;
      setHasMore(response.hasMore);
    } catch {
      if (generation !== generationRef.current) {
        return;
      }

      setLoadError(true);
      toast.error("Couldn't load clients. Please try again.");
    } finally {
      if (generation === generationRef.current) {
        setLoading(false);
      }
    }
  }, [buildQuery]);

  useEffect(() => {
    void loadFirstPage();

    return () => {
      // Invalidates requests that finish after the filters change or page unmounts.
      generationRef.current += 1;
    };
  }, [loadFirstPage]);

  const fetchMore = useCallback(async () => {
    if (
      loading ||
      loadError ||
      fetchingMoreRef.current ||
      !hasMoreRef.current ||
      !cursorRef.current
    ) {
      return;
    }

    const generation = generationRef.current;
    const cursor = cursorRef.current;

    fetchingMoreRef.current = true;
    setLoadingMore(true);

    try {
      const response = await nutriClientService.getClients(buildQuery(cursor));

      if (generation !== generationRef.current) {
        return;
      }

      setClients((current) => {
        const existingIds = new Set(current.map((client) => client.clientId));

        const newClients = response.items.filter(
          (client) => !existingIds.has(client.clientId),
        );

        return [...current, ...newClients];
      });

      cursorRef.current = response.nextCursor;
      hasMoreRef.current = response.hasMore;
      setHasMore(response.hasMore);
    } catch {
      if (generation === generationRef.current) {
        toast.error("Couldn't load more clients. Please try again.");
      }
    } finally {
      if (generation === generationRef.current) {
        fetchingMoreRef.current = false;
        setLoadingMore(false);
      }
    }
  }, [buildQuery, loading, loadError]);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || loading || loadError || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void fetchMore();
        }
      },
      { rootMargin: "250px 0px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [fetchMore, hasMore, loading, loadError]);

  const hasFilters =
    search.trim().length > 0 || status !== ClientStatusFilter.ALL;

  const clearFilters = () => {
    setSearch("");
    setStatus(ClientStatusFilter.ALL);
    setSortBy(ClientSortBy.LATEST);
  };

  const openClient = (clientId: string) => {
    router.push(`/nutritionist/clients/${clientId}`);
  };

  return (
    <main className="min-h-screen bg-slate-50/80 pb-12">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <UsersRound size={14} aria-hidden="true" />
              Client management
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Your clients
            </h1>

            <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-500">
              View client programs, track progress, and quickly open individual
              client profiles.
            </p>
          </div>

          {!loading && !loadError && (
            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
              <UsersRound
                size={16}
                className="text-emerald-700"
                aria-hidden="true"
              />
              <span className="text-sm font-semibold text-slate-700">
                {clients.length}
                {hasMore ? "+" : ""} loaded
              </span>
            </div>
          )}
        </header>

        <section
          aria-label="Client search and filters"
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search clients by name"
                aria-label="Search clients by name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>

            <div className="relative sm:w-52">
              <SlidersHorizontal
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as ClientSortBy)
                }
                aria-label="Sort clients"
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            className="flex items-center gap-2 overflow-x-auto pb-1"
            aria-label="Filter clients by program status"
          >
            {STATUS_TABS.map((tab) => {
              const selected = status === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setStatus(tab.value)}
                  className={`shrink-0 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                    selected
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </section>

        {loading ? (
          <ClientGridSkeleton count={6} />
        ) : loadError ? (
          <div className="rounded-2xl border border-rose-100 bg-white px-5 py-12 text-center">
            <p className="text-sm font-semibold text-slate-800">
              We couldn&apos;t load your clients.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Check your connection and try again.
            </p>
            <button
              type="button"
              onClick={() => void loadFirstPage()}
              className="mt-4 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Try again
            </button>
          </div>
        ) : clients.length === 0 ? (
          <ClientEmptyState hasFilters={hasFilters} onReset={clearFilters} />
        ) : (
          <>
            <section
              aria-label="Clients"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
            >
              {clients.map((client) => (
                <ClientCard
                  key={client.clientId}
                  client={client}
                  onClick={openClient}
                />
              ))}
            </section>

            <div ref={sentinelRef} className="h-1" aria-hidden="true" />

            {loadingMore && (
              <div
                className="flex justify-center py-4"
                role="status"
                aria-label="Loading more clients"
              >
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-100 border-t-emerald-600" />
              </div>
            )}

            {!hasMore && (
              <p className="py-3 text-center text-xs font-medium text-slate-400">
                You&apos;ve reached the end of your clients.
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
