"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Crop, ImagePlus, RefreshCw, Upload, Video, X } from "lucide-react";

interface MediaCardProps {
  type: "image" | "video";
  file: File | null;
  existingUrl?: string;
  onSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  disabled: boolean;
  cropRequired?: boolean;
}

export default function MediaCard({
  type,
  file,
  existingUrl,
  onSelect,
  onRemove,
  disabled,
  cropRequired,
}: MediaCardProps) {
  const [filePreview, setFilePreview] = useState<string>();

  const isImage = type === "image";
  const previewUrl = filePreview ?? existingUrl;

  useEffect(() => {
    if (!file) {
      setFilePreview(undefined);
      return;
    }

    const url = URL.createObjectURL(file);
    setFilePreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const accept = isImage
    ? "image/jpeg,image/png,image/webp"
    : "video/mp4,video/webm,video/quicktime";

  return (
    <div className="overflow-hidden rounded-2xl border border-admin-border bg-admin-surface">
      <div className="flex items-center justify-between border-b border-admin-border px-4 py-3">
        <div className="flex items-center gap-2">
          {isImage ? (
            <ImagePlus className="h-4 w-4 text-admin-accent" />
          ) : (
            <Video className="h-4 w-4 text-admin-accent" />
          )}

          <div>
            <p className="text-xs font-bold text-admin-text">
              {isImage ? "Activity Image" : "Activity Video"}
            </p>

            <p className="text-[11px] text-admin-muted">
              {isImage ? "16:9 recommended" : "Short demonstration clip"}
            </p>
          </div>
        </div>

        {previewUrl && (
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            aria-label={`Remove ${type}`}
            className="rounded-lg p-1.5 text-admin-muted transition-colors hover:bg-admin-danger-soft hover:text-admin-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-danger/50 disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {previewUrl ? (
        <div className="p-3">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-admin-bg">
            {isImage ? (
              <Image
                src={previewUrl}
                alt="Activity preview"
                fill
                unoptimized
                className="object-contain"
              />
            ) : (
              <video
                src={previewUrl}
                controls
                preload="metadata"
                className="h-full w-full object-contain"
              />
            )}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <p className="min-w-0 truncate text-xs font-medium text-admin-muted">
              {file?.name ?? "Existing media"}
            </p>

            <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-admin-bg px-2.5 py-1.5 text-[11px] font-bold text-admin-text transition-colors hover:bg-admin-pastel-green focus-within:ring-2 focus-within:ring-admin-accent/60">
              <RefreshCw className="h-3.5 w-3.5" />
              Replace
              <input
                type="file"
                accept={accept}
                className="sr-only"
                disabled={disabled}
                onChange={onSelect}
              />
            </label>
          </div>

          {isImage && cropRequired && (
            <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-admin-success">
              <Crop className="h-3.5 w-3.5" />
              Cropped to 16:9
            </div>
          )}
        </div>
      ) : (
        <label className="m-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-admin-border bg-admin-surface-hover px-4 py-8 text-center transition-colors hover:border-admin-accent/50 hover:bg-admin-pastel-green/40 focus-within:ring-2 focus-within:ring-admin-accent/60">
          {isImage ? (
            <ImagePlus className="h-7 w-7 text-admin-muted" />
          ) : (
            <Video className="h-7 w-7 text-admin-muted" />
          )}

          <p className="mt-3 text-xs font-bold text-admin-text">
            Upload {isImage ? "image" : "video"}
          </p>

          <p className="mt-1 max-w-[220px] text-[11px] leading-5 text-admin-muted">
            {isImage
              ? "JPG, PNG or WEBP · Max 5MB"
              : "MP4, WEBM or MOV · Max 50MB · Up to 2 minutes"}
          </p>

          <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-admin-surface px-3 py-1.5 text-[11px] font-bold text-admin-text shadow-sm shadow-admin-text/5">
            <Upload className="h-3.5 w-3.5" />
            Choose file
          </span>

          <input
            type="file"
            accept={accept}
            className="sr-only"
            disabled={disabled}
            onChange={onSelect}
          />
        </label>
      )}
    </div>
  );
}
