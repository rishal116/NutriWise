
"use client";

import { useRef } from "react";
import Image from "next/image";
import { Image as ImageIcon, Upload, X } from "lucide-react";

import type { ImageState } from "./challenge-form.types";
import { IMAGE_CONFIG } from "./image-config";

interface ThumbnailFieldProps {
  state: ImageState;
  onSelect: (file: File) => void;
  onRemove: () => void;
  disabled: boolean;
}

export default function ThumbnailField({
  state,
  onSelect,
  onRemove,
  disabled,
}: ThumbnailFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewUrl = state.previewUrl ?? state.existingUrl ?? null;

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (file) {
      onSelect(file);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <label className="text-sm font-medium text-slate-700">
          {IMAGE_CONFIG.label}
        </label>

        <p className="mt-0.5 text-xs leading-5 text-slate-400">
          {IMAGE_CONFIG.description}
        </p>
      </div>

      <div
        className={[
          "overflow-hidden rounded-2xl border transition",
          previewUrl
            ? "border-slate-200 bg-slate-50"
            : "border-2 border-dashed border-slate-200 bg-slate-50 hover:border-emerald-300",
        ].join(" ")}
      >
        {previewUrl ? (
          <>
            <div
              className="relative w-full"
              style={{ aspectRatio: IMAGE_CONFIG.aspectRatio }}
            >
              <Image
                src={previewUrl}
                alt="Challenge thumbnail preview"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={Boolean(state.previewUrl)}
                className="object-cover"
              />

              <button
                type="button"
                disabled={disabled}
                onClick={onRemove}
                aria-label="Remove thumbnail"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md transition hover:text-red-600 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-10">
                <p className="truncate text-xs font-medium text-white">
                  {state.file?.name ?? "Existing image"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white p-3">
              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Challenge thumbnail
                </p>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  {IMAGE_CONFIG.outputWidth} ×{" "}
                  {IMAGE_CONFIG.outputHeight}px ·{" "}
                  {IMAGE_CONFIG.aspectLabel}
                </p>
              </div>

              <button
                type="button"
                disabled={disabled}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <Upload className="h-3.5 w-3.5" />
                Replace
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-56 w-full flex-col items-center justify-center px-6 py-8 text-center disabled:opacity-50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-700">
              <ImageIcon className="h-5 w-5" />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-800">
              Upload thumbnail
            </p>

            <p className="mt-1 text-xs text-slate-400">
              JPG, PNG, or WebP · up to{" "}
              {IMAGE_CONFIG.maxFileSizeMB} MB
            </p>

            <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white">
              <Upload className="h-3.5 w-3.5" />
              Choose Image
            </span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={IMAGE_CONFIG.accept}
          className="hidden"
          disabled={disabled}
          onChange={handleFileChange}
        />
      </div>

      <p className="mt-2 text-[11px] text-slate-400">
        Recommended:{" "}
        <span className="font-medium text-slate-500">
          {IMAGE_CONFIG.outputWidth} × {IMAGE_CONFIG.outputHeight}px
        </span>
      </p>
    </div>
  );
}
