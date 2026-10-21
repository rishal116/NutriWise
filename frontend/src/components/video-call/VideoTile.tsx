"use client";

import { memo, useEffect, useRef } from "react";
import { VideoOff } from "lucide-react";

interface VideoTileProps {
  stream: MediaStream | null;
  label?: string;
  offText?: string;
  muted?: boolean;
  mirrored?: boolean;
  videoOff?: boolean;
  fit?: "cover" | "contain";
  /** Must provide positioning (relative/absolute) and size. */
  className?: string;
}

const VideoTile = ({
  stream,
  label,
  offText,
  muted = false,
  mirrored = false,
  videoOff = false,
  fit = "cover",
  className = "",
}: VideoTileProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = videoRef.current;
    if (element) element.srcObject = stream;
  }, [stream]);

  return (
    <div className={`overflow-hidden rounded-2xl bg-neutral-900 ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className={`h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"} ${
          mirrored ? "-scale-x-100" : ""
        } ${videoOff ? "invisible" : ""}`}
      />
      {videoOff && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-800">
          <VideoOff size={28} className="text-neutral-500" />
          {offText && <span className="text-sm text-neutral-400">{offText}</span>}
        </div>
      )}
      {label && (
        <span className="absolute bottom-2 left-3 text-sm font-medium text-white drop-shadow">
          {label}
        </span>
      )}
    </div>
  );
};

export default memo(VideoTile);