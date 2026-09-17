"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Filter,
  Loader2,
  Search,
  SlidersHorizontal,
  UsersRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { nutriGroupService } from "@/services/nutritionist/nutriGroup.service";

import type { GroupListItemDTO } from "@/dtos/nutritionist/group/group-list-item.dto";
import type { NutritionistGroupListQueryDTO } from "@/dtos/nutritionist/group/group-list-query.dto";

import GroupCard from "./GroupCard";

const LIMIT = 12;

const SORT_OPTIONS: {
  value: NonNullable<NutritionistGroupListQueryDTO["sortBy"]>;
  label: string;
}[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title_asc", label: "Title A–Z" },
  { value: "title_desc", label: "Title Z–A" },
];

const STATUS_OPTIONS: {
  value: NonNullable<NutritionistGroupListQueryDTO["status"]>;
  label: string;
}[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "blocked", label: "Blocked" },
  { value: "closed", label: "Closed" },
];

const VISIBILITY_OPTIONS: {
  value: NonNullable<NutritionistGroupListQueryDTO["visibility"]>;
  label: string;
}[] = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
];

function GroupSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="h-36 animate-pulse bg-slate-100" />

      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />

        <div className="flex justify-between pt-3">
          <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <UsersRound size={25} />
      </div>

      <h3 className="mt-5 text-base font-bold text-slate-900">
        No groups found
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        Try changing your search or filters, or create a new community group
        for your clients.
      </p>
    </div>
  );
}

export default function GroupList() {
  const [groups, setGroups] = useState<GroupListItemDTO[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] =
    useState<NutritionistGroupListQueryDTO["sortBy"]>("newest");

  const [status, setStatus] =
    useState<NutritionistGroupListQueryDTO["status"]>();

  const [visibility, setVisibility] =
    useState<NutritionistGroupListQueryDTO["visibility"]>();

  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim());
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const fetchGroups = useCallback(
    async (cursor: string | undefined, reset: boolean) => {
      const requestId = ++requestIdRef.current;

      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const query: NutritionistGroupListQueryDTO = {
          limit: LIMIT,
          sortBy,
        };

        if (search) {
          query.search = search;
        }

        if (status) {
          query.status = status;
        }

        if (visibility) {
          query.visibility = visibility;
        }

        if (cursor) {
          query.cursor = cursor;
        }

        const response = await nutriGroupService.getGroups(query);

        if (requestId !== requestIdRef.current) {
          return;
        }

        if (reset) {
          setGroups(response.items);
        } else {
          setGroups((current) => {
            const existingIds = new Set(current.map((group) => group.id));

            const newGroups = response.items.filter(
              (group) => !existingIds.has(group.id),
            );

            return [...current, ...newGroups];
          });
        }

        setNextCursor(response.nextCursor);
        setHasMore(response.hasMore);
      } catch {
        if (requestId === requestIdRef.current) {
          toast.error("Unable to load groups.");
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [search, sortBy, status, visibility],
  );

  useEffect(() => {
    setGroups([]);
    setNextCursor(null);
    setHasMore(true);

    void fetchGroups(undefined, true);
  }, [fetchGroups]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading || loadingMore || !nextCursor) {
      return;
    }

    void fetchGroups(nextCursor, false);
  }, [fetchGroups, hasMore, loading, loadingMore, nextCursor]);

  useEffect(() => {
    const target = observerRef.current;

    if (!target || loading || loadingMore || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: "240px",
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasMore, loadMore, loading, loadingMore]);

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus(undefined);
    setVisibility(undefined);
    setSortBy("newest");
  };

  const hasActiveFilters =
    Boolean(searchInput) ||
    Boolean(status) ||
    Boolean(visibility) ||
    sortBy !== "newest";

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search groups..."
              aria-label="Search groups"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />

            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex">
            <label className="relative">
              <span className="sr-only">Sort groups</span>

              <SlidersHorizontal
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target
                      .value as NutritionistGroupListQueryDTO["sortBy"],
                  )
                }
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:min-w-40"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </label>

            <label className="relative">
              <span className="sr-only">Filter by visibility</span>

              <Filter
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={visibility ?? ""}
                onChange={(event) =>
                  setVisibility(
                    event.target.value
                      ? (event.target
                          .value as NutritionistGroupListQueryDTO["visibility"])
                      : undefined,
                  )
                }
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:min-w-36"
              >
                <option value="">Visibility</option>

                {VISIBILITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </label>

            <label className="relative">
              <span className="sr-only">Filter by status</span>

              <select
                value={status ?? ""}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                      ? (event.target
                          .value as NutritionistGroupListQueryDTO["status"])
                      : undefined,
                  )
                }
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:min-w-36"
              >
                <option value="">Status</option>

                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </label>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <p className="text-xs font-medium text-slate-500">
              Filters are applied automatically
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-bold text-emerald-600 transition hover:text-emerald-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <GroupSkeleton key={index} />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>

          <div
            ref={observerRef}
            className="flex min-h-14 items-center justify-center"
          >
            {loadingMore && (
              <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                <Loader2 size={17} className="animate-spin" />
                Loading more groups...
              </div>
            )}

            {!loadingMore && !hasMore && (
              <p className="text-xs font-medium text-slate-400">
                You&apos;ve reached the end of your groups.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}