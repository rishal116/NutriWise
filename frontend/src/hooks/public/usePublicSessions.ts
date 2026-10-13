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
import { getErrorMessage } from "@/utils/getErrorMessage";
import { PUBLIC_SESSION_LIMIT } from "@/constants/public/session.constants";

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
  const [sortBy, setSortBy] = useState<PublicSessionSortOption>("upcoming");

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
    paginationErrorRef.current = false;
    cursorRef.current = undefined;
    hasMoreRef.current = true;

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
        if (requestId === requestIdRef.current) {
          fetchingRef.current = false;

          if (!cancelled) {
            setInitialLoading(false);
          }
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

      setSessions((previous) => {
        const existingIds = new Set(
          previous.map((session) => session.sessionId),
        );

        const newSessions = data.items.filter(
          (session) => !existingIds.has(session.sessionId),
        );

        return [...previous, ...newSessions];
      });

      cursorRef.current = data.nextCursor ?? undefined;
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
        if (entry.isIntersecting) {
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

  const submitSearch = (value: string) => {
    setSearch(value.trim());
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setType(undefined);
    setPricingType(undefined);
    setSortBy("upcoming");
  };

  const retryInitialLoad = () => {
    setRetryKey((previous) => previous + 1);
  };

  const retryPagination = () => {
    paginationErrorRef.current = false;
    setPaginationError(null);
    void loadMore();
  };

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
