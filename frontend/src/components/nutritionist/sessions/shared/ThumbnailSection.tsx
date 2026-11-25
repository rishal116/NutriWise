"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import Image from "next/image";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { Crop, ImagePlus, X, ZoomIn, ZoomOut } from "lucide-react";

import { SESSION_LIMITS } from "@/constants/common/session-limits.constants";

import { SESSION_IMAGE_TYPES } from "./session-form.constants";
import { FormError } from "./FormError";
import { getCroppedImage } from "./image-crop.utils";

interface ThumbnailSectionProps {
  preview: string | null;
  error: string | null;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
  allowRemove?: boolean;
}

export function ThumbnailSection({
  preview,
  error,
  onFileChange,
  onRemove,
  allowRemove = true,
}: ThumbnailSectionProps) {
  const ids = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [cropError, setCropError] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const maxSizeInMB = SESSION_LIMITS.thumbnailMaxBytes / (1024 * 1024);

  useEffect(() => {
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  const openCropEditor = (file: File) => {
    const isAllowedType = SESSION_IMAGE_TYPES.some(
      (type) => type === file.type,
    );

    if (!isAllowedType) {
      setCropError("Choose a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > SESSION_LIMITS.thumbnailMaxBytes) {
      setCropError(`Image size cannot exceed ${maxSizeInMB} MB.`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    setImageSrc(objectUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedArea(null);
    setCropError(null);
    setIsCropping(true);
  };

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      openCropEditor(file);
    }

    event.target.value = "";
  };

  const handleCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  };

  const closeCropEditor = () => {
    if (isSaving) return;

    setIsCropping(false);
    setImageSrc(null);
    setCroppedArea(null);
    setCropError(null);
  };

  const handleCropSave = async () => {
    if (!imageSrc || !croppedArea || isSaving) return;

    setIsSaving(true);
    setCropError(null);

    try {
      const croppedFile = await getCroppedImage(imageSrc, croppedArea);

      const isAllowedType = SESSION_IMAGE_TYPES.some(
        (type) => type === croppedFile.type,
      );

      if (!isAllowedType) {
        throw new Error("The cropped image has an unsupported format.");
      }

      if (croppedFile.size > SESSION_LIMITS.thumbnailMaxBytes) {
        throw new Error(`The cropped image cannot exceed ${maxSizeInMB} MB.`);
      }

      onFileChange(croppedFile);

      setIsCropping(false);
      setImageSrc(null);
      setCroppedArea(null);
      setCropError(null);
    } catch (error) {
      setCropError(
        error instanceof Error
          ? error.message
          : "Unable to crop the image. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = () => {
    onRemove();
    setCropError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Thumbnail (optional)
        </h2>

        {preview ? (
          <div className="space-y-3">
            <div className="relative h-44 w-full max-w-sm overflow-hidden rounded-xl border border-slate-200">
              <Image
                src={preview}
                alt="Session thumbnail preview"
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 384px"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <ImagePlus className="h-4 w-4" />
                Replace
              </button>

              {allowRemove && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                >
                  <X className="h-4 w-4" />
                  Remove
                </button>
              )}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-32 w-full max-w-sm flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 transition hover:bg-slate-100"
          >
            <ImagePlus className="h-5 w-5" />

            <span className="text-sm font-semibold">Choose an image</span>

            <span className="text-xs">
              JPG, PNG or WebP · Maximum {maxSizeInMB} MB
            </span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={SESSION_IMAGE_TYPES.join(",")}
          className="hidden"
          onChange={handleFileSelection}
        />

        <FormError message={error ?? cropError ?? undefined} />
      </section>

      {isCropping && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${ids}-crop-title`}
            className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3
                  id={`${ids}-crop-title`}
                  className="font-semibold text-slate-800"
                >
                  Crop thumbnail
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Adjust the image before saving.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCropEditor}
                disabled={isSaving}
                aria-label="Close crop editor"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative h-72 w-full bg-slate-950 sm:h-96">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>

            <div className="space-y-4 p-5">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor={`${ids}-zoom`}
                    className="text-sm font-medium text-slate-700"
                  >
                    Zoom
                  </label>

                  <span className="text-xs text-slate-500">
                    {zoom.toFixed(1)}x
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <ZoomOut className="h-4 w-4 text-slate-500" />

                  <input
                    id={`${ids}-zoom`}
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(event) => setZoom(Number(event.target.value))}
                    className="w-full accent-emerald-600"
                    aria-label="Zoom thumbnail"
                  />

                  <ZoomIn className="h-4 w-4 text-slate-500" />
                </div>
              </div>

              {cropError && (
                <p role="alert" className="text-sm text-rose-600">
                  {cropError}
                </p>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeCropEditor}
                  disabled={isSaving}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleCropSave}
                  disabled={isSaving || !croppedArea}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Crop className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Apply crop"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
