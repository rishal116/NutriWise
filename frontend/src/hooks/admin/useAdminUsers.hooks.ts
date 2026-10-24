"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import type { AdminUserListItemDto } from "@/dtos/admin/user/admin-user-list-item.dto";
import { adminUserService } from "@/services/admin/adminUser.service";

import {
  PAGE_SIZE,
  type SortBy,
  type StatusFilter,
} from "@/components/admin/user/user-table.types";
import { getIsBlocked } from "@/components/admin/user/user-table.utils";

interface Filters {
  search: string;
  status: StatusFilter;
  sortBy: SortBy;
}

export function useAdminUsers({ search, status, sortBy }: Filters) {
  const [users, setUsers] = useState<AdminUserListItemDto[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Guards against stale responses when filters change mid-flight.
  const requestIdRef = useRef(0);
  const loadingMoreRef = useRef(false);

  const fetchPage = useCallback(
    async (requestId: number, cursor?: string) => {
      const response = await adminUserService.getUsers({
        search: search.trim() || undefined,
        isBlocked: getIsBlocked(status),
        sortBy,
        cursor,
        limit: PAGE_SIZE,
      });

      if (requestId !== requestIdRef.current) return;

      const data = response.data;
      if (!response.success || !data) {
        throw new Error(response.message || "Failed to retrieve users.");
      }

      setUsers((prev) => {
        if (!cursor) return data.items;
        const seen = new Set(prev.map((u) => u.id));
        return [...prev, ...data.items.filter((u) => !seen.has(u.id))];
      });
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    },
    [search, status, sortBy],
  );

  // First page — reruns whenever filters change.
  useEffect(() => {
    const requestId = ++requestIdRef.current;
    loadingMoreRef.current = false;

    setIsLoading(true);
    setIsLoadingMore(false);
    setHasMore(false);
    setNextCursor(null);

    fetchPage(requestId)
      .catch(() => {
        if (requestId === requestIdRef.current) {
          toast.error("Failed to load users.");
        }
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setIsLoading(false);
      });

    return () => {
      requestIdRef.current += 1;
    };
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (isLoading || loadingMoreRef.current || !hasMore || !nextCursor) return;

    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    const requestId = requestIdRef.current;

    try {
      await fetchPage(requestId, nextCursor);
    } catch {
      if (requestId === requestIdRef.current) {
        toast.error("Failed to load more users.");
      }
    } finally {
      loadingMoreRef.current = false;
      if (requestId === requestIdRef.current) setIsLoadingMore(false);
    }
  }, [fetchPage, hasMore, isLoading, nextCursor]);

  const toggleBlock = useCallback(
    async (user: AdminUserListItemDto): Promise<boolean> => {
      setIsToggling(true);
      try {
        await adminUserService.updateBlockStatus(user.id, !user.isBlocked);

        setUsers((prev) =>
          status === "all"
            ? prev.map((u) =>
                u.id === user.id ? { ...u, isBlocked: !u.isBlocked } : u,
              )
            : prev.filter((u) => u.id !== user.id),
        );

        toast.success(user.isBlocked ? "User unblocked" : "User blocked");
        return true;
      } catch {
        toast.error("Failed to update the user's status.");
        return false;
      } finally {
        setIsToggling(false);
      }
    },
    [status],
  );

  return {
    users,
    hasMore,
    isLoading,
    isRefreshing: isLoading && users.length > 0,
    isLoadingMore,
    isToggling,
    loadMore,
    toggleBlock,
  };
}