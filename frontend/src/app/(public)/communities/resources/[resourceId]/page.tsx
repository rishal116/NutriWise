"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Bookmark,
  Eye,
  FileText,
  Heart,
  MessageCircle,
  Send,
  Trash2,
  User as UserIcon,
} from "lucide-react";

import { publicResourceService } from "@/services/public/publicResource.service";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useAppSelector } from "@/redux/hooks";

import type {
  PublicResourceDetailsDTO,
  PublicResourceCommentDTO,
} from "@/dtos/public/resource/public-resource-details.dto";

export default function ResourceDetailsPage() {
  const { resourceId } = useParams<{ resourceId: string }>();
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [resource, setResource] = useState<PublicResourceDetailsDTO | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [liking, setLiking] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  );

  const viewRecordedFor = useRef<string | null>(null);

  const fetchResource = async () => {
    try {
      const response =
        await publicResourceService.getResourceDetails(resourceId);
      setResource(response.data);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    if (!resourceId) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const response =
          await publicResourceService.getResourceDetails(resourceId);
        if (cancelled) return;
        setResource(response.data);
      } catch (err) {
        if (cancelled) return;
        setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [resourceId]);

  useEffect(() => {
    if (!resource || viewRecordedFor.current === resourceId) return;

    viewRecordedFor.current = resourceId;
    publicResourceService.recordView(resourceId).catch(() => {});
  }, [resource, resourceId]);

  const requireAuth = () => {
    if (currentUser) return true;
    router.push(`/login?redirect=/resources/${resourceId}`);
    return false;
  };

  const handleToggleLike = async () => {
    if (!requireAuth() || !resource || liking) return;

    const previous = resource;
    const nextLiked = !resource.isLiked;

    setLiking(true);
    setResource({
      ...resource,
      isLiked: nextLiked,
      likeCount: resource.likeCount + (nextLiked ? 1 : -1),
    });

    try {
      if (nextLiked) {
        await publicResourceService.likeResource(resourceId);
      } else {
        await publicResourceService.unlikeResource(resourceId);
      }
    } catch (err) {
      setResource(previous);
      setError(getErrorMessage(err));
    } finally {
      setLiking(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!requireAuth() || !resource || bookmarking) return;

    const previous = resource;
    const nextBookmarked = !resource.isBookmarked;

    setBookmarking(true);
    setResource({
      ...resource,
      isBookmarked: nextBookmarked,
      bookmarkCount: resource.bookmarkCount + (nextBookmarked ? 1 : -1),
    });

    try {
      if (nextBookmarked) {
        await publicResourceService.bookmarkResource(resourceId);
      } else {
        await publicResourceService.unbookmarkResource(resourceId);
      }
    } catch (err) {
      setResource(previous);
      setError(getErrorMessage(err));
    } finally {
      setBookmarking(false);
    }
  };

  const handleAddComment = async () => {
    const content = commentText.trim();
    if (!requireAuth() || !content || submittingComment) return;

    setSubmittingComment(true);
    try {
      await publicResourceService.addResourceComment(resourceId, content);
      setCommentText("");
      await fetchResource();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!resource || deletingCommentId) return;

    const previous = resource;
    setDeletingCommentId(commentId);
    setResource({
      ...resource,
      comments: resource.comments.filter((c) => c.commentId !== commentId),
      commentCount: Math.max(0, resource.commentCount - 1),
    });

    try {
      await publicResourceService.deleteResourceComment(commentId);
    } catch (err) {
      setResource(previous);
      setError(getErrorMessage(err));
    } finally {
      setDeletingCommentId(null);
    }
  };

  if (loading) {
    return <ResourceDetailsSkeleton />;
  }

  if (error && !resource) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-rose-600">{error}</p>
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
        {resource.thumbnailUrl && (
          <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-xs">
            <Image
              src={resource.thumbnailUrl}
              alt={resource.title}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

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
            <Bookmark size={16} />
            {resource.bookmarkCount}
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
            onClick={handleToggleLike}
            disabled={liking}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-xs transition disabled:cursor-not-allowed disabled:opacity-50 ${
              resource.isLiked
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200/80 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
            }`}
          >
            <Heart
              size={16}
              className={resource.isLiked ? "fill-emerald-700" : ""}
            />
            {resource.isLiked ? "Liked" : "Like"}
          </button>

          <button
            onClick={handleToggleBookmark}
            disabled={bookmarking}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-xs transition disabled:cursor-not-allowed disabled:opacity-50 ${
              resource.isBookmarked
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200/80 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
            }`}
          >
            <Bookmark
              size={16}
              className={resource.isBookmarked ? "fill-emerald-700" : ""}
            />
            {resource.isBookmarked ? "Bookmarked" : "Bookmark"}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-xs font-medium text-rose-600">{error}</p>
        )}

        <div className="mt-10 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
          <ResourceBody resource={resource} />
        </div>

        <CommentsSection
          comments={resource.comments}
          currentUserId={currentUser?.id}
          commentText={commentText}
          onCommentTextChange={setCommentText}
          onSubmit={handleAddComment}
          submitting={submittingComment}
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
  currentUserId,
  commentText,
  onCommentTextChange,
  onSubmit,
  submitting,
  deletingCommentId,
  onDelete,
  isAuthenticated,
}: {
  comments: PublicResourceCommentDTO[];
  currentUserId?: string;
  commentText: string;
  onCommentTextChange: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  deletingCommentId: string | null;
  onDelete: (commentId: string) => void;
  isAuthenticated: boolean;
}) {
  return (
    <section className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
      <div className="flex items-center gap-2">
        <span className="h-5 w-1 rounded-full bg-emerald-600" />
        <h2 className="text-base font-bold tracking-tight text-slate-900">
          Comments ({comments.length})
        </h2>
      </div>

      <div className="mt-5 flex items-start gap-3">
        <textarea
          value={commentText}
          onChange={(e) => onCommentTextChange(e.target.value)}
          placeholder={
            isAuthenticated ? "Add a comment..." : "Sign in to comment"
          }
          disabled={!isAuthenticated || submitting}
          rows={2}
          className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          onClick={onSubmit}
          disabled={!isAuthenticated || submitting || !commentText.trim()}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-xs transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Post comment"
        >
          <Send size={15} />
        </button>
      </div>

      <ul className="mt-6 space-y-4">
        {comments.length === 0 && (
          <li className="text-sm text-slate-500">
            No comments yet. Be the first to share your thoughts.
          </li>
        )}

        {comments.map((comment) => (
          <li key={comment.commentId} className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <UserIcon size={15} />
            </div>

            <div className="min-w-0 flex-1 rounded-xl bg-slate-50 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-900">
                  {comment.userId === currentUserId ? "You" : "User"}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-slate-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                    {comment.isEdited && " · edited"}
                  </span>
                  {comment.userId === currentUserId && (
                    <button
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
        ))}
      </ul>
    </section>
  );
}

function ResourceBody({ resource }: { resource: PublicResourceDetailsDTO }) {
  switch (resource.type) {
    case "article":
      return resource.content ? (
        <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
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
            sizes="768px"
            className="object-contain"
          />
        </div>
      ) : (
        <EmptyBody />
      );

    case "video":
      if (resource.fileUrl) {
        return (
          <video controls className="w-full rounded-xl bg-black">
            <source src={resource.fileUrl} />
          </video>
        );
      }
      return <EmptyBody />;

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
        <div className="mb-8 aspect-video rounded-2xl bg-slate-200" />
        <div className="h-3 w-32 rounded bg-slate-200" />
        <div className="mt-3 h-8 w-3/4 rounded bg-slate-200" />
        <div className="mt-4 h-4 w-full rounded bg-slate-200" />
        <div className="mt-2 h-4 w-2/3 rounded bg-slate-200" />
        <div className="mt-10 h-64 rounded-2xl bg-slate-200" />
      </div>
    </main>
  );
}
