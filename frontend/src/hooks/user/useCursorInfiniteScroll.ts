"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface PageResult<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

interface UseCursorInfiniteScrollOptions<T> {
  fetchPage: (cursor?: string | null) => Promise<PageResult<T>>;
  /** Re-runs the query from scratch when any of these change (e.g. search term). */
  deps?: unknown[];
}

/**
 * Cursor-paginated list backed by IntersectionObserver.
 * Attach `sentinelRef` to an empty div at the end of the list.
 */
export function useCursorInfiniteScroll<T>({
  fetchPage,
  deps = [],
}: UseCursorInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const fetchPageRef = useRef(fetchPage);
  fetchPageRef.current = fetchPage;

  const load = useCallback(async (nextCursor: string | null, isInitial: boolean) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    if (isInitial) setIsLoading(true);
    else setIsLoadingMore(true);
    setError(null);

    try {
      const result = await fetchPageRef.current(nextCursor);
      setItems((prev) => (isInitial ? result.items : [...prev, ...result.items]));
      setCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load posts"));
    } finally {
      isFetchingRef.current = false;
      if (isInitial) setIsLoading(false);
      else setIsLoadingMore(false);
    }
  }, []);

  // Re-run from scratch whenever deps change (mount included).
  useEffect(() => {
    setItems([]);
    setCursor(null);
    setHasMore(true);
    load(null, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // Observe the sentinel and load more pages as it enters the viewport.
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
          load(cursor, false);
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [cursor, hasMore, isLoading, load]);

  const retry = useCallback(() => {
    if (items.length === 0) {
      load(null, true);
    } else {
      load(cursor, false);
    }
  }, [cursor, items.length, load]);

  const removeItem = useCallback((predicate: (item: T) => boolean) => {
    setItems((prev) => prev.filter((item) => !predicate(item)));
  }, []);

  return {
    items,
    setItems,
    removeItem,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    sentinelRef,
    retry,
  };
}