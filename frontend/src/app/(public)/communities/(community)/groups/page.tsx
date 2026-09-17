"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Loader2, RefreshCw } from "lucide-react";

import { publicGroupService } from "@/services/public/publicGroup.service";

import type { PublicGroupListItemDTO } from "@/dtos/public/group/public-group-list-item.dto";

import type { PublicGroupListQueryDTO } from "@/dtos/public/group/public-group-list-query.dto";

import PublicGroupCard from "@/components/public/group/PublicGroupCard";

import PublicGroupHeader from "@/components/public/group/PublicGroupHeader";

import { getErrorMessage } from "@/utils/getErrorMessage";

const LIMIT = 10;

interface GroupsPageProps {
  preview?: boolean;
}

export default function GroupsPage({
  preview = false,
}: GroupsPageProps) {
  const [groups, setGroups] = useState<PublicGroupListItemDTO[]>([]);

  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(true);

  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchingRef = useRef(false);

  const fetchGroups = useCallback(
    async (cursor?: string) => {
      if (fetchingRef.current) {
        return;
      }

      fetchingRef.current = true;

      try {
        if (cursor) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        setError(null);

        const query: PublicGroupListQueryDTO = {
          limit: LIMIT,
          sortBy: "newest",
          ...(cursor ? { cursor } : {}),
        };

        const response = await publicGroupService.getGroups(query);

        const data = response.data;

        if (cursor) {
          setGroups((previous) => [
            ...previous,
            ...data.items,
          ]);
        } else {
          setGroups(data.items);
        }

        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        fetchingRef.current = false;
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const loadMore = useCallback(() => {
    if (!nextCursor || !hasMore || fetchingRef.current) {
      return;
    }

    fetchGroups(nextCursor);
  }, [fetchGroups, hasMore, nextCursor]);

  useEffect(() => {
    if (preview) {
      return;
    }

    const loader = loaderRef.current;

    if (!loader) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: "200px",
      },
    );

    observer.observe(loader);

    return () => {
      observer.disconnect();
    };
  }, [loadMore, preview]);

  const items = preview ? groups.slice(0, 2) : groups;

  if (loading) {
    return (
      <section className="min-h-screen bg-slate-50 px-4 py-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-56 rounded-lg bg-slate-200" />
            <div className="h-4 w-96 max-w-full rounded bg-slate-200" />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: preview ? 2 : 6 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    <div className="h-44 bg-slate-200" />

                    <div className="space-y-3 p-5">
                      <div className="h-5 w-2/3 rounded bg-slate-200" />
                      <div className="h-4 w-full rounded bg-slate-200" />
                      <div className="h-4 w-4/5 rounded bg-slate-200" />
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error && groups.length === 0) {
    return (
      <section className="min-h-screen bg-slate-50 px-4 py-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-rose-100 bg-white p-8 text-center">
            <h2 className="text-lg font-bold text-slate-900">
              Unable to load groups
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => fetchGroups()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <PublicGroupHeader count={groups.length} />

        {items.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((group) => (
              <PublicGroupCard
                key={group.id}
                group={group}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <h2 className="text-lg font-bold text-slate-900">
              No public groups yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Public groups will appear here when nutritionists
              create them.
            </p>
          </div>
        )}

        {!preview && hasMore && nextCursor && (
          <div
            ref={loaderRef}
            className="flex min-h-24 items-center justify-center py-8"
          >
            {loadingMore ? (
              <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Loading more groups...
              </div>
            ) : (
              <span className="text-sm text-slate-400">
                Scroll to explore more
              </span>
            )}
          </div>
        )}

        {!preview && !hasMore && groups.length > 0 && (
          <p className="mt-10 text-center text-sm font-medium text-slate-400">
            You&apos;ve reached the end
          </p>
        )}
      </div>
    </section>
  );
}