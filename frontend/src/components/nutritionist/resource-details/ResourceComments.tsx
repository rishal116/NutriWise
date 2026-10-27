"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, MessageSquare, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { resourceCommentService } from "@/services/resource/resource-comment.service";
import type { ResourceCommentDTO } from "@/dtos/resource/resource-comment.dto";

interface ResourceCommentsProps {
  resourceId: string;
  currentUserId?: string;
  onCommentCountChange?: (change: number) => void;
}

export default function ResourceComments({
  resourceId,
  currentUserId,
  onCommentCountChange,
}: ResourceCommentsProps) {
  const [comments, setComments] = useState<ResourceCommentDTO[]>([]);
  const [content, setContent] = useState("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadComments = useCallback(async () => {
    setLoading(true);

    try {
      const response = await resourceCommentService.getComments(resourceId);
      const result = response.data;

      if (!result) {
        setComments([]);
        setNextCursor(null);
        setHasMore(false);
        return;
      }

      setComments(result.items);
      setNextCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch {
      toast.error("Couldn't load comments.");
    } finally {
      setLoading(false);
    }
  }, [resourceId]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  const loadMore = async () => {
    if (!nextCursor || loadingMore) return;

    setLoadingMore(true);

    try {
      const response = await resourceCommentService.getComments(
        resourceId,
        10,
        nextCursor,
      );

      const result = response.data;

      if (!result) return;

      setComments((previous) => [...previous, ...result.items]);
      setNextCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch {
      toast.error("Couldn't load more comments.");
    } finally {
      setLoadingMore(false);
    }
  };

  const addComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent || submitting) return;

    setSubmitting(true);

    try {
      await resourceCommentService.addComment(resourceId, trimmedContent);
      setContent("");
      onCommentCountChange?.(1);
      await loadComments();
      toast.success("Comment added.");
    } catch {
      toast.error("Couldn't add your comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (deletingId) return;

    setDeletingId(commentId);

    try {
      await resourceCommentService.deleteComment(commentId);

      setComments((previous) =>
        previous.filter((comment) => comment.commentId !== commentId),
      );

      onCommentCountChange?.(-1);
      toast.success("Comment deleted.");
    } catch {
      toast.error("Couldn't delete the comment.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div className="mb-5 flex items-center gap-2">
        <MessageSquare size={17} className="text-emerald-700" />
        <h2 className="text-base font-bold text-slate-900">Comments</h2>
        <span className="text-sm text-slate-400">{comments.length}</span>
      </div>

      {currentUserId && (
        <form onSubmit={addComment} className="mb-6">
          <label htmlFor="resource-comment" className="sr-only">
            Write a comment
          </label>

          <textarea
            id="resource-comment"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="Share your thoughts..."
            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />

          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              Comment
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-emerald-700" />
        </div>
      ) : comments.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">
          No comments yet.
        </p>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => (
            <article
              key={comment.commentId}
              className="flex gap-3 border-b border-slate-100 pb-4 last:border-0"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                {comment.userProfileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={comment.userProfileImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  comment.userFullName.charAt(0).toUpperCase()
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {comment.userFullName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString("en-IN")}
                      {comment.isEdited && " · Edited"}
                    </p>
                  </div>

                  {currentUserId === comment.userId && (
                    <button
                      type="button"
                      onClick={() => void deleteComment(comment.commentId)}
                      disabled={deletingId !== null}
                      aria-label="Delete comment"
                      className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                    >
                      {deletingId === comment.commentId ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  )}
                </div>

                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-600">
                  {comment.content}
                </p>
              </div>
            </article>
          ))}

          {hasMore && (
            <button
              type="button"
              onClick={() => void loadMore()}
              disabled={loadingMore}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              {loadingMore ? "Loading..." : "Load more comments"}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
