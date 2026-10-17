"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type {
  GetPublicSessionsQueryDTO,
  PublicSessionSortOption,
} from "@/dtos/public/session/public-session-list-query.dto";
import type { PublicSessionListItemResponseDTO } from "@/dtos/public/session/public-session-list-response.dto";

import {
  SESSION_PRICING_TYPES,
  SESSION_TYPES,
} from "@/types/public/session/session.types";
import type {
  SessionPricingType,
  SessionType,
} from "@/types/public/session/session.types";

import { publicSessionService } from "@/services/public/publicSession.service";
import { PUBLIC_SESSION_LIMIT } from "@/constants/public/session.constants";
import { getErrorMessage } from "@/utils/getErrorMessage";

export function usePublicSessions() {
  const [sessions, setSessions] = useState<PublicSessionListItemResponseDTO[]>(
    [],
  );

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState<SessionType | undefined>();
  const [pricingType, setPricingType] = useState<
    SessionPricingType | undefined
  >();
  const [sortBy, setSortBy] = useState<PublicSessionSortOption>("all");

  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialError, setInitialError] = useState<string | null>(null);
  const [paginationError, setPaginationError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const fetchingRef = useRef(false);
  const cursorRef = useRef<string | undefined>(undefined);
  const hasMoreRef = useRef(true);
  const requestIdRef = useRef(0);
  const paginationErrorRef = useRef(false);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    let cancelled = false;

    fetchingRef.current = true;
    cursorRef.current = undefined;
    hasMoreRef.current = true;
    paginationErrorRef.current = false;

    setSessions([]);
    setHasMore(true);
    setInitialLoading(true);
    setLoadingMore(false);
    setInitialError(null);
    setPaginationError(null);

    const fetchSessions = async () => {
      try {
        const query: GetPublicSessionsQueryDTO = {
          limit: PUBLIC_SESSION_LIMIT,
          search: search || undefined,
          type,
          pricingType,
          sortBy,
        };

        const response = await publicSessionService.getSessions(query);

        if (cancelled || requestId !== requestIdRef.current) {
          return;
        }

        const data = response.data;

        if (!data) {
          throw new Error("Session data was not returned by the server.");
        }

        setSessions(data.items);
        setHasMore(data.hasMore);

        hasMoreRef.current = data.hasMore;
        cursorRef.current = data.nextCursor ?? undefined;
      } catch (error) {
        if (cancelled || requestId !== requestIdRef.current) {
          return;
        }

        setInitialError(getErrorMessage(error));
      } finally {
        if (!cancelled && requestId === requestIdRef.current) {
          fetchingRef.current = false;
          setInitialLoading(false);
        }
      }
    };

    void fetchSessions();

    return () => {
      cancelled = true;
    };
  }, [search, type, pricingType, sortBy, retryKey]);

  const loadMore = useCallback(async () => {
    const cursor = cursorRef.current;
    const requestId = requestIdRef.current;

    if (
      fetchingRef.current ||
      paginationErrorRef.current ||
      !hasMoreRef.current ||
      !cursor
    ) {
      return;
    }

    fetchingRef.current = true;
    setLoadingMore(true);
    setPaginationError(null);

    try {
      const query: GetPublicSessionsQueryDTO = {
        limit: PUBLIC_SESSION_LIMIT,
        cursor,
        search: search || undefined,
        type,
        pricingType,
        sortBy,
      };

      const response = await publicSessionService.getSessions(query);

      if (requestId !== requestIdRef.current) {
        return;
      }

      const data = response.data;

      if (!data) {
        throw new Error("Session data was not returned by the server.");
      }

      const nextCursor = data.nextCursor ?? undefined;

      if (data.hasMore && (!nextCursor || nextCursor === cursor)) {
        paginationErrorRef.current = true;
        setPaginationError(
          "Unable to continue loading sessions. Please try again later.",
        );
        return;
      }

      setSessions((previous) => {
        const existingIds = new Set(
          previous.map((session) => session.sessionId),
        );

        const newSessions = data.items.filter((session) => {
          if (existingIds.has(session.sessionId)) {
            return false;
          }

          existingIds.add(session.sessionId);
          return true;
        });

        return [...previous, ...newSessions];
      });

      cursorRef.current = nextCursor;
      hasMoreRef.current = data.hasMore;
      setHasMore(data.hasMore);
    } catch (error) {
      if (requestId === requestIdRef.current) {
        paginationErrorRef.current = true;
        setPaginationError(getErrorMessage(error));
      }
    } finally {
      if (requestId === requestIdRef.current) {
        fetchingRef.current = false;
        setLoadingMore(false);
      }
    }
  }, [search, type, pricingType, sortBy]);

  useEffect(() => {
    const element = observerRef.current;

    if (
      !element ||
      !hasMore ||
      initialLoading ||
      loadingMore ||
      initialError ||
      paginationError ||
      sessions.length === 0
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void loadMore();
        }
      },
      {
        rootMargin: "200px 0px",
        threshold: 0,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [
    loadMore,
    hasMore,
    initialLoading,
    loadingMore,
    initialError,
    paginationError,
    sessions.length,
  ]);

  const submitSearch = useCallback((value: string) => {
    setSearch(value.trim());
  }, []);

  const clearFilters = useCallback(() => {
    setSearchInput("");
    setSearch("");
    setType(undefined);
    setPricingType(undefined);
    setSortBy("all");
  }, []);

  const retryInitialLoad = useCallback(() => {
    setRetryKey((previous) => previous + 1);
  }, []);

  const retryPagination = useCallback(() => {
    paginationErrorRef.current = false;
    setPaginationError(null);
    void loadMore();
  }, [loadMore]);

  return {
    sessions,
    searchInput,
    setSearchInput,
    submitSearch,
    type,
    setType,
    pricingType,
    setPricingType,
    sortBy,
    setSortBy,
    hasMore,
    initialLoading,
    loadingMore,
    initialError,
    paginationError,
    observerRef,
    loadMore,
    clearFilters,
    retryInitialLoad,
    retryPagination,
    hasActiveFilters: Boolean(search || type || pricingType),
    sessionTypes: SESSION_TYPES,
    pricingTypes: SESSION_PRICING_TYPES,
  };
}
