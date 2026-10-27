"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Heart, MessageCircle, RefreshCw, Send } from "lucide-react";

import { publicPostService } from "@/services/public/publicPost.service";
import { postCommentService } from "@/services/post/post-comment.service";
import { postLikeService } from "@/services/post/post-like.service";
import { postViewService } from "@/services/post/post-view.service";
import { Eye } from "lucide-react";
import type { PostCardResponseDTO } from "@/dtos/user/post/post-response.dto";
import type { PostCommentResponseDto } from "@/dtos/post/post-comment-response.dto";

const PAGE_SIZE = 10;

const relativeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

function formatRelativeTime(date: string | Date): string {
  const timestamp = new Date(date).getTime();

  if (Number.isNaN(timestamp)) {
    return "Recently";
  }

  const seconds = Math.floor((timestamp - Date.now()) / 1000);

  const units: {
    unit: Intl.RelativeTimeFormatUnit;
    seconds: number;
  }[] = [
    { unit: "year", seconds: 31_536_000 },
    { unit: "month", seconds: 2_592_000 },
    { unit: "week", seconds: 604_800 },
    { unit: "day", seconds: 86_400 },
    { unit: "hour", seconds: 3_600 },
    { unit: "minute", seconds: 60 },
  ];

  for (const item of units) {
    if (Math.abs(seconds) >= item.seconds) {
      return relativeFormatter.format(
        Math.round(seconds / item.seconds),
        item.unit,
      );
    }
  }

  return "Just now";
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

function PostMedia({
  media,
}: {
  media: NonNullable<PostCardResponseDTO["media"]>;
}) {
  if (media.type.toLowerCase() === "video") {
    return (
      <div className="mt-4 overflow-hidden rounded-xl bg-black">
        <video
          src={media.url}
          controls
          playsInline
          preload="metadata"
          className="max-h-[560px] w-full object-contain"
        >
          Your browser does not support video playback.
        </video>
      </div>
    );
  }

  return (
    <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-xl bg-gray-100">
      <Image
        src={media.url}
        alt="Community post media"
        fill
        sizes="(max-width: 768px) 100vw, 768px"
        className="object-contain"
      />
    </div>
  );
}

function CommentItem({ comment }: { comment: PostCommentResponseDto }) {
  const initial = comment.username.trim().charAt(0).toUpperCase() || "U";

  return (
    <article className="flex gap-3 py-4">
      {comment.profileImage ? (
        <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-emerald-100">
          <Image
            src={comment.profileImage}
            alt={`${comment.username}'s profile`}
            fill
            sizes="36px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-800">
          <span aria-hidden="true">{initial}</span>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-semibold text-gray-900">
            {comment.username}
          </span>
          <span className="text-xs text-gray-400">
            {formatRelativeTime(comment.createdAt)}
          </span>
        </div>

        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
          {comment.content}
        </p>
      </div>
    </article>
  );
}

export default function PostDetailsPage() {
  const params = useParams<{ postId: string }>();
  const postId = params.postId;

  const [post, setPost] = useState<PostCardResponseDTO | null>(null);
  const [comments, setComments] = useState<PostCommentResponseDto[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [content, setContent] = useState("");

  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const [hasMore, setHasMore] = useState(false);

  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [liking, setLiking] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);

  const commentsRequestRef = useRef(false);
  const commentsRequestIdRef = useRef(0);
  const nextCursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(false);

  useEffect(() => {
    if (!post || post.isViewedByMe) {
      return;
    }

    let cancelled = false;

    const recordView = async () => {
      try {
        const response = await postViewService.viewPost(post._id);

        if (!cancelled && response.success) {
          setPost((current) =>
            current
              ? {
                  ...current,
                  isViewedByMe: true,
                  viewCount: current.viewCount + 1,
                }
              : current,
          );
        }
      } catch (viewError: unknown) {
        console.error("Failed to record post view:", viewError);
      }
    };

    void recordView();

    return () => {
      cancelled = true;
    };
  }, [post]);

  useEffect(() => {
    let cancelled = false;

    async function fetchPost() {
      setLoadingPost(true);
      setError(null);

      try {
        const response = await publicPostService.getPostDetails(postId);

        if (!response.success || !response.data) {
          throw new Error(response.message || "Unable to load this post.");
        }

        if (cancelled) {
          return;
        }

        setPost(response.data);
        setCommentCount(response.data.commentCount);
      } catch (fetchError: unknown) {
        if (!cancelled) {
          setError(getErrorMessage(fetchError));
        }
      } finally {
        if (!cancelled) {
          setLoadingPost(false);
        }
      }
    }

    if (postId) {
      void fetchPost();
    } else {
      setError("Invalid post ID.");
      setLoadingPost(false);
    }

    return () => {
      cancelled = true;
    };
  }, [postId]);

  const fetchComments = useCallback(
    async (loadMore = false) => {
      if (commentsRequestRef.current) {
        return;
      }

      if (loadMore && !hasMoreRef.current) {
        return;
      }

      const requestId = ++commentsRequestIdRef.current;
      commentsRequestRef.current = true;

      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoadingComments(true);
      }

      setCommentError(null);

      try {
        const cursor = loadMore ? nextCursorRef.current : null;

        const response = await postCommentService.getComments(
          postId,
          PAGE_SIZE,
          cursor ?? undefined,
        );

        if (!response.success || !response.data) {
          throw new Error(response.message || "Unable to load comments.");
        }

        if (requestId !== commentsRequestIdRef.current) {
          return;
        }

        const result = response.data;

        setComments((current) =>
          loadMore ? [...current, ...result.items] : result.items,
        );

        nextCursorRef.current = result.nextCursor;
        hasMoreRef.current = result.hasMore;

        setNextCursor(result.nextCursor);
        setHasMore(result.hasMore);
      } catch (fetchError: unknown) {
        if (requestId === commentsRequestIdRef.current) {
          setCommentError(getErrorMessage(fetchError));
        }
      } finally {
        if (requestId === commentsRequestIdRef.current) {
          commentsRequestRef.current = false;
          setLoadingComments(false);
          setLoadingMore(false);
        }
      }
    },
    [postId],
  );

  useEffect(() => {
    commentsRequestIdRef.current += 1;
    commentsRequestRef.current = false;
    nextCursorRef.current = null;
    hasMoreRef.current = false;

    setComments([]);
    setNextCursor(null);
    setHasMore(false);
    setCommentError(null);

    void fetchComments();

    return () => {
      commentsRequestIdRef.current += 1;
      commentsRequestRef.current = false;
    };
  }, [postId, fetchComments]);

  const handleCreateComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent || submitting) {
      return;
    }

    setSubmitting(true);
    setCommentError(null);

    try {
      const response = await postCommentService.createComment(
        postId,
        trimmedContent,
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Unable to create comment.");
      }

      setComments((current) => [response.data!, ...current]);
      setContent("");
      setCommentCount((current) => current + 1);
    } catch (submitError: unknown) {
      setCommentError(getErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (!post || liking) {
      return;
    }

    const previousIsLiked = post.isLikedByMe;
    const previousLikeCount = post.likeCount;
    const nextIsLiked = !previousIsLiked;

    setLiking(true);

    setPost((current) =>
      current
        ? {
            ...current,
            isLikedByMe: nextIsLiked,
            likeCount: Math.max(0, current.likeCount + (nextIsLiked ? 1 : -1)),
          }
        : current,
    );

    try {
      const response = nextIsLiked
        ? await postLikeService.likePost(post._id)
        : await postLikeService.unlikePost(post._id);

      if (!response.success) {
        throw new Error(response.message || "Unable to update like.");
      }
    } catch (likeError: unknown) {
      setPost((current) =>
        current
          ? {
              ...current,
              isLikedByMe: previousIsLiked,
              likeCount: previousLikeCount,
            }
          : current,
      );

      setError(getErrorMessage(likeError));
    } finally {
      setLiking(false);
    }
  };

  if (loadingPost) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-32 rounded bg-gray-200" />
          <div className="h-40 rounded-xl bg-gray-100" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-100" />
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link
          href="/communities/posts"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to community
        </Link>

        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-5">
          <p className="text-sm text-red-700" role="alert">
            {error || "Post not found."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8">
      <Link
        href="/communities/posts"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-emerald-700"
      >
        <ArrowLeft size={17} />
        Back to community
      </Link>

      <article className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <header className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <MessageCircle size={20} className="text-emerald-800" />
          </div>

          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-gray-900">
              Community post
            </h1>
            <p className="text-xs text-gray-400">
              {formatRelativeTime(post.createdAt)}
            </p>
          </div>
        </header>

        {post.content && (
          <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-gray-800 sm:text-base">
            {post.content}
          </p>
        )}

        {post.media && <PostMedia media={post.media} />}

        <footer className="mt-5 flex items-center gap-5 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={() => void handleLike()}
            disabled={liking}
            aria-pressed={post.isLikedByMe}
            className={`inline-flex items-center gap-2 text-sm transition ${
              post.isLikedByMe
                ? "text-rose-600"
                : "text-gray-500 hover:text-rose-600"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <Heart
              size={19}
              className={post.isLikedByMe ? "fill-current" : ""}
            />
            {post.likeCount} {post.likeCount === 1 ? "like" : "likes"}
          </button>

          <div className="inline-flex items-center gap-2 text-sm text-emerald-700">
            <MessageCircle size={19} />
            {commentCount} {commentCount === 1 ? "comment" : "comments"}
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <Eye size={19} />
            {post.viewCount} {post.viewCount === 1 ? "view" : "views"}
          </div>
        </footer>
      </article>

      <section className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Discussion</h2>
          <p className="mt-1 text-sm text-gray-500">
            Share your thoughts and join the conversation.
          </p>
        </div>

        <form onSubmit={handleCreateComment}>
          <label
            htmlFor="post-comment"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Write a comment
          </label>

          <textarea
            id="post-comment"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="What are your thoughts?"
            rows={4}
            maxLength={2000}
            className="w-full resize-y rounded-xl border border-gray-200 px-3 py-3 text-sm leading-6 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />

          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-xs text-gray-400">{content.length}/2000</span>

            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              {submitting ? "Posting..." : "Comment"}
            </button>
          </div>
        </form>

        {commentError && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <p role="alert">{commentError}</p>
            <button
              type="button"
              onClick={() => void fetchComments()}
              disabled={loadingComments}
              className="mt-2 font-medium underline disabled:opacity-50"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mt-5 divide-y divide-gray-100 border-t border-gray-100">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}

          {loadingComments && comments.length === 0 && (
            <p className="py-6 text-center text-sm text-gray-500">
              Loading comments...
            </p>
          )}

          {!loadingComments && comments.length === 0 && !commentError && (
            <div className="py-10 text-center">
              <MessageCircle size={30} className="mx-auto text-gray-300" />
              <p className="mt-3 text-sm font-medium text-gray-700">
                No comments yet
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Be the first to join the discussion.
              </p>
            </div>
          )}
        </div>

        {hasMore && comments.length > 0 && (
          <div className="pt-4 text-center">
            <button
              type="button"
              onClick={() => void fetchComments(true)}
              disabled={loadingMore || loadingComments}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
            >
              {loadingMore && <RefreshCw size={15} className="animate-spin" />}
              {loadingMore ? "Loading..." : "Load more comments"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
