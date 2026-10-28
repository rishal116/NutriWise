"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  Heart,
  MessageCircle,
  Eye,
  Trash2,
  LoaderCircle,
  RefreshCw,
  UserRound,
} from "lucide-react";

import { adminPostService } from "@/services/admin/admin-post.service";
import type { AdminPostListItemDTO } from "@/dtos/admin/post/admin-post-list-item.dto";

const PAGE_SIZE = 10;

export default function AdminPosts() {
  const [posts, setPosts] = useState<AdminPostListItemDTO[]>([]);
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadPosts = useCallback(
    async (nextCursor?: string, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await adminPostService.getPosts({
          limit: PAGE_SIZE,
          cursor: nextCursor,
        });

        if (!response.success || !response.data) {
          toast.error(response.message || "Unable to load posts.");
          return;
        }

        const result = response.data;

        setPosts((previous) =>
          append ? [...previous, ...result.items] : result.items,
        );
        setCursor(result.nextCursor ?? undefined);
        setHasMore(result.hasMore);
      } catch {
        toast.error("Unable to load posts.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const handleDelete = async (postId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action may be permanent.",
    );

    if (!confirmed) return;

    setDeletingId(postId);

    try {
      await adminPostService.deletePost(postId);
      setPosts((previous) => previous.filter((post) => post.id !== postId));
      toast.success("Post deleted successfully.");
    } catch {
      toast.error("Unable to delete post.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="size-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage Posts
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Review community posts and manage inappropriate content.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadPosts()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <RefreshCw className="size-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Loaded posts" value={posts.length} />
        <StatCard
          label="Total likes"
          value={posts.reduce((total, post) => total + post.likeCount, 0)}
        />
        <StatCard
          label="Total comments"
          value={posts.reduce((total, post) => total + post.commentCount, 0)}
        />
      </div>

      {loading ? (
        <LoadingState />
      ) : posts.length === 0 ? (
        <EmptyState message="No posts found." />
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.id}
              className="min-w-0 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {post.author.profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.author.profileImage}
                      alt={post.author.fullName}
                      className="size-10 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <UserRound className="size-5 text-gray-500" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900 dark:text-white">
                      {post.author.fullName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void handleDelete(post.id)}
                  disabled={deletingId === post.id}
                  aria-label={`Delete post by ${post.author.fullName}`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950"
                >
                  {deletingId === post.id ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                  Delete
                </button>
              </div>

              {post.content && (
                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700 dark:text-gray-300">
                  {post.content}
                </p>
              )}

              {post.media && (
                <div className="mt-4 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                  {post.media.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.media.url}
                      alt="Post media"
                      loading="lazy"
                      className="max-h-80 w-full object-contain"
                    />
                  ) : post.media.type === "video" ? (
                    <video
                      src={post.media.url}
                      controls
                      preload="metadata"
                      className="max-h-80 w-full"
                    >
                      Your browser does not support video playback.
                    </video>
                  ) : (
                    <a
                      href={post.media.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block break-all p-4 text-sm text-emerald-700 underline dark:text-emerald-400"
                    >
                      Open post media
                    </a>
                  )}
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-5 border-t border-gray-100 pt-4 text-sm text-gray-500 dark:border-gray-800">
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="size-4" />
                  {post.viewCount} views
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Heart className="size-4" />
                  {post.likeCount} likes
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MessageCircle className="size-4" />
                  {post.commentCount} comments
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => void loadPosts(cursor, true)}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loadingMore && (
              <LoaderCircle className="size-4 animate-spin" />
            )}
            {loadingMore ? "Loading..." : "Load more posts"}
          </button>
        </div>
      )}
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-gray-500">
      <LoaderCircle className="size-5 animate-spin" />
      Loading posts...
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 px-6 py-16 text-center dark:border-gray-700">
      <FileText className="mx-auto size-10 text-gray-400" />
      <p className="mt-3 font-medium text-gray-700 dark:text-gray-300">
        {message}
      </p>
    </div>
  );
}