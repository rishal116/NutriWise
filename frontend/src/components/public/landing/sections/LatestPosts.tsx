
import Link from "next/link";
import { ArrowUpRight, Heart, MessageCircle, Eye } from "lucide-react";

import type { PublicHomePostDTO } from "@/dtos/public/home/public-home-post.dto";
import { publicHomepageService } from "@/services/public/public-homepage.service";

import HomepageDataSection from "./HomepageDataSection";

function PostCard({ post }: { post: PublicHomePostDTO }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {post.media?.type === "image" && (
        <div
          role="img"
          aria-label="Community post image"
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url("${post.media.url}")` }}
        />
      )}

      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
            {post.author.fullName.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {post.author.fullName}
            </p>
            <p className="text-xs text-slate-500">
              @{post.author.username}
            </p>
          </div>
        </div>

        {post.content && (
          <p className="mt-5 line-clamp-4 whitespace-pre-line text-sm leading-7 text-slate-600">
            {post.content}
          </p>
        )}

        <div className="mt-6 flex items-center gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Heart size={15} />
            {post.likeCount}
          </span>

          <span className="flex items-center gap-1.5">
            <MessageCircle size={15} />
            {post.commentCount}
          </span>

          <span className="flex items-center gap-1.5">
            <Eye size={15} />
            {post.viewCount}
          </span>
        </div>

        <Link
          href="/communities/posts"
          className="mt-5 flex items-center gap-2 text-sm font-semibold text-emerald-700"
        >
          Explore community
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}

export default function LatestPosts() {
  return (
    <HomepageDataSection
      eyebrow="Community voices"
      title="What's happening in our community"
      description="Discover conversations, experiences, and helpful insights shared by our members."
      href="/communities/posts"
      fetchData={publicHomepageService.getLatestCommunityPosts}
      renderItem={(post) => <PostCard post={post} />}
    />
  );
}
