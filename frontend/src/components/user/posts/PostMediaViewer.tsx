"use client";

import Image from "next/image";

import type { PostMediaResponseDTO } from "@/dtos/user/post/post-response.dto";

interface PostMediaViewerProps {
  media: PostMediaResponseDTO;
  className?: string;
}

export function PostMediaViewer({
  media,
  className = "",
}: PostMediaViewerProps) {
  const isVideo = media.type === "video";
  const isGif =
    media.type === "gif" ||
    media.url.toLowerCase().split("?")[0].endsWith(".gif");

  return (
    <div
      className={`relative w-full overflow-hidden rounded-t-2xl bg-slate-100 ${
        isVideo ? "" : "aspect-[4/3]"
      } ${className}`}
    >
      {isVideo ? (
        <video
          src={media.url}
          controls
          playsInline
          preload="metadata"
          className="block max-h-[600px] w-full object-contain"
        >
          Your browser does not support video playback.
        </video>
      ) : (
        <>
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={media.url}
              alt="Post media"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          {isGif && (
            <span className="absolute left-2 top-2 rounded-full bg-slate-900/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              GIF
            </span>
          )}
        </>
      )}
    </div>
  );
}
