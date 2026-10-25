"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import type { AdminNutritionistListItemDto } from "@/dtos/admin/nutritionist/admin-nutritionist-list-item.dto";
import { adminNutritionistService } from "@/services/admin/admin-nutri.service";
import { adminUserService } from "@/services/admin/admin-user.service";

import type { CoachLevelFilter } from "@/components/admin/nutritionist/nutritionist-table.types";
import {
  PAGE_SIZE,
  type SortBy,
  type StatusFilter,
} from "@/components/admin/user/user-table.types";
import { getIsBlocked } from "@/components/admin/user/user-table.utils";

interface Filters {
  search: string;
  coachLevel: CoachLevelFilter;
  status: StatusFilter;
  sortBy: SortBy;
}

interface ListState {
  /** Filter key these items were fetched for (null = nothing fetched yet). */
  key: string | null;
  items: AdminNutritionistListItemDto[];
  nextCursor: string | null;
  hasMore: boolean;
}

export function useAdminNutritionists({
  search,
  coachLevel,
  status,
  sortBy,
}: Filters) {
  const key = JSON.stringify([search.trim(), coachLevel, status, sortBy]);

  const [list, setList] = useState<ListState>({
    key: null,
    items: [],
    nextCursor: null,
    hasMore: false,
  });
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const loadingMoreRef = useRef(false);

  const fetchPage = useCallback(
    (cursor?: string) =>
      adminNutritionistService.getNutritionists({
        search: search.trim() || undefined,
        coachLevel: coachLevel === "all" ? undefined : coachLevel,
        applicationStatus: "approved",
        isBlocked: getIsBlocked(status),
        sortBy,
        cursor,
        limit: PAGE_SIZE,
      }),
    [search, coachLevel, status, sortBy],
  );

  // Fetch page one on mount and whenever the filters differ from what's shown.
  useEffect(() => {
    if (list.key === key) return;

    let cancelled = false;

    fetchPage()
      .then((data) => {
        if (cancelled) return;
        setList({
          key,
          items: data.items,
          nextCursor: data.nextCursor,
          hasMore: data.hasMore,
        });
      })
      .catch(() => {
        if (cancelled) return;
        toast.error("Failed to load nutritionists.");
        setList({ key, items: [], nextCursor: null, hasMore: false });
      });

    return () => {
      cancelled = true;
    };
  }, [key, list.key, fetchPage]);

  const isLoading = list.key !== key;

  const loadMore = useCallback(async () => {
    if (
      isLoading ||
      loadingMoreRef.current ||
      !list.hasMore ||
      !list.nextCursor
    )
      return;

    loadingMoreRef.current = true;
    setIsLoadingMore(true);

    try {
      const data = await fetchPage(list.nextCursor);

      setList((prev) => {
        if (prev.key !== key) return prev; // filters changed mid-flight
        const seen = new Set(prev.items.map((n) => n.id));
        return {
          ...prev,
          items: [...prev.items, ...data.items.filter((n) => !seen.has(n.id))],
          nextCursor: data.nextCursor,
          hasMore: data.hasMore,
        };
      });
    } catch {
      toast.error("Failed to load more nutritionists.");
    } finally {
      loadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [fetchPage, isLoading, key, list.hasMore, list.nextCursor]);

  const toggleBlock = useCallback(
    async (nutritionist: AdminNutritionistListItemDto): Promise<boolean> => {
      setIsToggling(true);

      try {
        await adminUserService.updateBlockStatus(
          nutritionist.userId,
          !nutritionist.isBlocked,
        );

        setList((prev) => ({
          ...prev,
          items:
            status === "all"
              ? prev.items.map((n) =>
                  n.id === nutritionist.id
                    ? { ...n, isBlocked: !n.isBlocked }
                    : n,
                )
              : prev.items.filter((n) => n.id !== nutritionist.id),
        }));

        toast.success(
          nutritionist.isBlocked
            ? "Nutritionist unblocked"
            : "Nutritionist blocked",
        );
        return true;
      } catch {
        toast.error("Failed to update the nutritionist's status.");
        return false;
      } finally {
        setIsToggling(false);
      }
    },
    [status],
  );

  return {
    nutritionists: list.items,
    hasMore: list.hasMore,
    isLoading,
    isRefreshing: isLoading && list.items.length > 0,
    isLoadingMore,
    isToggling,
    loadMore,
    toggleBlock,
  };
}
