"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  Heart,
  Loader2,
  MessageCircle,
  Pencil,
  Save,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";

import { userPostService } from "@/services/user/userPost.service";
import { postCommentService } from "@/services/post/post-comment.service";
import { postLikeService } from "@/services/post/post-like.service";
import { postViewService } from "@/services/post/post-view.service";

import type { PostCardResponseDTO } from "@/dtos/user/post/post-response.dto";
import type { PostCommentResponseDto } from "@/dtos/post/post-comment-response.dto";

import { PostMediaViewer } from "@/components/user/posts/PostMediaViewer";
import { PostMediaPicker } from "@/components/user/posts/PostMediaPicker";
import { PostsErrorState } from "@/components/user/posts/PostsErrorsState";
import { DeletePostModal } from "@/components/user/posts/DeletePostModel";

const MAX_LENGTH = 2000;
const COMMENT_PAGE_SIZE = 10;

function formatDate(date: Date | string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export default function PostDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const postId = params.id;

  const [post, setPost] = useState<PostCardResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [comments, setComments] = useState<PostCommentResponseDto[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [commentsCursor, setCommentsCursor] = useState<string | null>(null);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isCreatingComment, setIsCreatingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  const [isUpdatingLike, setIsUpdatingLike] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);

  // Prevent overlapping comment pagination requests.
  const commentsRequestInFlightRef = useRef(false);

  // Avoid sending duplicate view requests for the same post during
  // repeated renders or React Strict Mode effect execution.
  const viewedPostIdsRef = useRef<Set<string>>(new Set());

  const trimmedContent = content.trim();

  const loadPost = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await userPostService.getPostDetails(postId);

      if (!response.data) {
        throw new Error("Post data was not returned.");
      }

      setPost(response.data);
      setContent(response.data.content ?? "");
    } catch (error: unknown) {
      setLoadError(
        error instanceof Error
          ? error
          : new Error("Failed to load post. Please try again."),
      );
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const loadComments = useCallback(
    async (cursor?: string, forceRefresh = false): Promise<void> => {
      if (commentsRequestInFlightRef.current) {
        return;
      }

      commentsRequestInFlightRef.current = true;
      setIsLoadingComments(true);
      setCommentError(null);

      try {
        const response = await postCommentService.getComments(
          postId,
          COMMENT_PAGE_SIZE,
          cursor,
        );

        const result = response.data;

        if (!result) {
          throw new Error("Comments were not returned.");
        }

        setComments((previous) => {
          if (!cursor || forceRefresh) {
            return result.items;
          }

          // Avoid duplicate comments when pagination responses overlap.
          const existingIds = new Set(previous.map((comment) => comment.id));
          const newComments = result.items.filter(
            (comment) => !existingIds.has(comment.id),
          );

          return [...previous, ...newComments];
        });

        setCommentsCursor(result.nextCursor);
        setHasMoreComments(result.hasMore);
      } catch (error: unknown) {
        setCommentError(
          getErrorMessage(error, "Failed to load comments. Please try again."),
        );
      } finally {
        commentsRequestInFlightRef.current = false;
        setIsLoadingComments(false);
      }
    },
    [postId],
  );

  useEffect(() => {
    void loadPost();
  }, [loadPost]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  // Record a view only when the loaded post has not already been viewed
  // by the current user. The backend must also deduplicate views.
  useEffect(() => {
    if (!post || post.isViewedByMe) {
      return;
    }

    const currentPostId = post._id;

    if (viewedPostIdsRef.current.has(currentPostId)) {
      return;
    }

    viewedPostIdsRef.current.add(currentPostId);

    const recordView = async (): Promise<void> => {
      try {
        await postViewService.viewPost(currentPostId);

        setPost((previous) => {
          if (
            !previous ||
            previous._id !== currentPostId ||
            previous.isViewedByMe
          ) {
            return previous;
          }

          return {
            ...previous,
            isViewedByMe: true,
            viewCount: previous.viewCount + 1,
          };
        });
      } catch {
        // Allow a later effect execution or remount to retry.
        viewedPostIdsRef.current.delete(currentPostId);
      }
    };

    void recordView();
  }, [post]);

  useEffect(() => {
    setIsEditing(searchParams.get("edit") === "true");
  }, [searchParams]);

  const handleToggleLike = async (): Promise<void> => {
    if (!post || isUpdatingLike) {
      return;
    }

    const currentPostId = post._id;
    const wasLiked = post.isLikedByMe;

    setIsUpdatingLike(true);
    setLikeError(null);

    try {
      if (wasLiked) {
        await postLikeService.unlikePost(currentPostId);
      } else {
        await postLikeService.likePost(currentPostId);
      }

      setPost((previous) => {
        if (!previous || previous._id !== currentPostId) {
          return previous;
        }

        return {
          ...previous,
          isLikedByMe: !wasLiked,
          likeCount: Math.max(
            0,
            previous.likeCount + (wasLiked ? -1 : 1),
          ),
        };
      });
    } catch (error: unknown) {
      setLikeError(
        getErrorMessage(error, "Couldn't update your like. Please try again."),
      );
    } finally {
      setIsUpdatingLike(false);
    }
  };

  const handleCreateComment = async (): Promise<void> => {
    const trimmedComment = commentContent.trim();

    if (!trimmedComment || isCreatingComment) {
      return;
    }

    setIsCreatingComment(true);
    setCommentError(null);

    try {
      await postCommentService.createComment(postId, trimmedComment);

      setCommentContent("");

      // Refresh the first page so the new comment appears in the list.
      // If another comments request is in flight, its result is retained
      // and the user can refresh by revisiting the page.
      await loadComments(undefined, true);
      await loadPost();
    } catch (error: unknown) {
      setCommentError(
        getErrorMessage(error, "Failed to add comment. Please try again."),
      );
    } finally {
      setIsCreatingComment(false);
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!post || isSaving) {
      return;
    }

    if (!trimmedContent && !newFile && !post.media) {
      setSaveError("Add a caption or attach media before saving.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      await userPostService.updatePost(
        post._id,
        { content: trimmedContent || undefined },
        newFile ?? undefined,
      );

      setNewFile(null);
      setIsEditing(false);

      router.replace(`/user/posts/${post._id}`);

      await loadPost();
    } catch (error: unknown) {
      setSaveError(
        getErrorMessage(
          error,
          "We couldn't save your changes. Please try again.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = (): void => {
    if (!post) {
      return;
    }

    setContent(post.content ?? "");
    setNewFile(null);
    setSaveError(null);
    setIsEditing(false);

    router.replace(`/user/posts/${post._id}`);
  };

  const handleDelete = async (): Promise<void> => {
    if (!post || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await userPostService.deletePost(post._id);
      router.push("/user/posts");
    } catch (error: unknown) {
      setDeleteError(
        getErrorMessage(error, "Failed to delete post. Please try again."),
      );
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div className="h-6 w-40 animate-pulse rounded-full bg-slate-100" />
        <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-24 w-full animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (loadError || !post) {
    return (
      <div className="mx-auto max-w-2xl">
        <PostsErrorState onRetry={() => void loadPost()} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <button
        type="button"
        onClick={() => router.push("/user/posts")}
        className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-emerald-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to My Posts
      </button>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        {!isEditing ? (
          <>
            {post.media && (
              <PostMediaViewer
                media={post.media}
                className="rounded-t-2xl"
              />
            )}

            <div className="flex flex-col gap-4 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {formatDate(post.createdAt)}
                </span>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSaveError(null);
                      setIsEditing(true);
                    }}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDeleteError(null);
                      setIsDeleteOpen(true);
                    }}
                    className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 shadow-xs transition-colors hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>

              <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-slate-700">
                {post.content || (
                  <span className="italic text-slate-400">No caption</span>
                )}
              </p>

              <div className="flex flex-wrap items-center gap-5 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                <button
                  type="button"
                  onClick={() => void handleToggleLike()}
                  disabled={isUpdatingLike}
                  aria-pressed={post.isLikedByMe}
                  aria-label={
                    post.isLikedByMe ? "Unlike post" : "Like post"
                  }
                  className="flex items-center gap-1.5 transition-colors hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUpdatingLike ? (
                    <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
                  ) : (
                    <Heart
                      className={`h-4 w-4 ${
                        post.isLikedByMe
                          ? "fill-rose-500 text-rose-500"
                          : "text-rose-500"
                      }`}
                    />
                  )}
                  {post.likeCount} {post.likeCount === 1 ? "like" : "likes"}
                </button>

                <span className="flex items-center gap-1.5">
                  <MessageCircle className="h-4 w-4 text-emerald-600" />
                  {post.commentCount}{" "}
                  {post.commentCount === 1 ? "comment" : "comments"}
                </span>

                <span className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-slate-400" />
                  {post.viewCount} {post.viewCount === 1 ? "view" : "views"}
                </span>
              </div>

              {likeError && (
                <p role="alert" className="text-xs font-medium text-rose-600">
                  {likeError}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-5 p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-emerald-600" />
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                Edit post
              </h2>
            </div>

            <div>
              <textarea
                value={content}
                onChange={(event) =>
                  setContent(event.target.value.slice(0, MAX_LENGTH))
                }
                maxLength={MAX_LENGTH}
                rows={6}
                aria-label="Post caption"
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-medium text-slate-700 transition-colors focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />

              <div className="mt-1.5 text-right text-[11px] font-semibold text-slate-400">
                {content.length}/{MAX_LENGTH}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Media
              </label>

              <div className="max-w-xs">
                <PostMediaPicker
                  file={newFile}
                  existingMediaUrl={post.media?.url ?? null}
                  existingMediaIsVideo={post.media?.type === "video"}
                  onSelectFile={setNewFile}
                  onClear={() => setNewFile(null)}
                />
              </div>

              {!newFile && post.media && (
                <p className="mt-1.5 text-[11px] font-medium text-slate-400">
                  Pick a new file to replace the current media.
                </p>
              )}
            </div>

            {saveError && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700"
              >
                {saveError}
              </div>
            )}

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={isSaving}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:bg-emerald-800 disabled:pointer-events-none disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Save changes
              </button>
            </div>
          </div>
        )}
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
        <h2 className="mb-4 text-base font-bold text-slate-900">
          Comments ({post.commentCount})
        </h2>

        <div className="mb-5 flex flex-col gap-3">
          <textarea
            value={commentContent}
            onChange={(event) =>
              setCommentContent(event.target.value.slice(0, MAX_LENGTH))
            }
            maxLength={MAX_LENGTH}
            rows={3}
            placeholder="Write a comment..."
            aria-label="Write a comment"
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />

          <button
            type="button"
            onClick={() => void handleCreateComment()}
            disabled={!commentContent.trim() || isCreatingComment}
            className="self-end rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {isCreatingComment ? "Posting..." : "Post comment"}
          </button>
        </div>

        {commentError && (
          <p role="alert" className="mb-3 text-sm text-rose-600">
            {commentError}
          </p>
        )}

        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <article
              key={comment.id}
              className="flex gap-3 border-t border-slate-100 pt-4"
            >
              {comment.profileImage ? (
                <Image
                  src={comment.profileImage}
                  alt={`${comment.username}'s profile`}
                  width={36}
                  height={36}
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                  {comment.username.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">
                    {comment.username}
                  </p>

                  <time className="text-xs text-slate-400">
                    {formatDate(comment.createdAt)}
                  </time>
                </div>

                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-600">
                  {comment.content}
                </p>
              </div>
            </article>
          ))}

          {comments.length === 0 && !isLoadingComments && (
            <p className="py-4 text-center text-sm text-slate-500">
              No comments yet. Be the first to comment.
            </p>
          )}

          {isLoadingComments && comments.length === 0 && (
            <p className="py-4 text-center text-sm text-slate-500">
              Loading comments...
            </p>
          )}

          {hasMoreComments && (
            <button
              type="button"
              onClick={() => {
                if (commentsCursor) {
                  void loadComments(commentsCursor);
                }
              }}
              disabled={isLoadingComments}
              className="self-center rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              {isLoadingComments ? "Loading..." : "Load more comments"}
            </button>
          )}
        </div>
      </section>

      {deleteError && (
        <p role="alert" className="text-sm font-medium text-rose-600">
          {deleteError}
        </p>
      )}

      <DeletePostModal
        open={isDeleteOpen}
        isDeleting={isDeleting}
        onCancel={() => {
          if (!isDeleting) {
            setIsDeleteOpen(false);
          }
        }}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}