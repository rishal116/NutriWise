"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { nutriClientService } from "@/services/nutritionist/nutriClient.service";
import {
  ClientSortBy,
  ClientStatusFilter,
  type GetClientsQueryDTO,
} from "@/dtos/nutritionist/client/client-request.dto";
import type {
  ClientListItemDTO,
  ClientProgramSummaryDTO,
  ProgramStatus,
  SubscriptionStatus,
} from "@/dtos/nutritionist/client/client-response.dto";

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 400;

const STATUS_TABS: { value: ClientStatusFilter; label: string }[] = [
  { value: ClientStatusFilter.ALL, label: "All" },
  { value: ClientStatusFilter.UPCOMING, label: "Upcoming" },
  { value: ClientStatusFilter.ACTIVE, label: "Active" },
  { value: ClientStatusFilter.PAUSED, label: "Paused" },
  { value: ClientStatusFilter.COMPLETED, label: "Completed" },
  { value: ClientStatusFilter.CANCELLED, label: "Cancelled" },
];

const SORT_OPTIONS: { value: ClientSortBy; label: string }[] = [
  { value: ClientSortBy.LATEST, label: "Latest" },
  { value: ClientSortBy.NAME_ASC, label: "Name (A–Z)" },
  { value: ClientSortBy.NAME_DESC, label: "Name (Z–A)" },
  { value: ClientSortBy.START_DATE, label: "Start date" },
  { value: ClientSortBy.END_DATE, label: "End date" },
  { value: ClientSortBy.PROGRESS, label: "Progress" },
];

const SUBSCRIPTION_STYLES: Record<SubscriptionStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  expired: "bg-rose-50 text-rose-700 border-rose-100",
  cancelled: "bg-slate-100 text-slate-500 border-slate-200",
};

const PROGRAM_STYLES: Record<ProgramStatus, string> = {
  upcoming: "bg-sky-50 text-sky-700 border-sky-100",
  active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  paused: "bg-amber-50 text-amber-700 border-amber-100",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-100",
};

// A client can have several programs now — pick the one most relevant to
// surface in the list row. Active takes priority, then upcoming, etc.
const PROGRAM_PRIORITY: ProgramStatus[] = [
  "active",
  "upcoming",
  "paused",
  "completed",
  "cancelled",
];

function getPrimaryProgram(
  programs: ClientProgramSummaryDTO[],
): ClientProgramSummaryDTO | null {
  if (programs.length === 0) return null;

  for (const status of PROGRAM_PRIORITY) {
    const match = programs.find((p) => p.programStatus === status);
    if (match) return match;
  }
  return programs[0];
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${className}`}
    >
      {label}
    </span>
  );
}

function ClientAvatar({ client }: { client: ClientListItemDTO }) {
  if (client.profileImage) {
    return (
      <Image
        src={client.profileImage}
        alt={client.fullName}
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 rounded-xl object-cover"
      />
    );
  }
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white">
      {client.fullName.charAt(0).toUpperCase()}
    </div>
  );
}

function ProgressBar({ program }: { program: ClientProgramSummaryDTO }) {
  const pct = Math.min(100, Math.max(0, program.completionPercentage));
  return (
    <div className="w-full min-w-[8rem]">
      <div className="mb-1 flex justify-between text-[11px] font-semibold text-slate-500">
        <span>
          Day {program.currentDay}/{program.durationDays}
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white py-16 text-center shadow-sm">
      <p className="text-sm font-bold text-slate-700">No clients found</p>
      <p className="text-xs text-slate-400">
        Try a different search term or status filter.
      </p>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
      ))}
    </div>
  );
}

export default function NutritionistClientsPage() {
  const [clients, setClients] = useState<ClientListItemDTO[]>([]);
  const [status, setStatus] = useState<ClientStatusFilter>(
    ClientStatusFilter.ALL,
  );
  const [sortBy, setSortBy] = useState<ClientSortBy>(ClientSortBy.LATEST);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);
  const router = useRouter();

  // Refs mirror the current filter/sort/search + pagination state so the
  // IntersectionObserver callback and fetchMore never close over stale values.
  const statusRef = useRef(status);
  const sortByRef = useRef(sortBy);
  const searchRef = useRef(debouncedSearch);
  const cursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);
  const fetchingMoreRef = useRef(false);
  const resettingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    sortByRef.current = sortBy;
  }, [sortBy]);

  useEffect(() => {
    searchRef.current = debouncedSearch;
  }, [debouncedSearch]);

  const buildQuery = useCallback(
    (cursor: string | null): GetClientsQueryDTO => ({
      limit: PAGE_SIZE,
      cursor: cursor ?? undefined,
      search: searchRef.current.trim() || undefined,
      status: statusRef.current,
      sortBy: sortByRef.current,
    }),
    [],
  );

  // Reset and fetch page one whenever status, sort, or debounced search changes.
  useEffect(() => {
    let cancelled = false;
    resettingRef.current = true;
    setLoading(true);

    (async () => {
      try {
        const res = await nutriClientService.getClients(buildQuery(null));

        if (cancelled) return;
        setClients(res.items);
        cursorRef.current = res.nextCursor;
        hasMoreRef.current = res.hasMore;
        setHasMore(res.hasMore);
      } catch {
        if (!cancelled) {
          toast.error("Couldn't load clients. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          resettingRef.current = false;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, sortBy, debouncedSearch, buildQuery]);

  const fetchMore = useCallback(async () => {
    if (
      fetchingMoreRef.current ||
      resettingRef.current ||
      !hasMoreRef.current
    ) {
      return;
    }
    fetchingMoreRef.current = true;
    setLoadingMore(true);

    try {
      const res = await nutriClientService.getClients(
        buildQuery(cursorRef.current),
      );
      setClients((prev) => [...prev, ...res.items]);
      cursorRef.current = res.nextCursor;
      hasMoreRef.current = res.hasMore;
      setHasMore(res.hasMore);
    } catch {
      toast.error("Couldn't load more clients.");
    } finally {
      fetchingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [buildQuery]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchMore]);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Your clients
          </h1>
          <p className="text-sm text-slate-500">
            Track subscriptions, plan progress, and program status.
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients by name or username"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as ClientSortBy)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 sm:w-48"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatus(tab.value)}
                className={`shrink-0 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
                  status === tab.value
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <TableSkeleton />
        ) : clients.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Client
                    </th>
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Dates
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clients.map((client) => {
                    const primary = getPrimaryProgram(client.programs);
                    const extraCount = client.programs.length - 1;

                    return (
                      <tr
                        key={client.clientId}
                        onClick={() =>
                          router.push(
                            `/nutritionist/clients/${client.clientId}`,
                          )
                        }
                        className="cursor-pointer transition-colors hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <ClientAvatar client={client} />
                            <div>
                              <div className="text-sm font-bold text-slate-900">
                                {client.fullName}
                              </div>
                              <div className="text-xs text-slate-400">
                                @{client.username}
                              </div>
                            </div>
                          </div>
                        </td>

                        {!primary ? (
                          <td
                            colSpan={4}
                            className="px-6 py-4 text-xs font-medium text-slate-400"
                          >
                            No program assigned yet.
                          </td>
                        ) : (
                          <>
                            <td className="px-6 py-4 text-sm font-medium text-slate-700">
                              <div className="flex items-center gap-1.5">
                                {primary.planTitle}
                                {extraCount > 0 && (
                                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                                    +{extraCount} more
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1.5">
                                <Badge
                                  label={primary.subscriptionStatus}
                                  className={
                                    SUBSCRIPTION_STYLES[
                                      primary.subscriptionStatus
                                    ]
                                  }
                                />
                                <Badge
                                  label={primary.programStatus}
                                  className={
                                    PROGRAM_STYLES[primary.programStatus]
                                  }
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <ProgressBar program={primary} />
                            </td>
                            <td className="px-6 py-4 text-xs font-medium text-slate-500">
                              <div>{formatDate(primary.startDate)}</div>
                              <div>{formatDate(primary.endDate)}</div>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
              {clients.map((client) => {
                const primary = getPrimaryProgram(client.programs);
                const extraCount = client.programs.length - 1;

                return (
                  <div
                    key={client.clientId}
                    onClick={() =>
                      router.push(`/nutritionist/clients/${client.clientId}`)
                    }
                    className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm active:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <ClientAvatar client={client} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold text-slate-900">
                          {client.fullName}
                        </div>
                        <div className="truncate text-xs text-slate-400">
                          @{client.username}
                        </div>
                      </div>
                    </div>

                    {!primary ? (
                      <p className="mt-3 text-xs font-medium text-slate-400">
                        No program assigned yet.
                      </p>
                    ) : (
                      <>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <Badge
                            label={primary.subscriptionStatus}
                            className={
                              SUBSCRIPTION_STYLES[primary.subscriptionStatus]
                            }
                          />
                          <Badge
                            label={primary.programStatus}
                            className={PROGRAM_STYLES[primary.programStatus]}
                          />
                          {extraCount > 0 && (
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                              +{extraCount} more
                            </span>
                          )}
                        </div>

                        <p className="mt-3 text-sm font-medium text-slate-700">
                          {primary.planTitle}
                        </p>

                        <div className="mt-3">
                          <ProgressBar program={primary} />
                        </div>

                        <div className="mt-3 flex justify-between text-xs font-medium text-slate-500">
                          <span>{formatDate(primary.startDate)}</span>
                          <span>{formatDate(primary.endDate)}</span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-1" />
        {loadingMore && (
          <div className="flex justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-100 border-t-emerald-600" />
          </div>
        )}
        {!hasMore && clients.length > 0 && (
          <p className="py-2 text-center text-xs font-medium text-slate-400">
            You&apos;ve reached the end of the list.
          </p>
        )}
      </div>
    </div>
  );
}
