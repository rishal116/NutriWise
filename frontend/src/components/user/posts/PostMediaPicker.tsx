"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
];

const MAX_SIZE_MB = 25;

interface PostMediaPickerProps {
  file: File | null;
  existingMediaUrl?: string | null;
  existingMediaIsVideo?: boolean;
  onSelectFile: (file: File | null) => void;
  onClear: () => void;
}

export function PostMediaPicker({
  file,
  existingMediaUrl,
  existingMediaIsVideo,
  onSelectFile,
  onClear,
}: PostMediaPickerProps) {
  const [error, setError] = useState<string | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!file) {
      setLocalPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const previewUrl = localPreviewUrl ?? existingMediaUrl ?? null;
  const isVideo = file
    ? file.type.startsWith("video/")
    : Boolean(existingMediaIsVideo);

  const isGif = file
    ? file.type === "image/gif"
    : Boolean(previewUrl?.toLowerCase().split("?")[0].endsWith(".gif"));

  const handleFile = (candidate: File) => {
    setError(null);

    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      setError(
        "Unsupported file type. Use JPEG, PNG, WebP, GIF, MP4, or WebM.",
      );
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (candidate.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    onSelectFile(candidate);
  };

  const handleClear = () => {
    onClear();
    setError(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  if (previewUrl) {
    return (
      <div>
        <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          {isVideo ? (
            <video
              key={previewUrl}
              src={previewUrl}
              controls
              playsInline
              preload="metadata"
              className="block max-h-96 w-full object-contain"
            >
              Your browser does not support video playback.
            </video>
          ) : (
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={previewUrl}
                alt="Post media preview"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          )}

          {isGif && (
            <span className="absolute left-2 top-2 rounded-full bg-slate-900/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              GIF
            </span>
          )}

          <button
            type="button"
            onClick={handleClear}
            aria-label="Remove media"
            className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/70 text-white transition-colors hover:bg-slate-900"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-2 text-xs font-medium text-rose-600">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Choose a different file
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={(e) => {
            const picked = e.target.files?.[0];
            if (picked) handleFile(picked);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40 hover:text-emerald-600"
      >
        <ImagePlus className="h-6 w-6" />
        <span className="text-xs font-semibold">Add photo, video, or GIF</span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
          Optional · up to {MAX_SIZE_MB}MB
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          const picked = e.target.files?.[0];
          if (picked) handleFile(picked);
        }}
      />

      {error && (
        <p role="alert" className="mt-2 text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
