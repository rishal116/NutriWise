"use client";

import { useEffect, useRef } from "react";

/**
 * Calls `onIntersect` whenever the returned sentinel ref is near the viewport.
 * The observer is recreated when `onIntersect` changes, so a sentinel that is
 * still visible after a page loads triggers the next fetch automatically.
 */
export function useInfiniteScroll(onIntersect: () => void, enabled: boolean) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onIntersect();
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [onIntersect, enabled]);

  return sentinelRef;
}