"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import type { AdminNutritionistApplicationListItemDto } from "@/dtos/admin/nutritionistApplication/admin-nutritionist-application-list-item.dto";
import { adminNutritionistApplicationService } from "@/services/admin/adminNutriApplication.service";
import { useDebounce } from "@/hooks/admin/debounce.hooks";

import ApplicationFilters from "./ApplicationFilters";
import ApplicationTableRows from "./ApplicationTableRows";
import {
  PAGE_SIZE,
  type SortBy,
  type StatusFilter,
} from "./application-table.utils";

export default function ApplicationTable() {
  const [applications, setApplications] = useState<
    AdminNutritionistApplicationListItemDto[]
  >([]);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("pending");

  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const fetchingMoreRef = useRef(false);
  const requestIdRef = useRef(0);

  const fetchApplications = useCallback(
    async (cursor: string | undefined, requestId: number) => {
      const response =
        await adminNutritionistApplicationService.getApplications({
          search: debouncedSearch.trim() || undefined,
          sortBy,
          applicationStatus:
            statusFilter === "all" ? undefined : statusFilter,
          cursor,
          limit: PAGE_SIZE,
        });

      // Ignore responses belonging to previous filters.
      if (requestId !== requestIdRef.current) {
        return;
      }

      const pagination = response.data;

      if (!response.success || !pagination) {
        throw new Error(
          response.message || "Failed to fetch applications",
        );
      }

      setApplications((previous) => {
        if (!cursor) {
          return pagination.items;
        }

        const existingIds = new Set(previous.map((item) => item.id));

        return [
          ...previous,
          ...pagination.items.filter(
            (item) => !existingIds.has(item.id),
          ),
        ];
      });

      setNextCursor(pagination.nextCursor);
      setHasMore(pagination.hasMore);
    },
    [debouncedSearch, sortBy, statusFilter],
  );

  // Fetch the first page when search, sort, or status changes.
  useEffect(() => {
    const requestId = ++requestIdRef.current;

    fetchingMoreRef.current = false;
    setIsLoading(true);
    setIsLoadingMore(false);
    setApplications([]);
    setNextCursor(null);
    setHasMore(false);

    const loadFirstPage = async () => {
      try {
        await fetchApplications(undefined, requestId);
      } catch {
        if (requestId === requestIdRef.current) {
          toast.error("Failed to load applications");
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    };

    void loadFirstPage();

    return () => {
      if (requestIdRef.current === requestId) {
        requestIdRef.current += 1;
      }
    };
  }, [fetchApplications]);

  // Fetch the next page when the sentinel becomes visible.
  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          !entry.isIntersecting ||
          isLoading ||
          isLoadingMore ||
          fetchingMoreRef.current ||
          !hasMore ||
          !nextCursor
        ) {
          return;
        }

        const requestId = requestIdRef.current;
        const cursor = nextCursor;

        fetchingMoreRef.current = true;
        setIsLoadingMore(true);

        void fetchApplications(cursor, requestId)
          .catch(() => {
            if (requestId === requestIdRef.current) {
              toast.error("Failed to load more applications");
            }
          })
          .finally(() => {
            if (requestId === requestIdRef.current) {
              fetchingMoreRef.current = false;
              setIsLoadingMore(false);
            }
          });
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [
    fetchApplications,
    hasMore,
    isLoading,
    isLoadingMore,
    nextCursor,
  ]);

  const handleClearFilters = () => {
    setSearch("");
    setSortBy("newest");
    setStatusFilter("pending");
  };

  const hasActiveFilters =
    Boolean(search.trim()) ||
    sortBy !== "newest" ||
    statusFilter !== "pending";

  return (
    <div className="bg-white">
      <ApplicationFilters
        search={search}
        sortBy={sortBy}
        statusFilter={statusFilter}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onSort={() =>
          setSortBy((current) =>
            current === "newest" ? "oldest" : "newest",
          )
        }
        onStatusChange={setStatusFilter}
        onClearFilters={handleClearFilters}
      />

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-start justify-center bg-white/70 pt-16 backdrop-blur-[1px]">
            <Loader2
              size={20}
              className="animate-spin text-slate-400"
            />
          </div>
        )}

        <ApplicationTableRows
          applications={applications}
          isLoading={isLoading}
        />
      </div>

      <div
        ref={sentinelRef}
        className="flex h-16 items-center justify-center"
      >
        {isLoadingMore && (
          <Loader2
            size={18}
            className="animate-spin text-slate-400"
          />
        )}

        {!isLoading &&
          !isLoadingMore &&
          !hasMore &&
          applications.length > 0 && (
            <span className="text-xs font-medium text-slate-400">
              No more applications
            </span>
          )}
      </div>
    </div>
  );
}