"use client";

import {
  ChangeEvent,
  DragEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import {
  ImagePlus,
  Loader2,
  RefreshCcw,
  Trash2,
  Upload,
  X,
  ZoomIn,
} from "lucide-react";

interface ImageCropUploadProps {
  existingImageUrl?: string;
  aspect?: number;
  maxFileSizeMB?: number;
  onChange: (file: File | null) => void;
  onRemoveExisting?: () => void;
  disabled?: boolean;
}

export default function ImageCropUpload({
  existingImageUrl,
  aspect = 16 / 9,
  maxFileSizeMB = 5,
  onChange,
  onRemoveExisting,
  disabled = false,
}: ImageCropUploadProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(
    existingImageUrl ?? null,
  );

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile && existingImageUrl) {
      setImageSrc(existingImageUrl);
    }
  }, [existingImageUrl, selectedFile]);

  useEffect(() => {
    return () => {
      if (imageSrc?.startsWith("blob:")) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  const resetCropState = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  }, []);

  const validateFile = useCallback(
    (file: File): boolean => {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedTypes.includes(file.type)) {
        setError("Please select a JPG, PNG, or WebP image.");
        return false;
      }

      const maxSize = maxFileSizeMB * 1024 * 1024;

      if (file.size > maxSize) {
        setError(`Image size must be less than ${maxFileSizeMB}MB.`);
        return false;
      }

      return true;
    },
    [maxFileSizeMB],
  );

  const loadImage = useCallback(
    (file: File) => {
      if (!validateFile(file)) {
        return;
      }

      setError(null);

      if (imageSrc?.startsWith("blob:")) {
        URL.revokeObjectURL(imageSrc);
      }

      const objectUrl = URL.createObjectURL(file);

      setSelectedFile(file);
      setImageSrc(objectUrl);
      setIsCropping(true);
      resetCropState();
    },
    [imageSrc, resetCropState, validateFile],
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    loadImage(file);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    const file = event.dataTransfer.files?.[0];

    if (!file) {
      return;
    }

    loadImage(file);
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleCropComplete = useCallback(
    (_croppedArea: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
    },
    [],
  );

  const createCroppedFile = async (): Promise<File> => {
    if (!imageSrc || !croppedAreaPixels) {
      throw new Error("Image crop data is missing.");
    }

    const image = new window.Image();
    image.src = imageSrc;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Failed to load image."));
    });

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(croppedAreaPixels.width);
    canvas.height = Math.round(croppedAreaPixels.height);

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Could not create canvas context.");
    }

    context.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
    );

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((result) => resolve(result), "image/jpeg", 0.9);
    });

    if (!blob) {
      throw new Error("Failed to create cropped image.");
    }

    return new File([blob], selectedFile?.name ?? "challenge-thumbnail.jpg", {
      type: "image/jpeg",
    });
  };

  const handleUseImage = async () => {
    try {
      setError(null);

      const croppedFile = await createCroppedFile();

      onChange(croppedFile);
      setIsCropping(false);
    } catch (err) {
      console.error(err);
      setError("Failed to process image. Please try again.");
    }
  };

  const handleReplace = () => {
    if (disabled) {
      return;
    }

    setIsCropping(false);
    setSelectedFile(null);
    setError(null);
    resetCropState();

    if (imageSrc?.startsWith("blob:")) {
      URL.revokeObjectURL(imageSrc);
    }

    setImageSrc(existingImageUrl ?? null);
  };

  const handleRemove = () => {
    if (disabled) {
      return;
    }

    if (imageSrc?.startsWith("blob:")) {
      URL.revokeObjectURL(imageSrc);
    }

    setSelectedFile(null);
    setImageSrc(null);
    setIsCropping(false);
    setError(null);
    resetCropState();

    onChange(null);
    onRemoveExisting?.();
  };

  const hasImage = Boolean(imageSrc);
  const isBlobSrc = imageSrc?.startsWith("blob:") ?? false;

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          <X className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {!hasImage && !isCropping && (
        <label
          htmlFor="image-crop-upload"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center transition-all duration-200 ${
            disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:border-teal-400 hover:bg-teal-50/40 hover:shadow-sm"
          }`}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm ring-1 ring-slate-200 transition-transform duration-200 group-hover:scale-105 group-hover:ring-teal-300">
            <ImagePlus className="h-8 w-8" />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-800">
            Upload an image
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Click to browse or drag and drop
          </p>

          <span className="mt-3 inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-400 ring-1 ring-slate-200">
            JPG, PNG or WebP · Max {maxFileSizeMB}MB
          </span>

          <input
            id="image-crop-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={disabled}
            className="sr-only"
          />
        </label>
      )}

      {hasImage && !isCropping && imageSrc && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
            <Image
              src={imageSrc}
              alt="Selected image preview"
              fill
              unoptimized={isBlobSrc}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 640px"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-4">
            <p className="text-xs font-medium text-slate-400">
              Image ready to use
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReplace}
                disabled={disabled}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCcw className="h-4 w-4" />
                Replace
              </button>

              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {isCropping && imageSrc && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-[360px] w-full bg-slate-950 sm:h-[420px]">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
              objectFit="contain"
            />
          </div>

          <div className="space-y-4 p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <ZoomIn className="h-4 w-4 shrink-0 text-slate-400" />

              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="h-2 w-full cursor-pointer accent-teal-700"
                aria-label="Zoom image"
              />

              <span className="w-10 text-right text-xs font-medium text-slate-400">
                {zoom.toFixed(1)}x
              </span>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleReplace}
                disabled={disabled}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCcw className="h-4 w-4" />
                Replace
              </button>

              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>

              <button
                type="button"
                onClick={handleUseImage}
                disabled={disabled}
                className="inline-flex flex-[1.5] items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {disabled ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Use Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
