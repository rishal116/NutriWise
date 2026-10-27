"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Heart, MessageCircle } from "lucide-react";

import type { PostCardResponseDTO } from "@/dtos/user/post/post-response.dto";
import { PostActionsMenu } from "@/components/user/posts/PostActionMenu";
import { PostMediaViewer } from "@/components/user/posts/PostMediaViewer";
import { postLikeService } from "@/services/post/post-like.service";

interface PostCardProps {
  post: PostCardResponseDTO;
  onDelete: (post: PostCardResponseDTO) => void;
}

function formatDate(date: Date | string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const router = useRouter();

  const [isLikedByMe, setIsLikedByMe] = useState(post.isLikedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isUpdatingLike, setIsUpdatingLike] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);

  const handleToggleLike = async (): Promise<void> => {
    if (isUpdatingLike) {
      return;
    }

    const wasLiked = isLikedByMe;

    setIsUpdatingLike(true);
    setLikeError(null);

    try {
      if (wasLiked) {
        await postLikeService.unlikePost(post._id);
      } else {
        await postLikeService.likePost(post._id);
      }

      setIsLikedByMe(!wasLiked);
      setLikeCount((previous) =>
        Math.max(0, previous + (wasLiked ? -1 : 1)),
      );
    } catch (error: unknown) {
      setLikeError(
        error instanceof Error
          ? error.message
          : "Couldn't update your like. Please try again.",
      );
    } finally {
      setIsUpdatingLike(false);
    }
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:border-emerald-300 hover:shadow-lg">
      <Link
        href={`/user/posts/${post._id}`}
        className="flex flex-1 flex-col"
      >
        {post.media && <PostMediaViewer media={post.media} />}

        <div className="flex flex-1 flex-col gap-3 p-4">
          <p className="line-clamp-3 text-sm font-medium leading-relaxed text-slate-700">
            {post.content || (
              <span className="italic text-slate-400">No caption</span>
            )}
          </p>

          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {formatDate(post.createdAt)}
          </span>

          <div className="mt-auto flex items-center gap-4 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <Heart
                className={`h-3.5 w-3.5 ${
                  isLikedByMe
                    ? "fill-rose-500 text-rose-500"
                    : "text-rose-500"
                }`}
              />
              {likeCount}
            </span>

            <span className="flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
              {post.commentCount}
            </span>

            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-slate-400" />
              {post.viewCount}
            </span>
          </div>
        </div>
      </Link>

      {/* Keep the like button outside the Link to prevent navigation. */}
      <button
        type="button"
        onClick={() => void handleToggleLike()}
        disabled={isUpdatingLike}
        aria-pressed={isLikedByMe}
        aria-label={isLikedByMe ? "Unlike post" : "Like post"}
        title={isLikedByMe ? "Unlike post" : "Like post"}
        className="absolute bottom-[4.5rem] right-3 z-10 rounded-full bg-white/95 p-2 shadow-sm transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Heart
          className={`h-4 w-4 ${
            isLikedByMe
              ? "fill-rose-500 text-rose-500"
              : "text-slate-500"
          }`}
        />
      </button>

      {likeError && (
        <p
          role="alert"
          className="px-4 pb-2 text-xs text-rose-600"
        >
          {likeError}
        </p>
      )}

      <div className="absolute right-3 top-3 z-20">
        <PostActionsMenu
          onEdit={() => router.push(`/user/posts/${post._id}?edit=true`)}
          onDelete={() => onDelete(post)}
        />
      </div>
    </article>
  );
}