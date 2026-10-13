"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Bookmark, Heart, MessageCircle, RefreshCw } from "lucide-react";

import { publicPostService } from "@/services/public/publicPost.service";
import type { PublicPostListItemDTO } from "@/dtos/public/post/public-post-list-item.dto";
import { postLikeService } from "@/services/post/postLike.service";
import { useRouter } from "next/navigation";

interface PostsPageProps {
  preview?: boolean;
}

const PAGE_SIZE = 10;
const PREVIEW_SIZE = 2;

const RELATIVE_UNITS: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] =
  [
    { unit: "year", seconds: 31_536_000 },
    { unit: "month", seconds: 2_592_000 },
    { unit: "week", seconds: 604_800 },
    { unit: "day", seconds: 86_400 },
    { unit: "hour", seconds: 3_600 },
    { unit: "minute", seconds: 60 },
  ];

const relativeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});
const countFormatter = new Intl.NumberFormat("en", { notation: "compact" });

function formatRelativeTime(date: string): string {
  const timestamp = new Date(date).getTime();

  if (Number.isNaN(timestamp)) {
    return "Recently";
  }

  const seconds = Math.floor((timestamp - Date.now()) / 1000);

  for (const { unit, seconds: unitSeconds } of RELATIVE_UNITS) {
    if (Math.abs(seconds) >= unitSeconds) {
      return relativeFormatter.format(Math.round(seconds / unitSeconds), unit);
    }
  }

  return "Just now";
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Unable to load posts. Please try again.";
}

function Avatar({ name, src }: { name: string; src?: string | null }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-sm font-semibold text-emerald-800 sm:size-11">
      {src && !failed ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="44px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden>{name.charAt(0).toUpperCase() || "?"}</span>
      )}
    </div>
  );
}

function PostMedia({
  media,
  authorName,
}: {
  media: NonNullable<PublicPostListItemDTO["media"]>;
  authorName: string;
}) {
  const isVideo = media.type.toLowerCase() === "video";

  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
      {isVideo ? (
        <video
          src={media.url}
          controls
          playsInline
          preload="metadata"
          className="aspect-video max-h-[560px] w-full bg-black object-contain"
        >
          Your browser does not support video playback.
        </video>
      ) : (
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
          <Image
            src={media.url}
            alt={`Post media by ${authorName}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 640px"
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}

const PostCard = memo(function PostCard({
  post,
}: {
  post: PublicPostListItemDTO;
}) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isLiking, setIsLiking] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);
  const router = useRouter();

  const openPostDetails = useCallback(() => {
    router.push(`/communities/posts/${post.postId}`);
  }, [post.postId, router]);

  const handleLike = useCallback(async () => {
    if (isLiking) {
      return;
    }

    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;
    const nextIsLiked = !previousIsLiked;

    setIsLiking(true);
    setLikeError(null);

    // Optimistically update the UI.
    setIsLiked(nextIsLiked);
    setLikeCount((count) => count + (nextIsLiked ? 1 : -1));

    try {
      const response = nextIsLiked
        ? await postLikeService.likePost(post.postId)
        : await postLikeService.unlikePost(post.postId);

      if (!response.success) {
        throw new Error(response.message || "Unable to update like.");
      }

      // Use the authoritative values returned by the backend.
      setIsLiked(response.data.isLiked);
      setLikeCount(response.data.likeCount);
    } catch (error: unknown) {
      // Roll back the optimistic update if the request fails.
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);

      setLikeError(
        error instanceof Error
          ? error.message
          : "Unable to update like. Please try again.",
      );
    } finally {
      setIsLiking(false);
    }
  }, [isLiked, isLiking, likeCount, post.postId]);

  return (
    <article className="flex gap-3 px-4 py-4 transition-colors hover:bg-gray-50/60 sm:gap-4 sm:px-5">
      <Avatar name={post.author.name} src={post.author.profileImage} />

      <div className="min-w-0 flex-1">
        <header className="flex min-w-0 items-baseline gap-x-2">
          <h3 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
            {post.author.name}
          </h3>

          <span className="shrink-0 text-xs text-gray-400 sm:text-sm">
            · {formatRelativeTime(post.createdAt)}
          </span>
        </header>

        {post.content && (
          <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-gray-800 sm:text-[15px]">
            {post.content}
          </p>
        )}

        {post.media && (
          <PostMedia media={post.media} authorName={post.author.name} />
        )}

        <footer className="mt-3 flex items-center gap-6 text-gray-500">
          <button
            type="button"
            onClick={() => void handleLike()}
            disabled={isLiking}
            aria-pressed={isLiked}
            aria-label={`${likeCount} likes`}
            title={likeError ?? (isLiked ? "Unlike post" : "Like post")}
            className={`inline-flex items-center gap-1.5 text-sm transition-colors disabled:cursor-wait disabled:opacity-60 ${
              isLiked ? "text-rose-600" : "text-gray-500 hover:text-rose-600"
            }`}
          >
            <Heart size={18} className={isLiked ? "fill-current" : ""} />

            {countFormatter.format(likeCount)}
          </button>

          <button
            type="button"
            onClick={openPostDetails}
            aria-label={`View ${post.commentCount} comments`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-emerald-700"
          >
            <MessageCircle size={18} />
            {countFormatter.format(post.commentCount)}
          </button>

          <span
            className="ml-auto inline-flex items-center gap-1.5 text-sm"
            aria-label={`${post.bookmarkCount} bookmarks`}
          >
            <Bookmark size={18} />
            {countFormatter.format(post.bookmarkCount)}
          </span>
        </footer>

        {likeError && (
          <p className="mt-2 text-xs text-red-600" role="alert">
            {likeError}
          </p>
        )}
      </div>
    </article>
  );
});

function PostSkeleton() {
  return (
    <div className="flex animate-pulse gap-3 px-4 py-4 sm:gap-4 sm:px-5">
      <div className="size-10 shrink-0 rounded-full bg-gray-200 sm:size-11" />
      <div className="flex-1 space-y-3">
        <div className="h-4 w-2/5 rounded bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-100" />
        <div className="h-3 w-3/4 rounded bg-gray-100" />
        <div className="aspect-[16/10] w-full rounded-2xl bg-gray-100" />
      </div>
    </div>
  );
}

export default function PostsPage({ preview = false }: PostsPageProps) {
  const [posts, setPosts] = useState<PublicPostListItemDTO[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const observerTarget = useRef<HTMLDivElement | null>(null);
  const fetchingRef = useRef(false);
  const nextCursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);

  const fetchPosts = useCallback(
    async (loadMore = false) => {
      if (
        fetchingRef.current ||
        (loadMore && (!hasMoreRef.current || preview))
      ) {
        return;
      }

      fetchingRef.current = true;
      setError(null);

      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await publicPostService.getPosts({
          limit: preview ? PREVIEW_SIZE : PAGE_SIZE,
          sortBy: "latest",
          ...(loadMore && nextCursorRef.current
            ? { cursor: nextCursorRef.current }
            : {}),
        });

        if (!response.success) {
          throw new Error(response.message || "Unable to load posts.");
        }

        const result = response.data;

        nextCursorRef.current = result.nextCursor;
        hasMoreRef.current = result.hasMore;

        setPosts((current) =>
          loadMore ? [...current, ...result.items] : result.items,
        );
        setHasMore(result.hasMore);
      } catch (fetchError: unknown) {
        setError(getErrorMessage(fetchError));
      } finally {
        fetchingRef.current = false;
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [preview],
  );

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (preview || !hasMore || loading || loadingMore || error) {
      return;
    }

    const target = observerTarget.current;

    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void fetchPosts(true);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [error, fetchPosts, hasMore, loading, loadingMore, preview]);

  return (
    <section className="mx-auto w-full max-w-2xl">
      <header className="px-4 pb-4 sm:px-5">
        <h2 className="text-xl font-semibold text-gray-900">Posts</h2>
        <p className="mt-1 text-sm text-gray-500">
          Discover nutrition tips and community experiences.
        </p>
      </header>

      <div className="divide-y divide-gray-200 overflow-hidden border-y border-gray-200 bg-white sm:rounded-2xl sm:border">
        {loading && posts.length === 0 && (
          <>
            {Array.from({ length: preview ? PREVIEW_SIZE : 3 }, (_, index) => (
              <PostSkeleton key={index} />
            ))}
          </>
        )}

        {error && posts.length === 0 && (
          <div className="p-6 text-center" role="alert">
            <p className="text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => void fetchPosts()}
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-600"
            >
              <RefreshCw size={14} />
              Try again
            </button>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="p-10 text-center">
            <p className="font-medium text-gray-900">No posts yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Check back later for community posts.
            </p>
          </div>
        )}

        {posts.map((post) => (
          <PostCard key={post.postId} post={post} />
        ))}

        {error && posts.length > 0 && (
          <div className="p-4 text-center" role="alert">
            <p className="text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => void fetchPosts(true)}
              className="mt-2 text-sm font-medium text-gray-900 underline"
            >
              Retry loading posts
            </button>
          </div>
        )}
      </div>

      {!preview && (
        <div
          ref={observerTarget}
          className="flex min-h-16 items-center justify-center py-4"
        >
          {loadingMore && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <RefreshCw size={16} className="animate-spin" />
              Loading more posts...
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <p className="text-sm text-gray-400">
              You&apos;ve reached the end.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
