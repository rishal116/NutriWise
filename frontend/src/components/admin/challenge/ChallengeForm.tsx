"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Cropper, { type Area } from "react-easy-crop";
import type { LucideIcon } from "lucide-react";

import {
  ClipboardList,
  Image as ImageIcon,
  ListChecks,
  Settings2,
  Upload,
  X,
} from "lucide-react";

import { z } from "zod";

import {
  CHALLENGE_ACCESS_TYPES,
  CHALLENGE_CATEGORIES,
  CHALLENGE_DIFFICULTIES,
} from "@/types/admin/challenge/challenge.types";

import type { CreateChallengeDTO } from "@/dtos/admin/challenge/create-challenge.dto";
import { adminChallengeService } from "@/services/admin/admin-challenge.service";

interface ChallengeFormProps {
  mode: "create" | "edit";
  challengeId?: string;
  initialValues?: Partial<CreateChallengeDTO> & {
    thumbnailUrl?: string;
  };
}

type ChallengeFormState = CreateChallengeDTO & {
  thumbnailUrl?: string;
};

interface ImageConfig {
  label: string;
  description: string;
  aspectRatio: number;
  aspectLabel: string;
  outputWidth: number;
  outputHeight: number;
  accept: string;
  maxFileSizeMB: number;
}

interface ImageState {
  file: File | null;
  previewUrl: string | null;
  existingUrl?: string;
  removed: boolean;
}

interface CropTarget {
  file: File;
}

const IMAGE_CONFIG: ImageConfig = {
  label: "Thumbnail",
  description: "Used for challenge cards and discovery sections.",
  aspectRatio: 2 / 3,
  aspectLabel: "2:3 portrait",
  outputWidth: 600,
  outputHeight: 900,
  accept: "image/jpeg,image/png,image/webp",
  maxFileSizeMB: 5,
};

const imageFileSchema = z
  .instanceof(File, { message: "Please select a valid image file." })
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    { message: "Only JPG, PNG, and WebP images are supported." },
  )
  .refine((file) => file.size <= IMAGE_CONFIG.maxFileSizeMB * 1024 * 1024, {
    message: `Image size must be ${IMAGE_CONFIG.maxFileSizeMB} MB or smaller.`,
  });

const defaultFormState: ChallengeFormState = {
  title: "",
  description: "",
  instructions: "",
  thumbnailUrl: "",
  category: "nutrition",
  difficulty: "beginner",
  accessType: "free",
  durationDays: 7,
};

const selectClassName =
  "h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20stroke%3D%22%2394a3b8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M4%206l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[right_0.9rem_center] bg-no-repeat px-3.5 pr-9 text-sm capitalize text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

const inputClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

const textareaClassName =
  "w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-700">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-0.5 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

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

  if (!context) {
    throw new Error("Unable to create the image processing canvas.");
  }

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
    IMAGE_CONFIG.outputWidth,
    IMAGE_CONFIG.outputHeight,
  );

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", 0.9);
  });

  if (!blob) {
    throw new Error("Unable to process the selected image.");
  }

  return new File([blob], `challenge-${Date.now()}.jpg`, {
    type: "image/jpeg",
  });
};

function ImageCropper({
  target,
  onDone,
  onCancel,
}: {
  target: CropTarget;
  onDone: (file: File) => void;
  onCancel: () => void;
}) {
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
      onDone(await createCroppedFile(imageUrl, croppedAreaPixels));
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

function ThumbnailField({
  state,
  onSelect,
  onRemove,
  disabled,
}: {
  state: ImageState;
  onSelect: (file: File) => void;
  onRemove: () => void;
  disabled: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrl = state.previewUrl ?? state.existingUrl ?? null;

  return (
    <div>
      <div className="mb-3">
        <label className="text-sm font-medium text-slate-700">Thumbnail</label>
        <p className="mt-0.5 text-xs leading-5 text-slate-400">
          Used for challenge cards and discovery sections.
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
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md hover:text-red-600 disabled:opacity-50"
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
                  600 × 900px · 2:3 portrait
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
            className="flex min-h-56 w-full flex-col items-center justify-center px-6 py-8 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-700">
              <ImageIcon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-800">
              Upload thumbnail
            </p>
            <p className="mt-1 text-xs text-slate-400">
              JPG, PNG, or WebP · up to 5 MB
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
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) onSelect(file);
          }}
        />
      </div>

      <p className="mt-2 text-[11px] text-slate-400">
        Recommended:{" "}
        <span className="font-medium text-slate-500">600 × 900px</span>
      </p>
    </div>
  );
}

const emptyImageState = (existingUrl?: string): ImageState => ({
  file: null,
  previewUrl: null,
  existingUrl,
  removed: false,
});

export default function ChallengeForm({
  mode,
  challengeId,
  initialValues,
}: ChallengeFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<ChallengeFormState>({
    ...defaultFormState,
    ...initialValues,
  });

  const [thumbnail, setThumbnail] = useState<ImageState>(() =>
    emptyImageState(initialValues?.thumbnailUrl),
  );
  const [cropTarget, setCropTarget] = useState<CropTarget | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (thumbnail.previewUrl) URL.revokeObjectURL(thumbnail.previewUrl);
    };
    // Preview URLs are cleaned up when this form unmounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateField = <K extends keyof ChallengeFormState>(
    field: K,
    value: ChallengeFormState[K],
  ) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleImageSelection = (file: File) => {
    const result = imageFileSchema.safeParse(file);

    if (!result.success) {
      setImageError(result.error.issues[0]?.message ?? "Invalid image file.");
      return;
    }

    setImageError(null);
    setCropTarget({ file });
  };

  const handleCropComplete = (file: File) => {
    setThumbnail((previous) => {
      if (previous.previewUrl) URL.revokeObjectURL(previous.previewUrl);

      return {
        file,
        previewUrl: URL.createObjectURL(file),
        existingUrl: previous.existingUrl,
        removed: false,
      };
    });

    setCropTarget(null);
  };

  const handleRemoveThumbnail = () => {
    setThumbnail((previous) => {
      if (previous.previewUrl) URL.revokeObjectURL(previous.previewUrl);

      return {
        file: null,
        previewUrl: null,
        existingUrl: undefined,
        removed: true,
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError(null);

      if (!form.title.trim()) {
        setError("Challenge title is required.");
        return;
      }

      if (!form.description.trim()) {
        setError("Challenge description is required.");
        return;
      }

      if (
        !Number.isInteger(form.durationDays) ||
        form.durationDays < 1 ||
        form.durationDays > 365
      ) {
        setError("Challenge duration must be between 1 and 365 days.");
        return;
      }

      if (imageError) {
        setError("Please fix the thumbnail validation error before saving.");
        return;
      }

      if (mode === "edit" && !challengeId) {
        setError("Challenge ID is required.");
        return;
      }

      const formData = new FormData();

      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());

      if (form.instructions?.trim()) {
        formData.append("instructions", form.instructions.trim());
      }

      formData.append("category", form.category);
      formData.append("difficulty", form.difficulty);
      formData.append("accessType", form.accessType);
      formData.append("durationDays", String(form.durationDays));

      if (thumbnail.file) {
        formData.append("thumbnail", thumbnail.file);
      }

      if (mode === "edit") {
        if (thumbnail.removed) {
          formData.append("removeThumbnail", "true");
        }

        await adminChallengeService.updateChallenge(challengeId!, formData);
      } else {
        await adminChallengeService.createChallenge(formData);
      }

      router.push(
        mode === "create"
          ? "/admin/challenges"
          : `/admin/challenges/${challengeId}`,
      );

      router.refresh();
    } catch (err) {
      console.error(err);
      setError(
        mode === "create"
          ? "Failed to create challenge. Please verify your inputs and try again."
          : "Failed to update challenge. Please verify your inputs and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {cropTarget && (
        <ImageCropper
          target={cropTarget}
          onDone={handleCropComplete}
          onCancel={() => setCropTarget(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-6">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
          >
            {error}
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={ClipboardList}
            title="Basic Information"
            description="Add the basic details for your challenge."
          />

          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="title"
                  className="text-sm font-medium text-slate-700"
                >
                  Challenge Title
                </label>
                <span className="text-xs text-slate-400">
                  {form.title.length}/150
                </span>
              </div>
              <input
                id="title"
                type="text"
                required
                maxLength={150}
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="7-Day Hydration Challenge"
                className={inputClassName}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-slate-700"
                >
                  Description
                </label>
                <span className="text-xs text-slate-400">
                  {form.description.length}/3000
                </span>
              </div>
              <textarea
                id="description"
                required
                maxLength={3000}
                rows={4}
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Drink enough water every day for 7 days."
                className={textareaClassName}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="instructions"
                  className="text-sm font-medium text-slate-700"
                >
                  Instructions
                  <span className="ml-1 font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>
                <span className="text-xs text-slate-400">
                  {form.instructions?.length ?? 0}/5000
                </span>
              </div>
              <textarea
                id="instructions"
                maxLength={5000}
                rows={5}
                value={form.instructions ?? ""}
                onChange={(event) =>
                  updateField("instructions", event.target.value)
                }
                placeholder="Explain how participants should approach this challenge..."
                className={textareaClassName}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={ImageIcon}
            title="Challenge Thumbnail"
            description="Choose a portrait image used throughout the challenge experience."
          />

          <div className="mt-6 max-w-md">
            <ThumbnailField
              state={thumbnail}
              onSelect={handleImageSelection}
              onRemove={handleRemoveThumbnail}
              disabled={loading}
            />
            {imageError && (
              <p role="alert" className="mt-3 text-xs font-medium text-red-600">
                {imageError}
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={Settings2}
            title="Challenge Configuration"
            description="Define the category, difficulty, access, and duration."
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Category
              </label>
              <select
                id="category"
                value={form.category}
                onChange={(event) =>
                  updateField(
                    "category",
                    event.target.value as CreateChallengeDTO["category"],
                  )
                }
                className={selectClassName}
              >
                {CHALLENGE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="difficulty"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Difficulty
              </label>
              <select
                id="difficulty"
                value={form.difficulty}
                onChange={(event) =>
                  updateField(
                    "difficulty",
                    event.target.value as CreateChallengeDTO["difficulty"],
                  )
                }
                className={selectClassName}
              >
                {CHALLENGE_DIFFICULTIES.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="accessType"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Access Type
              </label>
              <select
                id="accessType"
                value={form.accessType}
                onChange={(event) =>
                  updateField(
                    "accessType",
                    event.target.value as CreateChallengeDTO["accessType"],
                  )
                }
                className={selectClassName}
              >
                {CHALLENGE_ACCESS_TYPES.map((accessType) => (
                  <option key={accessType} value={accessType}>
                    {accessType}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="durationDays"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Duration
              </label>
              <div className="relative">
                <input
                  id="durationDays"
                  type="number"
                  required
                  min={1}
                  max={365}
                  value={form.durationDays}
                  onChange={(event) =>
                    updateField(
                      "durationDays",
                      event.target.value ? Number(event.target.value) : 1,
                    )
                  }
                  className={`${inputClassName} pr-16`}
                />
                <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-xs font-medium text-slate-400">
                  days
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={ListChecks}
            title="Challenge Structure"
            description="Configure individual days and activities after creating the challenge."
          />
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <p className="text-sm leading-6 text-emerald-900">
              This challenge will contain{" "}
              <span className="font-semibold">
                {form.durationDays} {form.durationDays === 1 ? "day" : "days"}
              </span>
              . After saving, you can add and manage the activities for each
              day.
            </p>
          </div>
        </section>

        <div className="sticky bottom-0 z-10 -mx-1 flex items-center justify-end gap-3 border-t border-slate-100 bg-white/95 px-1 py-4 backdrop-blur-sm sm:px-0">
          <button
            type="button"
            onClick={() =>
              router.push(
                mode === "edit" && challengeId
                  ? `/admin/challenges/${challengeId}`
                  : "/admin/challenges",
              )
            }
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : mode === "create"
                ? "Create Challenge"
                : "Update Challenge"}
          </button>
        </div>
      </form>
    </>
  );
}
