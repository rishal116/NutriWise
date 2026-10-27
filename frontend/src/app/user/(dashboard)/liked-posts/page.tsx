"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Heart, LoaderCircle, MessageCircle, RefreshCw } from "lucide-react";

import { userLikedPostService } from "@/services/user/user-liked-post.service";
import type { UserLikedPostResponseDTO } from "@/dtos/user/post/user-liked-post-response.dto";
import type { PostListQueryDTO } from "@/dtos/user/post/post-list-query.dto";

import { LikedPostCard } from "@/components/user/liked-posts/LikedPostCard";

const PAGE_SIZE = 12;

export default function LikedPostsPage() {
  const [posts, setPosts] = useState<UserLikedPostResponseDTO[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef(0);

  const fetchPosts = useCallback(async (loadMore = false) => {
    const requestId = ++requestIdRef.current;

    if (loadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setError(null);
    }

    try {
      const query: PostListQueryDTO = {
        limit: PAGE_SIZE,
        sortBy: "latest",
        ...(loadMore && nextCursor ? { cursor: nextCursor } : {}),
      };

      const response = await userLikedPostService.browseMyLikedPosts(query);

      if (requestId !== requestIdRef.current) return;

      if (!response.success || !response.data) {
        throw new Error(response.message || "Unable to load liked posts.");
      }

      const { items, nextCursor: cursor, hasMore: more } = response.data;

      setPosts((current) => {
        if (!loadMore) return items;

        const existingIds = new Set(current.map((post) => post._id));
        return [
          ...current,
          ...items.filter((post) => !existingIds.has(post._id)),
        ];
      });

      setNextCursor(cursor);
      setHasMore(more);
    } catch {
      if (requestId === requestIdRef.current) {
        setError("Unable to load liked posts. Please try again.");
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    }
  }, [nextCursor]);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore && nextCursor) {
      void fetchPosts(true);
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <div className="flex min-h-64 items-center justify-center">
          <LoaderCircle className="h-7 w-7 animate-spin text-emerald-600" />
          <span className="ml-3 text-sm text-gray-500">
            Loading liked posts...
          </span>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50">
            <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Liked Posts
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Posts you have liked from the community.
            </p>
          </div>
        </div>
      </header>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => void fetchPosts()}
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-800"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      )}

      {!error && posts.length === 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <Heart className="h-7 w-7 text-gray-400" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No liked posts yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
            When you like posts from the community, you can find them here.
          </p>
        </section>
      ) : (
        <div className="space-y-5">
          {posts.map((post) => (
            <LikedPostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {hasMore && posts.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoadingMore || !nextCursor}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingMore ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load more"
            )}
          </button>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="py-8 text-center text-sm text-gray-400">
          You&apos;re all caught up.
        </p>
      )}
    </main>
  );
}