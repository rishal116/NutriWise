import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, MessageCircle } from "lucide-react";

import type { UserLikedPostResponseDTO } from "@/dtos/user/post/user-liked-post-response.dto";

interface LikedPostCardProps {
  post: UserLikedPostResponseDTO;
}

export function LikedPostCard({ post }: LikedPostCardProps) {
  const authorProfileUrl = `/user/${encodeURIComponent(post.author.authorId)}`;

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-center gap-3 p-4">
        <Link
          href={authorProfileUrl}
          className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gray-100"
          aria-label={`View ${post.author.name}'s profile`}
        >
          {post.author.profileImage ? (
            <Image
              src={post.author.profileImage}
              alt={post.author.name}
              fill
              sizes="44px"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-base font-semibold text-gray-500">
              {post.author.name.charAt(0).toUpperCase()}
            </span>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            href={authorProfileUrl}
            className="truncate text-sm font-semibold text-gray-900 hover:text-emerald-700"
          >
            {post.author.name}
          </Link>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600">
          <Heart className="h-3.5 w-3.5 fill-current" />
          Liked
        </span>
      </div>

      {post.content && (
        <p className="whitespace-pre-wrap break-words px-4 pb-4 text-sm leading-6 text-gray-800">
          {post.content}
        </p>
      )}

      {post.media && (
        <div className="relative w-full overflow-hidden bg-gray-50">
          {post.media.type === "image" ? (
            <Image
              src={post.media.url}
              alt="Post media"
              width={1200}
              height={800}
              sizes="(max-width: 768px) 100vw, 768px"
              className="h-auto max-h-[600px] w-full object-contain"
            />
          ) : (
            <video
              src={post.media.url}
              controls
              preload="metadata"
              className="max-h-[600px] w-full"
            >
              Your browser does not support video playback.
            </video>
          )}
        </div>
      )}

      <div className="flex items-center gap-5 border-t border-gray-100 px-4 py-3 text-sm text-gray-500">
        <span className="inline-flex items-center gap-1.5">
          <Heart className="h-4 w-4 text-rose-500" />
          {post.likeCount}
        </span>

        <span className="inline-flex items-center gap-1.5">
          <MessageCircle className="h-4 w-4" />
          {post.commentCount}
        </span>

        <span className="inline-flex items-center gap-1.5">
          <Eye className="h-4 w-4" />
          {post.viewCount}
        </span>
      </div>
    </article>
  );
}