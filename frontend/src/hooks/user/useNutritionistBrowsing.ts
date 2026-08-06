"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { nutritionistBrowsingService } from "@/services/user/nutriBrowsing.service";
import { useDebounce } from "@/hooks/common/debounce.hooks";
import { NutritionistCardDTO } from "@/dtos/user/nutri-browsing/nutri-card.dto";
import { NutritionistStatsDTO } from "@/dtos/user/nutri-browsing/nutri-stats.dto";
import {
  CoachLevel,
  Language,
  NutritionistSortBy,
  Specialization,
} from "@/types/nutritionist.types";
import { Gender } from "@/enums/user/user.enum";

export interface NutritionistFilterState {
  specialization?: Specialization;
  languages?: Language[];
  coachLevel?: CoachLevel;
  gender?: Gender;
  minRating?: number;
  availableOnly?: boolean;
  sortBy?: NutritionistSortBy;
}

const PAGE_LIMIT = 8;

export function useNutritionistBrowsing() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<NutritionistFilterState>({});
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [nutritionists, setNutritionists] = useState<NutritionistCardDTO[]>([]);
  const [stats, setStats] = useState<NutritionistStatsDTO | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filtersRef = useRef(filters);
  const searchRef = useRef(debouncedSearch);
  const cursorRef = useRef<string | undefined>(undefined);
  const hasMoreRef = useRef(true);
  const fetchingMoreRef = useRef(false);
  const resettingRef = useRef(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    searchRef.current = debouncedSearch;
  }, [debouncedSearch]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  // Sync specialization with URL param
  useEffect(() => {
    const specializationUrl = searchParams.get("specialization") as Specialization | null;
    setFilters((prev) => ({
      ...prev,
      specialization: specializationUrl || undefined,
    }));
  }, [searchParams]);

  // Fetch browsing statistics on mount
  const fetchStats = useCallback(async () => {
    try {
      const data = await nutritionistBrowsingService.getNutritionistStats();
      setStats(data);
    } catch {
      setStats(null);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Initial fetch and fetch on filter/search change
  const resetAndFetch = useCallback(async () => {
    resettingRef.current = true;
    cursorRef.current = undefined;
    setHasMore(true);
    hasMoreRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await nutritionistBrowsingService.browseNutritionists({
        ...filtersRef.current,
        search: searchRef.current || undefined,
        limit: PAGE_LIMIT,
      });

      const { items, nextCursor, hasMore: moreAvailable } = response.data;
      setNutritionists(items);
      cursorRef.current = nextCursor ?? undefined;
      setHasMore(moreAvailable);
      hasMoreRef.current = moreAvailable;
    } catch {
      setNutritionists([]);
      setHasMore(false);
      setError("Failed to load nutritionists. Please try again.");
    } finally {
      setLoading(false);
      resettingRef.current = false;
    }
  }, []);

  useEffect(() => {
    resetAndFetch();
  }, [filters, debouncedSearch, resetAndFetch]);

  // Infinite scroll fetch next page
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
      const response = await nutritionistBrowsingService.browseNutritionists({
        ...filtersRef.current,
        search: searchRef.current || undefined,
        cursor: cursorRef.current,
        limit: PAGE_LIMIT,
      });

      const { items, nextCursor, hasMore: moreAvailable } = response.data;
      setNutritionists((prev) => [...prev, ...items]);
      cursorRef.current = nextCursor ?? undefined;
      setHasMore(moreAvailable);
      hasMoreRef.current = moreAvailable;
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
      fetchingMoreRef.current = false;
    }
  }, []);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchMore();
        }
      },
      { rootMargin: "200px" },
    );
    observerRef.current.observe(node);

    return () => observerRef.current?.disconnect();
  }, [fetchMore, nutritionists.length]);

  const handleSelectSpecialization = useCallback(
    (val: Specialization | "") => {
      setFilters((prev) => ({
        ...prev,
        specialization: val || undefined,
      }));

      const newParams = new URLSearchParams(searchParams.toString());
      if (val) {
        newParams.set("specialization", val);
      } else {
        newParams.delete("specialization");
      }
      const queryStr = newParams.toString();
      router.push(queryStr ? `/coaching?${queryStr}` : "/coaching", { scroll: false });
    },
    [router, searchParams],
  );

  const clearAllFilters = useCallback(() => {
    setSearch("");
    setFilters({});
    router.push("/coaching", { scroll: false });
  }, [router]);

  const activeFilterCount =
    (search ? 1 : 0) +
    (filters.specialization ? 1 : 0) +
    (filters.languages?.length ? filters.languages.length : 0) +
    (filters.coachLevel ? 1 : 0) +
    (filters.gender ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.availableOnly ? 1 : 0) +
    (filters.sortBy ? 1 : 0);

  return {
    filters,
    setFilters,
    search,
    setSearch,
    nutritionists,
    stats,
    loading,
    loadingMore,
    hasMore,
    error,
    sentinelRef,
    handleSelectSpecialization,
    clearAllFilters,
    activeFilterCount,
  };
}
