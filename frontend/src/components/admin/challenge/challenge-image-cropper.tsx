"use client";

import { useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { X } from "lucide-react";

import type {
  CropTarget,
  createCroppedFile,
  IMAGE_CONFIG,
} from "@/utils/challenge-form.utils";

interface ChallengeImageCropperProps {
  target: CropTarget;
  onDone: (file: File) => void;
  onCancel: () => void;
}

export default function ChallengeImageCropper({
  target,
  onDone,
  onCancel,
}: ChallengeImageCropperProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(target.file);

    setImageUrl(url);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setError(null);

    return () => URL.revokeObjectURL(url);
  }, [target.file]);

  const handleCropComplete = (_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  };

  const handleUseImage = async () => {
    if (!imageUrl || !croppedAreaPixels) return;

    try {
      setProcessing(true);
      setError(null);

      const file = await createCroppedFile(imageUrl, croppedAreaPixels);
      onDone(file);
    } catch {
      setError("Unable to process this image. Please try another image.");
      setProcessing(false);
    }
  };

  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
      <div className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Adjust thumbnail
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Drag to position the image and use the slider to zoom.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            aria-label="Close image cropper"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-auto p-4 sm:p-6">
          <div className="mx-auto w-full max-w-2xl">
            <div
              className="relative w-full overflow-hidden rounded-xl bg-slate-950"
              style={{ aspectRatio: IMAGE_CONFIG.aspectRatio }}
            >
              <Cropper
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                aspect={IMAGE_CONFIG.aspectRatio}
                cropShape="rect"
                showGrid
                objectFit="contain"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Zoom</span>
                <span>{Math.round(zoom * 100)}%</span>
              </div>

              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="mt-3 h-2 w-full cursor-pointer accent-emerald-600"
                aria-label="Image zoom"
              />
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
              Final image:{" "}
              <span className="font-semibold text-slate-700">
                {IMAGE_CONFIG.outputWidth} × {IMAGE_CONFIG.outputHeight}px
              </span>{" "}
              · {IMAGE_CONFIG.aspectLabel}
            </div>

            {error && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => void handleUseImage()}
            disabled={processing || !croppedAreaPixels}
            className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {processing ? "Processing..." : "Use Image"}
          </button>
        </div>
      </div>
    </div>
  );
}
