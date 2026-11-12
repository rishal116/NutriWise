
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { nutritionistPlanService } from "@/services/nutritionist/nutri-plan.service";

import type { NutritionistPlanListItemDto } from "@/dtos/nutritionist/plan/nutritionist-plan-list-item.dto";
import type { Specialization } from "@/types/nutritionist.types";
import type { PlanSort } from "@/types/plan.types";

import {
  PLAN_PAGE_LIMIT,
  type PlanTab,
} from "@/constants/nutritionist/plan/plan.constants";

export default function useMyPlans() {
  const [plans, setPlans] = useState<NutritionistPlanListItemDto[]>([]);

  const [activeTab, setActiveTab] = useState<PlanTab>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [specialization, setSpecialization] = useState<Specialization | "">("");
  const [sort, setSort] = useState<PlanSort>("newest");
  const [reloadKey, setReloadKey] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(false);
  const loadingRef = useRef(true);
  const loadingMoreRef = useRef(false);
  const requestVersionRef = useRef(0);

  const query = useMemo(
    () => ({
      limit: PLAN_PAGE_LIMIT,
      search: debouncedSearch || undefined,
      specialization: specialization || undefined,
      sort,
      status: activeTab === "all" ? undefined : activeTab,
    }),
    [activeTab, debouncedSearch, specialization, sort],
  );

  // Debounce search input.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  // Fetch the first page whenever filters change.
  useEffect(() => {
    const version = ++requestVersionRef.current;

    const fetchFirstPage = async () => {
      loadingRef.current = true;
      loadingMoreRef.current = false;
      cursorRef.current = null;
      hasMoreRef.current = false;

      setPlans([]);
      setLoading(true);
      setLoadingMore(false);
      setHasMore(false);
      setError(null);

      try {
        const response = await nutritionistPlanService.getPlans(query);

        if (version !== requestVersionRef.current) return;

        setPlans(response.items);
        cursorRef.current = response.nextCursor;
        hasMoreRef.current = response.hasMore;
        setHasMore(response.hasMore);
      } catch (err) {
        if (version !== requestVersionRef.current) return;

        console.error("Failed to fetch nutritionist plans:", err);
        setError("Unable to load your plans. Please try again.");
      } finally {
        if (version === requestVersionRef.current) {
          loadingRef.current = false;
          setLoading(false);
        }
      }
    };

    void fetchFirstPage();

    return () => {
      // Invalidate requests when filters change or the component unmounts.
      requestVersionRef.current += 1;
    };
  }, [query, reloadKey]);

  const reload = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  // Fetch the next page.
  const loadMore = useCallback(async () => {
    const cursor = cursorRef.current;

    if (
      loadingRef.current ||
      loadingMoreRef.current ||
      !hasMoreRef.current ||
      !cursor
    ) {
      return;
    }

    const version = requestVersionRef.current;

    loadingMoreRef.current = true;
    setLoadingMore(true);
    setError(null);

    try {
      const response = await nutritionistPlanService.getPlans({
        ...query,
        cursor,
      });

      if (version !== requestVersionRef.current) return;

      setPlans((previous) => [...previous, ...response.items]);

      cursorRef.current = response.nextCursor;
      hasMoreRef.current = response.hasMore;
      setHasMore(response.hasMore);
    } catch (err) {
      if (version === requestVersionRef.current) {
        console.error("Failed to load more nutritionist plans:", err);
        setError("Unable to load more plans. Please try again.");
      }
    } finally {
      if (version === requestVersionRef.current) {
        loadingMoreRef.current = false;
        setLoadingMore(false);
      }
    }
  }, [query]);

  return {
    plans,
    activeTab,
    search,
    specialization,
    sort,
    loading,
    loadingMore,
    hasMore,
    error,
    setActiveTab,
    setSearch,
    setSpecialization,
    setSort,
    loadMore,
    reload,
  };
}
