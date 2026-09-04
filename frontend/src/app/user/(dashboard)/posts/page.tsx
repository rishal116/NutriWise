"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownUp, Plus, Search, X } from "lucide-react";

import { userPostService } from "@/services/user/userPost.service";
import type { PostCardResponseDTO } from "@/dtos/user/post/post-response.dto";
import { PostSortOption } from "@/dtos/user/post/post-list-query.dto";
import { useCursorInfiniteScroll } from "@/hooks/user/useCursorInfiniteScroll";
import { PostCard } from "@/components/user/posts/PostCard";
import { PostCardSkeletonGrid } from "@/components/user/posts/PostCardSkeleton";
import { PostsEmptyState } from "@/components/user/posts/PostsEmptyState";
import { PostsErrorState } from "@/components/user/posts/PostsErrorsState";
import { DeletePostModal } from "@/components/user/posts/DeletePostModel";

const PAGE_SIZE = 8;

const SORT_OPTIONS: { value: PostSortOption; label: string }[] = [
  { value: PostSortOption.LATEST, label: "Latest" },
  { value: PostSortOption.OLDEST, label: "Oldest" },
  { value: PostSortOption.MOST_LIKED, label: "Most liked" },
  { value: PostSortOption.MOST_COMMENTED, label: "Most commented" },
  { value: PostSortOption.MOST_BOOKMARKED, label: "Most bookmarked" },
];

export default function UserPostsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<PostSortOption>(PostSortOption.LATEST);
  const [postPendingDelete, setPostPendingDelete] =
    useState<PostCardResponseDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPage = useCallback(
    async (cursor?: string | null) => {
      const response = await userPostService.browseMyPosts({
        limit: PAGE_SIZE,
        cursor: cursor ?? undefined,
        sortBy,
        // Drop this line if the backend doesn't yet support `search`.
        ...(search ? { search } : {}),
      });

      return {
        items: response.data.items,
        nextCursor: response.data.nextCursor,
        hasMore: response.data.hasMore,
      };
    },
    [search, sortBy],
  );

  const {
    items,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    sentinelRef,
    retry,
    removeItem,
  } = useCursorInfiniteScroll<PostCardResponseDTO>({
    fetchPage,
    deps: [search, sortBy],
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
  };

  const confirmDelete = async () => {
    if (!postPendingDelete) return;
    setIsDeleting(true);
    try {
      await userPostService.deletePost(postPendingDelete._id);
      removeItem((p) => p._id === postPendingDelete._id);
      setPostPendingDelete(null);
    } catch {
      // Keep the modal open so the user can see the failure and retry.
    } finally {
      setIsDeleting(false);
    }
  };

  const showInitialSkeleton = isLoading && items.length === 0;
  const showInitialError = !isLoading && error && items.length === 0;
  const showEmptyState = !isLoading && !error && items.length === 0;

  const feed = useMemo(
    () => (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        {items.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onDelete={setPostPendingDelete}
          />
        ))}
      </div>
    ),
    [items],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-emerald-600" />
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              My Posts
            </h1>
          </div>
          <p className="mt-1.5 text-xs font-medium text-slate-500 sm:text-sm">
            Everything you&apos;ve shared, in one place — track engagement and
            manage your posts.
          </p>
        </div>

        <Link
          href="/user/posts/create"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:bg-emerald-800 sm:text-sm"
        >
          <Plus className="h-4 w-4" />
          Create Post
        </Link>
      </div>

      {/* Search + sort */}
      <div className="mx-auto flex w-full max-w-xl flex-col gap-3 sm:flex-row">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search your posts..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-xs font-medium text-slate-700 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 sm:text-sm"
          />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        <div className="relative sm:w-48">
          <ArrowDownUp className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as PostSortOption)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-8 text-xs font-medium text-slate-700 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 sm:text-sm"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {showInitialSkeleton && <PostCardSkeletonGrid count={PAGE_SIZE} />}

      {showInitialError && (
        <div className="mx-auto w-full max-w-xl">
          <PostsErrorState onRetry={retry} />
        </div>
      )}

      {showEmptyState && (
        <div className="mx-auto w-full max-w-xl">
          <PostsEmptyState
            isSearching={Boolean(search)}
            onClearSearch={search ? clearSearch : undefined}
          />
        </div>
      )}

      {!showInitialSkeleton && !showInitialError && items.length > 0 && (
        <>
          {feed}

          <div ref={sentinelRef} className="h-1 w-full" />

          {isLoadingMore && <PostCardSkeletonGrid count={4} />}

          {error && items.length > 0 && (
            <PostsErrorState onRetry={retry} compact />
          )}

          {!hasMore && !isLoadingMore && (
            <p className="py-4 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              You&apos;ve reached the end
            </p>
          )}
        </>
      )}

      <DeletePostModal
        open={Boolean(postPendingDelete)}
        isDeleting={isDeleting}
        onCancel={() => setPostPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}