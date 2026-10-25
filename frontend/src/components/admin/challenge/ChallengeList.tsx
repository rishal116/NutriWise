"use client";

import { useCallback, useEffect, useState } from "react";

import { adminChallengeService } from "@/services/admin/admin-challenge.service";

import type { AdminChallengeCardDTO } from "@/dtos/admin/challenge/admin-challenge-card.dto";
import type { AdminChallengeListQueryDTO } from "@/dtos/admin/challenge/admin-challenge-list-query.dto";

import { getErrorMessage } from "@/utils/getErrorMessage";

import { ChallengeListHeader } from "./ChallengeListHeader";
import { ChallengeFilters } from "./ChallengeFilters";
import { ChallengeCard } from "./ChallengeCard";
import { ChallengeListSkeleton } from "./ChallengeListSkeleton";
import { ChallengeListEmpty } from "./ChallengeListEmpty";

const DEFAULT_QUERY: AdminChallengeListQueryDTO = {
  limit: 12,
  sortBy: "newest",
};

export default function ChallengeList() {
  const [challenges, setChallenges] = useState<AdminChallengeCardDTO[]>([]);
  const [query, setQuery] = useState<AdminChallengeListQueryDTO>(DEFAULT_QUERY);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenges = useCallback(
    async (cursor?: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await adminChallengeService.listChallenges({
          ...query,
          cursor,
        });

        if (!response.data) {
          throw new Error("Unable to fetch challenges.");
        }

        const data = response.data;

        setChallenges((previous) =>
          cursor ? [...previous, ...data.items] : data.items,
        );
        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [query],
  );

  useEffect(() => {
    void fetchChallenges();
  }, [fetchChallenges]);

  const updateQuery = <K extends keyof AdminChallengeListQueryDTO>(
    field: K,
    value: AdminChallengeListQueryDTO[K],
  ) => {
    setQuery((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSearchChange = (value: string) => {
    updateQuery("search", value.trim() || undefined);
  };

  const handleCategoryChange = (value: string) => {
    updateQuery(
      "category",
      value === "all"
        ? undefined
        : (value as AdminChallengeListQueryDTO["category"]),
    );
  };

  const handleDifficultyChange = (value: string) => {
    updateQuery(
      "difficulty",
      value === "all"
        ? undefined
        : (value as AdminChallengeListQueryDTO["difficulty"]),
    );
  };

  const handleAccessTypeChange = (value: string) => {
    updateQuery(
      "accessType",
      value === "all"
        ? undefined
        : (value as AdminChallengeListQueryDTO["accessType"]),
    );
  };

  const handleStatusChange = (value: string) => {
    updateQuery(
      "status",
      value === "all"
        ? undefined
        : (value as AdminChallengeListQueryDTO["status"]),
    );
  };

  const handleSortChange = (value: string) => {
    updateQuery(
      "sortBy",
      value === "all"
        ? undefined
        : (value as AdminChallengeListQueryDTO["sortBy"]),
    );
  };

  const handleClearFilters = () => {
    setQuery(DEFAULT_QUERY);
  };

  const handleLoadMore = () => {
    if (!nextCursor || loading || !hasMore) {
      return;
    }

    void fetchChallenges(nextCursor);
  };

  const isFiltered = Boolean(
    query.search ||
    query.category ||
    query.difficulty ||
    query.accessType ||
    query.status ||
    query.sortBy !== "newest",
  );

  return (
    <div className="space-y-6">
      <ChallengeListHeader challengeCount={challenges.length} />

      <ChallengeFilters
        query={query}
        isFiltered={isFiltered}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onDifficultyChange={handleDifficultyChange}
        onAccessTypeChange={handleAccessTypeChange}
        onStatusChange={handleStatusChange}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
      />

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50/60 px-4 py-3 text-xs text-rose-800"
        >
          {error}
          <button
            type="button"
            onClick={() => void fetchChallenges()}
            className="ml-2 font-semibold underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )}

      {loading && challenges.length === 0 && <ChallengeListSkeleton />}

      {!loading && !error && challenges.length === 0 && (
        <ChallengeListEmpty onClearFilters={handleClearFilters} />
      )}

      {challenges.length > 0 && (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loading}
                className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}

          {loading && challenges.length > 0 && (
            <p className="text-center text-sm text-slate-500">
              Loading challenges...
            </p>
          )}
        </>
      )}
    </div>
  );
}
