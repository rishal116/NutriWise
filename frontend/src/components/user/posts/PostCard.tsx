"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, Heart, MessageCircle } from "lucide-react";

import type { PostCardResponseDTO } from "@/dtos/user/post/post-response.dto";
import { PostActionsMenu } from "@/components/user/posts/PostActionMenu";
import { PostMediaViewer } from "@/components/user/posts/PostMediaViewer";

interface PostCardProps {
  post: PostCardResponseDTO;
  onDelete: (post: PostCardResponseDTO) => void;
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const router = useRouter();

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:border-emerald-300 hover:shadow-lg">
      <Link href={`/user/posts/${post._id}`} className="flex flex-1 flex-col">
        {post.media && <PostMediaViewer media={post.media} />}

        <div className="flex flex-1 flex-col gap-3 p-4">
          <p className="line-clamp-3 text-sm font-medium leading-relaxed text-slate-700">
            {post.content || <span className="italic text-slate-400">No caption</span>}
          </p>

          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {formatDate(post.createdAt)}
          </span>

          <div className="mt-auto flex items-center gap-4 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-rose-500" />
              {post.likeCount}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
              {post.commentCount}
            </span>
            <span className="flex items-center gap-1.5">
              <Bookmark className="h-3.5 w-3.5 text-amber-500" />
              {post.bookmarkCount}
            </span>
          </div>
        </div>
      </Link>

      <div className="absolute right-3 top-3">
        <PostActionsMenu
          onEdit={() => router.push(`/user/posts/${post._id}?edit=true`)}
          onDelete={() => onDelete(post)}
        />
      </div>
    </article>
  );
}