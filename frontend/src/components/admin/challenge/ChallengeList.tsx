"use client";

import { useCallback, useEffect, useState } from "react";

import { adminChallengeService } from "@/services/admin/adminChallenge.service";

import { AdminChallengeCardDTO } from "@/dtos/admin/challenge/admin-challenge-card.dto";
import { AdminChallengeListQueryDTO } from "@/dtos/admin/challenge/admin-challenge-list-query.dto";

import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import { getErrorMessage } from "@/utils/getErrorMessage";

import { ChallengeListHeader } from "./ChallengeListHeader";
import { ChallengeFilters } from "./ChallengeFilters";
import { ChallengeCard } from "./ChallengeCard";
import { ChallengeListSkeleton } from "./ChallengeListSkeleton";
import { ChallengeListEmpty } from "./ChallengeListEmpty";

interface ChallengeListProps {
  initialData: InfiniteScrollResponseDTO<AdminChallengeCardDTO>;
}

export default function ChallengeList({
  initialData,
}: ChallengeListProps) {
  const [challenges, setChallenges] = useState<
    AdminChallengeCardDTO[]
  >(initialData.items);

  const [query, setQuery] =
    useState<AdminChallengeListQueryDTO>({
      limit: 12,
      sortBy: "newest",
    });

  const [nextCursor, setNextCursor] =
    useState<string | null>(
      initialData.nextCursor,
    );

  const [hasMore, setHasMore] = useState<boolean>(
    initialData.hasMore,
  );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const fetchChallenges = useCallback(
    async (cursor?: string) => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await adminChallengeService.listChallenges(
            {
              ...query,
              cursor,
            },
          );

        const data = response.data;

        if (!cursor) {
          setChallenges(data.items);
        } else {
          setChallenges((prev) => [
            ...prev,
            ...data.items,
          ]);
        }

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
    if (
      query.search === undefined &&
      query.category === undefined &&
      query.difficulty === undefined &&
      query.accessType === undefined &&
      query.status === undefined &&
      query.sortBy === "newest"
    ) {
      return;
    }

    void fetchChallenges();
  }, [fetchChallenges, query]);

  const updateQuery = <
    K extends keyof AdminChallengeListQueryDTO,
  >(
    field: K,
    value: AdminChallengeListQueryDTO[K],
  ) => {
    setQuery((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearchChange = (
    value: string,
  ) => {
    updateQuery(
      "search",
      value.trim() || undefined,
    );
  };

  const handleCategoryChange = (
    value: string,
  ) => {
    updateQuery(
      "category",
      value === "all"
        ? undefined
        : (value as AdminChallengeListQueryDTO["category"]),
    );
  };

  const handleDifficultyChange = (
    value: string,
  ) => {
    updateQuery(
      "difficulty",
      value === "all"
        ? undefined
        : (value as AdminChallengeListQueryDTO["difficulty"]),
    );
  };

  const handleAccessTypeChange = (
    value: string,
  ) => {
    updateQuery(
      "accessType",
      value === "all"
        ? undefined
        : (value as AdminChallengeListQueryDTO["accessType"]),
    );
  };

  const handleStatusChange = (
    value: string,
  ) => {
    updateQuery(
      "status",
      value === "all"
        ? undefined
        : (value as AdminChallengeListQueryDTO["status"]),
    );
  };

  const handleSortChange = (
    value: string,
  ) => {
    updateQuery(
      "sortBy",
      value === "all"
        ? undefined
        : (value as AdminChallengeListQueryDTO["sortBy"]),
    );
  };

  const handleClearFilters = () => {
    setQuery({
      limit: 12,
      sortBy: "newest",
    });
  };

  const handleLoadMore = () => {
    if (!nextCursor || loading) {
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
        <div className="rounded-lg border border-rose-200 bg-rose-50/60 px-4 py-3 text-xs text-rose-800">
          {error}
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
                {loading ? "Loading more..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}