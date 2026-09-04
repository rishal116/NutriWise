import Image from "next/image";
import { Play } from "lucide-react";

import type { PostMediaResponseDTO } from "@/dtos/user/post/post-response.dto";

interface PostMediaViewerProps {
  media: PostMediaResponseDTO;
  className?: string;
}

export function PostMediaViewer({ media, className = "" }: PostMediaViewerProps) {
  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-slate-100 ${className}`}
    >
      {media.type === "video" ? (
        <>
          <video
            src={media.url}
            className="h-full w-full object-cover"
            muted
            preload="metadata"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-lg">
              <Play className="h-5 w-5 fill-slate-900 text-slate-900" />
            </span>
          </div>
        </>
      ) : (
        <Image
          src={media.url}
          alt=""
          fill
          unoptimized
          className="object-cover"
        />
      )}

      {media.type === "gif" && (
        <span className="absolute left-2 top-2 rounded-full bg-slate-900/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          GIF
        </span>
      )}
    </div>
  );
}