"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  RotateCcw,
  Sparkles,
  AlertCircle,
  ArrowUpRight,
  Crown,
  Clock,
  Gauge,
  Apple,
  Droplets,
  Activity,
  Moon,
  Brain,
  HeartPulse,
  Scale,
  Flame,
} from "lucide-react";

import { adminChallengeService } from "@/services/admin/adminChallenge.service";

import { AdminChallengeCardDTO } from "@/dtos/admin/challenge/admin-challenge-card.dto";
import { AdminChallengeListQueryDTO } from "@/dtos/admin/challenge/admin-challenge-list-query.dto";

import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import { getErrorMessage } from "@/utils/getErrorMessage";

interface ChallengeListProps {
  initialData: InfiniteScrollResponseDTO<AdminChallengeCardDTO>;
}

const selectClassName =
  "w-full rounded-lg border border-slate-200/80 bg-slate-50/50 px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500";

export default function ChallengeList({ initialData }: ChallengeListProps) {
  const [challenges, setChallenges] = useState<AdminChallengeCardDTO[]>(
    initialData.items,
  );

  const [query, setQuery] = useState<AdminChallengeListQueryDTO>({
    limit: 12,
    sortBy: "newest",
  });

  const [nextCursor, setNextCursor] = useState<string | null>(
    initialData.nextCursor,
  );

  const [hasMore, setHasMore] = useState<boolean>(initialData.hasMore);
  const [loading, setLoading] = useState(false);
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

        const data = response.data;

        if (!cursor) {
          setChallenges(data.items);
        } else {
          setChallenges((prev) => [...prev, ...data.items]);
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

    fetchChallenges();
  }, [fetchChallenges, query]);

  const handleLoadMore = () => {
    if (!nextCursor || loading) {
      return;
    }

    fetchChallenges(nextCursor);
  };

  const handleSearchChange = (value: string) => {
    setQuery((prev) => ({
      ...prev,
      search: value.trim() || undefined,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setQuery((prev) => ({
      ...prev,
      category:
        value === "all"
          ? undefined
          : (value as AdminChallengeListQueryDTO["category"]),
    }));
  };

  const handleDifficultyChange = (value: string) => {
    setQuery((prev) => ({
      ...prev,
      difficulty:
        value === "all"
          ? undefined
          : (value as AdminChallengeListQueryDTO["difficulty"]),
    }));
  };

  const handleAccessTypeChange = (value: string) => {
    setQuery((prev) => ({
      ...prev,
      accessType:
        value === "all"
          ? undefined
          : (value as AdminChallengeListQueryDTO["accessType"]),
    }));
  };

  const handleStatusChange = (value: string) => {
    setQuery((prev) => ({
      ...prev,
      status:
        value === "all"
          ? undefined
          : (value as AdminChallengeListQueryDTO["status"]),
    }));
  };

  const handleSortChange = (value: string) => {
    setQuery((prev) => ({
      ...prev,
      sortBy:
        value === "all"
          ? undefined
          : (value as AdminChallengeListQueryDTO["sortBy"]),
    }));
  };

  const handleClearFilters = () => {
    setQuery({
      limit: 12,
      sortBy: "newest",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";

      case "draft":
        return "bg-amber-50 text-amber-700 border-amber-200/60";

      case "archived":
        return "bg-slate-100 text-slate-600 border-slate-200/60";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200/60";
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/50";

      case "intermediate":
        return "bg-amber-50 text-amber-700 border-amber-200/50";

      case "advanced":
        return "bg-rose-50 text-rose-700 border-rose-200/50";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200/50";
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "nutrition":
        return <Apple className="h-5 w-5 text-emerald-600" />;
      case "hydration":
        return <Droplets className="h-5 w-5 text-emerald-600" />;
      case "fitness":
        return <Activity className="h-5 w-5 text-emerald-600" />;
      case "sleep":
        return <Moon className="h-5 w-5 text-emerald-600" />;
      case "mindfulness":
        return <Brain className="h-5 w-5 text-emerald-600" />;
      case "weight_management":
        return <Scale className="h-5 w-5 text-emerald-600" />;
      case "healthy_habits":
        return <HeartPulse className="h-5 w-5 text-emerald-600" />;
      default:
        return <Flame className="h-5 w-5 text-emerald-600" />;
    }
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
    <div className="min-h-screen bg-slate-50/60 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Challenges
              </h1>

              {challenges.length > 0 && (
                <span className="rounded-md border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  {challenges.length}
                </span>
              )}
            </div>

            <p className="mt-0.5 text-xs text-slate-500">
              Create, manage, and organize health challenges.
            </p>
          </div>

          <Link
            href="/admin/challenges/create"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Challenge</span>
          </Link>
        </div>

        {/* Search & Filters Toolbar */}
        <div className="mb-6 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-2">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search challenges..."
                value={query.search ?? ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-lg border border-slate-200/80 bg-slate-50/50 py-1.5 pl-8 pr-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <select
              value={query.category ?? "all"}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={selectClassName}
            >
              <option value="all">All Categories</option>
              <option value="nutrition">Nutrition</option>
              <option value="hydration">Hydration</option>
              <option value="fitness">Fitness</option>
              <option value="sleep">Sleep</option>
              <option value="mindfulness">Mindfulness</option>
              <option value="healthy_habits">Healthy Habits</option>
              <option value="wellness">Wellness</option>
              <option value="weight_management">Weight Management</option>
            </select>

            <select
              value={query.difficulty ?? "all"}
              onChange={(e) => handleDifficultyChange(e.target.value)}
              className={selectClassName}
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              value={query.accessType ?? "all"}
              onChange={(e) => handleAccessTypeChange(e.target.value)}
              className={selectClassName}
            >
              <option value="all">All Access</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>

            <select
              value={query.status ?? "all"}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={selectClassName}
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Sort & Actions Footer */}
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-0.5 pt-2">
            <div className="flex items-center gap-1.5">
              <label
                htmlFor="sort-select"
                className="text-[11px] font-medium text-slate-400"
              >
                Sort by:
              </label>

              <select
                id="sort-select"
                value={query.sortBy ?? "newest"}
                onChange={(e) => handleSortChange(e.target.value)}
                className="rounded border-none bg-transparent py-0 text-[11px] font-semibold text-slate-700 focus:outline-none focus:ring-0"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {isFiltered && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-800"
              >
                <RotateCcw className="h-3 w-3" />
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 flex items-center gap-2.5 rounded-lg border border-rose-200 bg-rose-50/60 p-3 text-xs text-rose-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Skeleton Loading State */}
        {loading && challenges.length === 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm"
              >
                <div className="h-28 w-full rounded-lg bg-slate-100" />
                <div className="mt-3.5 h-4 w-3/4 rounded bg-slate-100" />
                <div className="mt-2 h-3 w-full rounded bg-slate-100" />
                <div className="mt-1 h-3 w-2/3 rounded bg-slate-100" />

                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                  <div className="h-7 rounded bg-slate-100" />
                  <div className="h-7 rounded bg-slate-100" />
                  <div className="h-7 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && challenges.length === 0 && (
          <div className="my-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center sm:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
              <Sparkles className="h-5 w-5" />
            </div>

            <h3 className="mt-3.5 text-sm font-semibold text-slate-900">
              No challenges found
            </h3>

            <p className="mt-1 max-w-xs text-xs text-slate-500">
              Try adjusting your filters or create a new challenge.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleClearFilters}
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Clear Filters
              </button>

              <Link
                href="/admin/challenges/create"
                className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
              >
                Create Challenge
              </Link>
            </div>
          </div>
        )}

        {/* Challenge Cards Grid */}
        {challenges.length > 0 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {challenges.map((challenge) => (
                <Link
                  key={challenge.id}
                  href={`/admin/challenges/${challenge.id}`}
                  className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md"
                >
                  <div>
                    {/* Card Thumbnail Top Section */}
                    <div className="relative flex h-28 w-full flex-col justify-between overflow-hidden rounded-lg border border-slate-100 bg-slate-50/80 p-2.5">
                      <div className="z-10 flex items-center justify-between">
                        {challenge.accessType === "premium" ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-amber-200/70 bg-amber-50/90 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                            <Crown className="h-3 w-3 text-amber-600" />
                            Premium
                          </span>
                        ) : (
                          <span className="inline-flex rounded-md border border-slate-200/70 bg-white/90 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                            Free
                          </span>
                        )}

                        <span
                          className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium capitalize ${getStatusBadge(
                            challenge.status,
                          )}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {challenge.status}
                        </span>
                      </div>

                      {/* Icon Placeholder Background Accent */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-15">
                        {getCategoryIcon(challenge.category)}
                      </div>

                      <div className="z-10 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200/50 bg-white/95 px-2 py-0.5 text-[11px] font-medium capitalize text-slate-700 shadow-sm">
                          {getCategoryIcon(challenge.category)}
                          {challenge.category?.replaceAll("_", " ") ??
                            "General"}
                        </span>
                      </div>
                    </div>

                    {/* Middle Info */}
                    <div className="mt-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-emerald-700">
                          {challenge.title}
                        </h2>

                        <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-600" />
                      </div>

                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                        {challenge.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Metadata */}
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                      {/* Duration */}
                      <div className="rounded-md border border-slate-100 bg-slate-50 p-1.5">
                        <div className="flex items-center justify-center text-slate-400">
                          <Clock className="h-3 w-3" />
                        </div>

                        <p className="mt-0.5 text-[11px] font-medium text-slate-700">
                          {challenge.durationDays} Days
                        </p>
                      </div>

                      {/* Difficulty */}
                      <div className="rounded-md border border-slate-100 bg-slate-50 p-1.5">
                        <div className="flex items-center justify-center text-slate-400">
                          <Gauge className="h-3 w-3" />
                        </div>

                        <p
                          className={`mt-0.5 inline-block text-[10px] font-semibold capitalize ${getDifficultyBadge(
                            challenge.difficulty,
                          )}`}
                        >
                          {challenge.difficulty}
                        </p>
                      </div>

                      {/* Access Type */}
                      <div className="rounded-md border border-slate-100 bg-slate-50 p-1.5">
                        <div className="flex items-center justify-center text-slate-400">
                          <Crown className="h-3 w-3" />
                        </div>

                        <p className="mt-0.5 text-[11px] font-medium capitalize text-slate-700">
                          {challenge.accessType}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 flex justify-center">
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
    </div>
  );
}
