"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  Heart,
  Loader2,
  MessageCircle,
  Pencil,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { userPostService } from "@/services/user/userPost.service";
import type { PostDetailsResponseDTO } from "@/dtos/user/post/post-response.dto";
import { PostMediaViewer } from "@/components/user/posts/PostMediaViewer";
import { PostMediaPicker } from "@/components/user/posts/PostMediaPicker";
import { PostsErrorState } from "@/components/user/posts/PostsErrorsState";
import { DeletePostModal } from "@/components/user/posts/DeletePostModel";

const MAX_LENGTH = 2000;

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function PostDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [post, setPost] = useState<PostDetailsResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  // Newly picked file for this edit session. Existing server media (post.media)
  // is shown until the user picks a new file — there's no DTO field to signal
  // "remove media" (UpdatePostDTO only has `content`), so removal isn't wired here.
  const [newFile, setNewFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadPost = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const response = await userPostService.getPostDetails(params.id);
      setPost(response.data);
      setContent(response.data.content ?? "");
    } catch (err) {
      setLoadError(
        err instanceof Error ? err : new Error("Failed to load post"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    if (searchParams.get("edit") === "true") setIsEditing(true);
  }, [searchParams]);

  const trimmedContent = content.trim();

  const handleSave = async () => {
    if (!post) return;
    if (!trimmedContent && !newFile && !post.media) {
      setSaveError("Add a caption or attach media before saving.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    try {
      const response = await userPostService.updatePost(
        post._id,
        { content: trimmedContent || undefined },
        newFile ?? undefined,
      );
      setPost(response.data);
      setNewFile(null);
      setIsEditing(false);
      router.replace(`/user/posts/${post._id}`);
    } catch {
      setSaveError("We couldn't save your changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (!post) return;
    setContent(post.content ?? "");
    setNewFile(null);
    setSaveError(null);
    setIsEditing(false);
    router.replace(`/user/posts/${post._id}`);
  };

  const handleDelete = async () => {
    if (!post) return;
    setIsDeleting(true);
    try {
      await userPostService.deletePost(post._id);
      router.push("/user/posts");
    } catch {
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
        <PostsErrorState onRetry={loadPost} />
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
              <PostMediaViewer media={post.media} className="rounded-t-2xl" />
            )}

            <div className="flex flex-col gap-4 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {formatDate(post.createdAt)}
                </span>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeleteOpen(true)}
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

              <div className="flex items-center gap-5 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Heart className="h-4 w-4 text-rose-500" />
                  {post.likeCount} likes
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="h-4 w-4 text-emerald-600" />
                  {post.commentCount} comments
                </span>
                <span className="flex items-center gap-1.5">
                  <Bookmark className="h-4 w-4 text-amber-500" />
                  {post.bookmarkCount} bookmarks
                </span>
              </div>
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
                onChange={(e) =>
                  setContent(e.target.value.slice(0, MAX_LENGTH))
                }
                rows={6}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-medium text-slate-700 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
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
                onClick={handleSave}
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

      <DeletePostModal
        open={isDeleteOpen}
        isDeleting={isDeleting}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
