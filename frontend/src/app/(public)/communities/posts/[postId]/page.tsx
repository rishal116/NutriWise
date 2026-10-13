"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Heart, MessageCircle, RefreshCw, Send } from "lucide-react";

import { publicPostService } from "@/services/public/publicPost.service";
import { postCommentService } from "@/services/post/postComment.service";
import { postLikeService } from "@/services/post/postLike.service";

import type { PublicPostListItemDTO } from "@/dtos/public/post/public-post-list-item.dto";
import type {
  PostCommentDTO,
  PostCommentListDTO,
} from "@/services/post/postComment.service";

const PAGE_SIZE = 10;

const relativeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

function formatRelativeTime(date: string): string {
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
  authorName,
}: {
  media: NonNullable<PublicPostListItemDTO["media"]>;
  authorName: string;
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
        alt={`Post media by ${authorName}`}
        fill
        sizes="(max-width: 768px) 100vw, 768px"
        className="object-contain"
      />
    </div>
  );
}

function CommentItem({ comment }: { comment: PostCommentDTO }) {
  return (
    <article className="flex gap-3 py-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-800">
        <span aria-hidden>{comment.userId.charAt(0).toUpperCase() || "U"}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-semibold text-gray-900">
            Community member
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

  const [post, setPost] = useState<PublicPostListItemDTO | null>(null);
  const [comments, setComments] = useState<PostCommentDTO[]>([]);
  const [commentCount, setCommentCount] = useState(0);

  const [content, setContent] = useState("");
  const [nextCursor, setNextCursor] =
    useState<PostCommentListDTO["nextCursor"]>(null);
  const [hasMore, setHasMore] = useState(true);

  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [liking, setLiking] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchPost() {
      setLoadingPost(true);
      setError(null);

      try {
        const response = await publicPostService.getPostDetails(postId);

        if (!response.success) {
          throw new Error(response.message || "Unable to load this post.");
        }

        if (cancelled) {
          return;
        }

        setPost(response.data);
        setCommentCount(response.data.commentCount);
        setIsLiked(response.data.isLiked);
        setLikeCount(response.data.likeCount);
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
    }

    return () => {
      cancelled = true;
    };
  }, [postId]);

  const fetchComments = useCallback(
    async (loadMore = false) => {
      if (loadMore && (!hasMore || loadingMore)) {
        return;
      }

      if (!loadMore && loadingComments) {
        return;
      }

      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoadingComments(true);
      }

      setCommentError(null);

      try {
        const response = await postCommentService.getComments(
          postId,
          PAGE_SIZE,
          loadMore && nextCursor ? nextCursor : undefined,
        );

        if (!response.success) {
          throw new Error(response.message || "Unable to load comments.");
        }

        const result = response.data;

        setComments((current) =>
          loadMore ? [...current, ...result.comments] : result.comments,
        );
        setNextCursor(result.nextCursor);
        setHasMore(result.hasMore);
      } catch (fetchError: unknown) {
        setCommentError(getErrorMessage(fetchError));
      } finally {
        setLoadingComments(false);
        setLoadingMore(false);
      }
    },
    [hasMore, loadingComments, loadingMore, nextCursor, postId],
  );

  useEffect(() => {
    void fetchComments();
    // Load the first page when the post ID changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleCreateComment = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
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

      if (!response.success) {
        throw new Error(response.message || "Unable to create comment.");
      }

      setComments((current) => [response.data, ...current]);
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

    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;
    const nextIsLiked = !previousIsLiked;

    setLiking(true);
    setIsLiked(nextIsLiked);
    setLikeCount((current) => current + (nextIsLiked ? 1 : -1));

    try {
      const response = nextIsLiked
        ? await postLikeService.likePost(postId)
        : await postLikeService.unlikePost(postId);

      if (!response.success) {
        throw new Error(response.message || "Unable to update like.");
      }

      setIsLiked(response.data.isLiked);
      setLikeCount(response.data.likeCount);
    } catch {
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
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
          href="/communities"
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
        href="/communities"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-emerald-700"
      >
        <ArrowLeft size={17} />
        Back to community
      </Link>

      <article className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <header className="flex items-center gap-3">
          <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-emerald-100">
            {post.author.profileImage ? (
              <Image
                src={post.author.profileImage}
                alt={post.author.name}
                fill
                sizes="44px"
                className="object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center font-semibold text-emerald-800">
                {post.author.name.charAt(0).toUpperCase() || "?"}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-gray-900">
              {post.author.name}
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

        {post.media && (
          <PostMedia media={post.media} authorName={post.author.name} />
        )}

        <footer className="mt-5 flex items-center gap-5 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={() => void handleLike()}
            disabled={liking}
            aria-pressed={isLiked}
            className={`inline-flex items-center gap-2 text-sm transition ${
              isLiked ? "text-rose-600" : "text-gray-500 hover:text-rose-600"
            }`}
          >
            <Heart size={19} className={isLiked ? "fill-current" : ""} />
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </button>

          <div className="inline-flex items-center gap-2 text-sm text-emerald-700">
            <MessageCircle size={19} />
            {commentCount} {commentCount === 1 ? "comment" : "comments"}
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
              className="mt-2 font-medium underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mt-5 divide-y divide-gray-100 border-t border-gray-100">
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
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
              disabled={loadingMore}
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
