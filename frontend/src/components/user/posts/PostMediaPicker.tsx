"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Play, X } from "lucide-react";

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
  /** Existing media URL/type from the server (edit mode only). Hidden once a new file is picked. */
  existingMediaUrl?: string | null;
  existingMediaIsVideo?: boolean;
  onSelectFile: (file: File | null) => void;
  /** Called when the user clears the picker — clears a newly picked file, or asks the
   *  parent to drop the existing media. Note: UpdatePostDTO has no field to tell the
   *  backend "remove media" — confirm with backend how a removal should be sent, if at all. */
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
  const isGif = file ? file.type === "image/gif" : false;

  const handleFile = (candidate: File) => {
    setError(null);

    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      setError(
        "Unsupported file type. Use JPEG, PNG, WEBP, GIF, MP4, or WEBM.",
      );
      return;
    }
    if (candidate.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too large — max ${MAX_SIZE_MB}MB.`);
      return;
    }

    onSelectFile(candidate);
  };

  if (previewUrl) {
    return (
      <div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          {isVideo ? (
            <>
              <video
                src={previewUrl}
                className="h-full w-full object-cover"
                muted
                preload="metadata"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg">
                  <Play className="h-4 w-4 fill-slate-900 text-slate-900" />
                </span>
              </div>
            </>
          ) : (
            <Image
              src={previewUrl}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
          )}

          {isGif && (
            <span className="absolute left-2 top-2 rounded-full bg-slate-900/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              GIF
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              onClear();
              setError(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/70 text-white transition-colors hover:bg-slate-900"
            aria-label="Remove media"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        {error && (
          <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>
        )}
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
        <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>
      )}
    </div>
  );
}
