"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Eye,
  FileText,
  Heart,
  MessageCircle,
  Send,
  Trash2,
  User as UserIcon,
} from "lucide-react";

import type { PublicResourceDTO } from "@/dtos/public/resource/public-resource-response.dto";
import type { ResourceCommentDTO } from "@/dtos/resource/resource-comment.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import { publicResourceService } from "@/services/public/publicResource.service";
import { resourceCommentService } from "@/services/resource/resource-comment.service";
import { resourceLikeService } from "@/services/resource/resource-like.service";
import { resourceViewService } from "@/services/resource/resource-view.service";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useAppSelector } from "@/redux/hooks";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { usePendingAction } from "@/hooks/usePendingAction";

const COMMENTS_LIMIT = 10;

export default function ResourceDetailsPage() {
  const { resourceId } = useParams<{ resourceId: string }>();
  const currentUser = useAppSelector((state) => state.auth.user);
  const { guardAction } = useAuthGuard();

  const [resource, setResource] = useState<PublicResourceDTO | null>(null);
  const [comments, setComments] = useState<ResourceCommentDTO[]>([]);
  const [commentsPage, setCommentsPage] =
    useState<InfiniteScrollResponseDTO<ResourceCommentDTO> | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingMoreComments, setLoadingMoreComments] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [liking, setLiking] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  );
  const [commentText, setCommentText] = useState("");

  const viewRecordedFor = useRef<string | null>(null);
  const likeInProgress = useRef(false);

  const fetchResource = useCallback(async () => {
    const response = await publicResourceService.getResourceDetails(resourceId);

    if (!response.data) {
      throw new Error("Resource not found");
    }

    setResource(response.data);
  }, [resourceId]);

  const fetchComments = useCallback(async () => {
    setLoadingComments(true);

    try {
      const response = await resourceCommentService.getComments(
        resourceId,
        COMMENTS_LIMIT,
      );

      if (!response.data) {
        throw new Error("Failed to load comments");
      }

      setComments(response.data.items);
      setCommentsPage(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingComments(false);
    }
  }, [resourceId]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      setResource(null);
      setComments([]);
      setCommentsPage(null);

      try {
        const response =
          await publicResourceService.getResourceDetails(resourceId);

        if (cancelled) return;

        if (!response.data) {
          throw new Error("Resource not found");
        }

        setResource(response.data);
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [resourceId]);

  useEffect(() => {
    if (!resource) return;

    let cancelled = false;

    const loadComments = async () => {
      setLoadingComments(true);

      try {
        const response = await resourceCommentService.getComments(
          resourceId,
          COMMENTS_LIMIT,
        );

        if (cancelled) return;

        if (!response.data) {
          throw new Error("comments not found");
        }

        setComments(response.data.items);
        setCommentsPage(response.data);
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoadingComments(false);
        }
      }
    };

    void loadComments();

    return () => {
      cancelled = true;
    };
  }, [resource, resourceId]);

  useEffect(() => {
    if (!resource || viewRecordedFor.current === resourceId) return;

    viewRecordedFor.current = resourceId;

    void resourceViewService.recordView(resourceId).catch(() => {});
  }, [resource, resourceId]);

  const handleToggleLike = () => {
    if (!resource || likeInProgress.current) return;

    guardAction(
      async () => {
        if (likeInProgress.current) return;

        likeInProgress.current = true;
        setLiking(true);
        setError(null);

        const previous = resource;
        const nextLiked = !previous.isLikedByMe;

        setResource({
          ...previous,
          isLikedByMe: nextLiked,
          likeCount: Math.max(0, previous.likeCount + (nextLiked ? 1 : -1)),
        });

        try {
          if (nextLiked) {
            await resourceLikeService.likeResource(resourceId);
          } else {
            await resourceLikeService.unlikeResource(resourceId);
          }
        } catch (err) {
          setResource(previous);
          setError(getErrorMessage(err));
        } finally {
          likeInProgress.current = false;
          setLiking(false);
        }
      },
      { actionKey: "LIKE_RESOURCE" },
    );
  };

  const handleAddComment = () => {
    const content = commentText.trim();

    if (!content || submittingComment) return;

    guardAction(
      async () => {
        setSubmittingComment(true);
        setError(null);

        try {
          await resourceCommentService.addComment(resourceId, content);
          setCommentText("");

          await Promise.all([fetchResource(), fetchComments()]);
        } catch (err) {
          setError(getErrorMessage(err));
        } finally {
          setSubmittingComment(false);
        }
      },
      { actionKey: "ADD_COMMENT" },
    );
  };

  const handleLoadMoreComments = async () => {
    if (
      !commentsPage?.hasMore ||
      !commentsPage.nextCursor ||
      loadingMoreComments
    ) {
      return;
    }

    setLoadingMoreComments(true);
    setError(null);

    try {
      const response = await resourceCommentService.getComments(
        resourceId,
        COMMENTS_LIMIT,
        commentsPage.nextCursor,
      );

      const page = response.data;

      if (!page) {
        throw new Error("Failed to load more comments");
      }

      setComments((previous) => {
        const existingIds = new Set(
          previous.map((comment) => comment.commentId),
        );

        return [
          ...previous,
          ...page.items.filter(
            (comment) => !existingIds.has(comment.commentId),
          ),
        ];
      });

      setCommentsPage(page);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingMoreComments(false);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (deletingCommentId) return;

    guardAction(
      async () => {
        const previousComments = comments;
        const previousResource = resource;

        setDeletingCommentId(commentId);
        setError(null);

        setComments((previous) =>
          previous.filter((comment) => comment.commentId !== commentId),
        );

        if (previousResource) {
          setResource({
            ...previousResource,
            commentCount: Math.max(0, previousResource.commentCount - 1),
          });
        }

        try {
          await resourceCommentService.deleteComment(commentId);
        } catch (err) {
          setComments(previousComments);
          setResource(previousResource);
          setError(getErrorMessage(err));
        } finally {
          setDeletingCommentId(null);
        }
      },
      { actionKey: "DELETE_COMMENT" },
    );
  };

  usePendingAction(async (pending) => {
    if (pending.actionKey === "LIKE_RESOURCE") {
      handleToggleLike();
    }
  });

  if (loading) {
    return <ResourceDetailsSkeleton />;
  }

  if (error && !resource) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p role="alert" className="text-rose-600">
          {error}
        </p>
      </main>
    );
  }

  if (!resource) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <FileText size={40} className="mx-auto text-slate-400" />
        <h1 className="mt-4 text-lg font-semibold text-slate-900">
          Resource not found
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          This resource may have been removed or the link is incorrect.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <article className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          {resource.category} · {resource.type.replace("_", " ")}
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          {resource.title}
        </h1>

        <p className="mt-3 text-slate-600">{resource.description}</p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <Eye size={16} />
            {resource.viewCount} views
          </span>

          <span className="flex items-center gap-1">
            <Heart size={16} />
            {resource.likeCount}
          </span>

          <span className="flex items-center gap-1">
            <MessageCircle size={16} />
            {resource.commentCount}
          </span>

          {resource.publishedAt && (
            <span>
              Published {new Date(resource.publishedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleToggleLike}
            disabled={liking}
            aria-pressed={resource.isLikedByMe}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-xs transition disabled:cursor-not-allowed disabled:opacity-50 ${
              resource.isLikedByMe
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200/80 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
            }`}
          >
            <Heart
              size={16}
              className={resource.isLikedByMe ? "fill-emerald-700" : ""}
            />
            {resource.isLikedByMe ? "Liked" : "Like"}
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-3 text-xs font-medium text-rose-600">
            {error}
          </p>
        )}

        <div className="mt-10 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
          <ResourceBody resource={resource} />
        </div>

        <CommentsSection
          comments={comments}
          commentCount={resource.commentCount}
          currentUserId={currentUser?.id}
          commentText={commentText}
          onCommentTextChange={setCommentText}
          onSubmit={handleAddComment}
          submitting={submittingComment}
          loading={loadingComments}
          loadingMore={loadingMoreComments}
          hasMore={commentsPage?.hasMore ?? false}
          onLoadMore={handleLoadMoreComments}
          deletingCommentId={deletingCommentId}
          onDelete={handleDeleteComment}
          isAuthenticated={!!currentUser}
        />
      </article>
    </main>
  );
}

function CommentsSection({
  comments,
  commentCount,
  currentUserId,
  commentText,
  onCommentTextChange,
  onSubmit,
  submitting,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
  deletingCommentId,
  onDelete,
  isAuthenticated,
}: {
  comments: ResourceCommentDTO[];
  commentCount: number;
  currentUserId?: string;
  commentText: string;
  onCommentTextChange: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  deletingCommentId: string | null;
  onDelete: (commentId: string) => void;
  isAuthenticated: boolean;
}) {
  return (
    <section className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
      <div className="flex items-center gap-2">
        <span className="h-5 w-1 rounded-full bg-emerald-600" />
        <h2 className="text-base font-bold tracking-tight text-slate-900">
          Comments ({commentCount})
        </h2>
      </div>

      <div className="mt-5 flex items-start gap-3">
        <textarea
          value={commentText}
          onChange={(event) => onCommentTextChange(event.target.value)}
          placeholder={
            isAuthenticated ? "Add a comment..." : "Sign in to comment"
          }
          disabled={!isAuthenticated || submitting}
          rows={2}
          className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="button"
          onClick={onSubmit}
          disabled={!isAuthenticated || submitting || !commentText.trim()}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-xs transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Post comment"
        >
          <Send size={15} />
        </button>
      </div>

      {loading && comments.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">Loading comments...</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {comments.length === 0 && (
            <li className="text-sm text-slate-500">
              No comments yet. Be the first to share your thoughts.
            </li>
          )}

          {comments.map((comment) => {
            const isOwnComment = comment.userId === currentUserId;

            return (
              <li key={comment.commentId} className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <UserIcon size={15} />
                </div>

                <div className="min-w-0 flex-1 rounded-xl bg-slate-50 px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-900">
                      {isOwnComment ? "You" : comment.userFullName}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-slate-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                        {comment.isEdited && " · edited"}
                      </span>

                      {isOwnComment && (
                        <button
                          type="button"
                          onClick={() => onDelete(comment.commentId)}
                          disabled={deletingCommentId === comment.commentId}
                          className="text-slate-400 transition hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Delete comment"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                    {comment.content}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {hasMore && (
        <button
          type="button"
          onClick={onLoadMore}
          disabled={loadingMore}
          className="mt-5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 disabled:opacity-50"
        >
          {loadingMore ? "Loading..." : "Load more comments"}
        </button>
      )}
    </section>
  );
}

function ResourceBody({ resource }: { resource: PublicResourceDTO }) {
  switch (resource.type) {
    case "article":
      return resource.content ? (
        <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
          {resource.content}
        </div>
      ) : (
        <EmptyBody />
      );

    case "infographic":
      return resource.fileUrl ? (
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={resource.fileUrl}
            alt={resource.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-contain"
          />
        </div>
      ) : (
        <EmptyBody />
      );

    case "video":
      return resource.fileUrl ? (
        <video controls className="w-full rounded-xl bg-black">
          <source src={resource.fileUrl} />
          Your browser does not support video playback.
        </video>
      ) : (
        <EmptyBody />
      );

    case "pdf":
      return resource.fileUrl ? (
        <a
          href={resource.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-emerald-700 hover:underline"
        >
          <FileText size={18} />
          Open PDF in a new tab
        </a>
      ) : (
        <EmptyBody />
      );

    default:
      return <EmptyBody />;
  }
}

function EmptyBody() {
  return (
    <p className="text-sm text-slate-500">
      No content available for this resource.
    </p>
  );
}

function ResourceDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-3xl animate-pulse px-4 pt-10 sm:px-6">
        <div className="h-3 w-32 rounded bg-slate-200" />
        <div className="mt-3 h-8 w-3/4 rounded bg-slate-200" />
        <div className="mt-4 h-4 w-full rounded bg-slate-200" />
        <div className="mt-2 h-4 w-2/3 rounded bg-slate-200" />
        <div className="mt-10 h-64 rounded-2xl bg-slate-200" />
      </div>
    </main>
  );
}
