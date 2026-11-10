"use client";

import { useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

import type { CropTarget } from "./challenge-form.types";
import { IMAGE_CONFIG } from "./image-config";

const createImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load image."));
    image.src = src;
  });

const createCroppedFile = async (
  imageSrc: string,
  crop: Area,
): Promise<File> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");

  canvas.width = IMAGE_CONFIG.outputWidth;
  canvas.height = IMAGE_CONFIG.outputHeight;

  const context = canvas.getContext("2d");

  if (!context) throw new Error("Unable to create canvas.");

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.9),
  );

  if (!blob) throw new Error("Unable to process image.");

  return new File([blob], `challenge-${Date.now()}.jpg`, {
    type: "image/jpeg",
  });
};

interface ImageCropperProps {
  target: CropTarget;
  onDone: (file: File) => void;
  onCancel: () => void;
}

export default function ImageCropper({
  target,
  onDone,
  onCancel,
}: ImageCropperProps) {
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

  const handleUseImage = async () => {
    if (!imageUrl || !croppedAreaPixels || processing) return;

    try {
      setProcessing(true);
      setError(null);
      onDone(await createCroppedFile(imageUrl, croppedAreaPixels));
    } catch {
      setError("Unable to process image. Please try again.");
      setProcessing(false);
    }
  };

  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Crop thumbnail
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Adjust your image for the challenge card.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            aria-label="Close cropper"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Image */}
        <div className="bg-slate-50 p-5">
          <div
            className="relative mx-auto w-full max-w-[360px] overflow-hidden rounded-xl bg-slate-900 shadow-sm"
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
              onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
            />
          </div>

          {/* Zoom */}
          <div className="mx-auto mt-5 max-w-[360px]">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">Zoom</span>
              <span className="text-slate-500">{Math.round(zoom * 100)}%</span>
            </div>

            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="w-full cursor-pointer accent-emerald-600"
              aria-label="Image zoom"
            />
          </div>

          {error && (
            <p role="alert" className="mt-3 text-center text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => void handleUseImage()}
            disabled={processing || !croppedAreaPixels}
            className="rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {processing ? "Processing..." : "Apply crop"}
          </button>
        </div>
      </div>
    </div>
  );
}
