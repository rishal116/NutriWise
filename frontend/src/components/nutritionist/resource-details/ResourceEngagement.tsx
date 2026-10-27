"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, Heart, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { resourceViewService } from "@/services/resource/resource-view.service";
import { resourceLikeService } from "@/services/resource/resource-like.service";

interface ResourceEngagementProps {
  resourceId: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isViewed: boolean;
  onLikeStateChange: (isLiked: boolean) => void;
}

export default function ResourceEngagement({
  resourceId,
  viewCount,
  likeCount,
  commentCount,
  isLiked,
  isViewed,
  onLikeStateChange,
}: ResourceEngagementProps) {
  const viewedResource = useRef<string | null>(null);
  const [likes, setLikes] = useState(likeCount);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    setLikes(likeCount);
  }, [likeCount]);

  useEffect(() => {
    if (viewedResource.current === resourceId) return;

    viewedResource.current = resourceId;

    void resourceViewService.recordView(resourceId).catch(() => {
      // A failed view request should not block the details page.
    });
  }, [resourceId]);

  const toggleLike = async () => {
    if (liking) return;

    setLiking(true);

    try {
      if (isLiked) {
        await resourceLikeService.unlikeResource(resourceId);
        setLikes((count) => Math.max(0, count - 1));
        onLikeStateChange(false);
      } else {
        await resourceLikeService.likeResource(resourceId);
        setLikes((count) => count + 1);
        onLikeStateChange(true);
      }
    } catch {
      toast.error("Couldn't update your like. Please try again.");
    } finally {
      setLiking(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <h2 className="mb-4 text-sm font-bold text-slate-900">Engagement</h2>

      <div className="grid grid-cols-3 gap-3">
        <div
          className={`rounded-xl border p-3 ${
            isViewed
              ? "border-emerald-200 bg-emerald-50"
              : "border-slate-200/80 bg-slate-50"
          }`}
        >
          <Eye
            size={15}
            className={`mb-2 ${
              isViewed ? "text-emerald-600" : "text-slate-500"
            }`}
          />
          <p className="text-lg font-bold text-slate-800">{viewCount}</p>
          <p className="text-xs text-slate-500">
            {isViewed ? "Viewed" : "Views"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void toggleLike()}
          disabled={liking}
          aria-pressed={isLiked}
          aria-label={isLiked ? "Unlike resource" : "Like resource"}
          className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-left transition hover:bg-rose-50 disabled:opacity-60"
        >
          {liking ? (
            <Loader2 size={15} className="mb-2 animate-spin text-rose-600" />
          ) : (
            <Heart
              size={15}
              className={`mb-2 ${
                isLiked ? "fill-rose-600 text-rose-600" : "text-slate-500"
              }`}
            />
          )}
          <p className="text-lg font-bold text-slate-800">{likes}</p>
          <p className="text-xs text-slate-500">
            {isLiked ? "Unlike" : "Like"}
          </p>
        </button>

        <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3">
          <MessageSquare size={15} className="mb-2 text-slate-500" />
          <p className="text-lg font-bold text-slate-800">{commentCount}</p>
          <p className="text-xs text-slate-500">Comments</p>
        </div>
      </div>
    </section>
  );
}
