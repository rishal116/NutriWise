"use client";

import { useCallback, useEffect, useState, type ChangeEvent } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  useFieldArray,
  useForm,
  Controller,
  type Control,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Cropper, { type Area } from "react-easy-crop";

import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Crop,
  GripVertical,
  ImagePlus,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";

import { toast } from "sonner";

import { adminChallengeDayService } from "@/services/admin/adminChallengeDay.service";

import {
  CHALLENGE_ACTIVITY_TYPES,
  CHALLENGE_ACTIVITY_VALUE_TYPES,
  type ChallengeActivityType,
  type ChallengeActivityValueType,
} from "@/types/admin/challenge-day/challenge-day.types";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const IMAGE_MAX_SIZE = 5 * 1024 * 1024;
const VIDEO_MAX_SIZE = 50 * 1024 * 1024;

const MAX_VIDEO_DURATION_SECONDS = 120;

const IMAGE_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const VIDEO_ACCEPTED_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

const IMAGE_ASPECT = 16 / 9;

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type ExistingMedia = {
  imageUrl?: string;
  videoUrl?: string;
};

type ActivityFormValue = {
  type: ChallengeActivityType;
  title: string;
  description: string;
  instructions: string;
  valueType: ChallengeActivityValueType;
  targetValue?: number;
  unit: string;
  estimatedDurationMinutes?: number;
  isRequired: boolean;
  configuration: Record<string, unknown>;

  imageFile: File | null;
  videoFile: File | null;

  existingImageUrl?: string;
  existingVideoUrl?: string;

  removeImage: boolean;
  removeVideo: boolean;
};

interface ChallengeDayFormProps {
  mode: "create" | "edit";
  challengeId: string;
  dayId?: string;

  initialValues?: {
    dayNumber?: number;
    title?: string;
    description?: string;

    activities?: Array<Partial<ActivityFormValue> & ExistingMedia>;
  };
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

const activitySchema = z.object({
  type: z.enum(CHALLENGE_ACTIVITY_TYPES),

  title: z
    .string()
    .trim()
    .min(1, "Activity title is required")
    .max(150, "Activity title must not exceed 150 characters"),

  description: z
    .string()
    .trim()
    .max(2000, "Description must not exceed 2000 characters"),

  instructions: z
    .string()
    .trim()
    .max(5000, "Instructions must not exceed 5000 characters"),

  valueType: z.enum(CHALLENGE_ACTIVITY_VALUE_TYPES),

  targetValue: z.number().min(0, "Target value cannot be negative").optional(),

  unit: z.string().trim().max(30, "Unit must not exceed 30 characters"),

  estimatedDurationMinutes: z
    .number()
    .min(0, "Duration cannot be negative")
    .optional(),

  isRequired: z.boolean(),

  configuration: z.record(z.string(), z.unknown()),

  imageFile: z.custom<File | null>(),

  videoFile: z.custom<File | null>(),

  existingImageUrl: z.string().optional(),

  existingVideoUrl: z.string().optional(),

  removeImage: z.boolean(),

  removeVideo: z.boolean(),
});

const formSchema = z.object({
  dayNumber: z.number().int().min(1, "Day number must be at least 1"),

  title: z
    .string()
    .trim()
    .min(1, "Day title is required")
    .max(150, "Day title must not exceed 150 characters"),

  description: z
    .string()
    .trim()
    .min(1, "Day description is required")
    .max(2000, "Day description must not exceed 2000 characters"),

  activities: z
    .array(activitySchema)
    .min(1, "At least one activity is required"),
});

type FormValues = z.infer<typeof formSchema>;

/* -------------------------------------------------------------------------- */
/* Labels                                                                     */
/* -------------------------------------------------------------------------- */

const ACTIVITY_TYPE_LABELS: Record<ChallengeActivityType, string> = {
  exercise: "Exercise",
  nutrition: "Nutrition",
  hydration: "Hydration",
  meditation: "Meditation",
  breathing: "Breathing",
  sleep: "Sleep",
  habit: "Habit",
  education: "Education",
  stretching: "Stretching",
  recovery: "Recovery",
  measurement: "Measurement",
  custom: "Custom",
};

const VALUE_TYPE_LABELS: Record<ChallengeActivityValueType, string> = {
  boolean: "Yes / No",
  number: "Number",
  duration: "Duration",
};

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60";

const labelClass =
  "text-xs font-semibold uppercase tracking-wider text-slate-500";

const errorClass = "mt-1 text-xs font-medium text-rose-600";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function createEmptyActivity(): ActivityFormValue {
  return {
    type: "custom",
    title: "",
    description: "",
    instructions: "",
    valueType: "boolean",
    targetValue: undefined,
    unit: "",
    estimatedDurationMinutes: undefined,
    isRequired: true,
    configuration: {},

    imageFile: null,
    videoFile: null,

    existingImageUrl: undefined,
    existingVideoUrl: undefined,

    removeImage: false,
    removeVideo: false,
  };
}

function cleanConfiguration(
  configuration: Record<string, unknown>,
): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};

  Object.entries(configuration).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (Array.isArray(value) && value.length === 0) {
      return;
    }

    cleaned[key] = value;
  });

  return cleaned;
}

function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);

    const video = document.createElement("video");

    video.preload = "metadata";

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unable to read video metadata."));
    };

    video.src = url;
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();

    image.onload = () => resolve(image);

    image.onerror = () => reject(new Error("Unable to load image."));

    image.src = url;
  });
}

async function getCroppedImageFile(
  imageSrc: string,
  crop: Area,
  fileName: string,
): Promise<File> {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to create image canvas.");
  }

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.9),
  );

  if (!blob) {
    throw new Error("Unable to create cropped image.");
  }

  return new File([blob], fileName.replace(/\.[^/.]+$/, ".webp"), {
    type: "image/webp",
  });
}

/* -------------------------------------------------------------------------- */
/* Configuration fields                                                       */
/* -------------------------------------------------------------------------- */

function ConfigurationFields({
  type,
  control,
  index,
}: {
  type: ChallengeActivityType;
  control: Control<FormValues>;
  index: number;
}) {
  const supportedTypes: ChallengeActivityType[] = [
    "exercise",
    "hydration",
    "meditation",
    "breathing",
    "sleep",
    "measurement",
  ];

  if (!supportedTypes.includes(type)) {
    return null;
  }

  return (
    <div className="border-t border-slate-200 pt-4">
      <p className={labelClass}>Additional Settings</p>

      <Controller
        control={control}
        name={`activities.${index}.configuration`}
        render={({ field }) => {
          const config = (field.value ?? {}) as Record<string, unknown>;

          const update = (key: string, value: unknown) => {
            field.onChange({
              ...config,
              [key]: value,
            });
          };

          if (type === "exercise") {
            return (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Exercise Type</label>

                  <select
                    value={String(config.exerciseType ?? "general")}
                    onChange={(event) =>
                      update("exerciseType", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="general">General</option>
                    <option value="walking">Walking</option>
                    <option value="running">Running</option>
                    <option value="strength">Strength</option>
                    <option value="stretching">Stretching</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Intensity</label>

                  <select
                    value={String(config.intensity ?? "moderate")}
                    onChange={(event) =>
                      update("intensity", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            );
          }

          if (type === "hydration") {
            return (
              <div className="mt-3">
                <label className={labelClass}>Tracking Method</label>

                <select
                  value={String(config.trackingMethod ?? "daily_total")}
                  onChange={(event) =>
                    update("trackingMethod", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="daily_total">Daily Total</option>
                  <option value="per_serving">Per Serving</option>
                </select>
              </div>
            );
          }

          if (type === "meditation") {
            return (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Technique</label>

                  <select
                    value={String(config.technique ?? "mindfulness")}
                    onChange={(event) =>
                      update("technique", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="mindfulness">Mindfulness</option>
                    <option value="body_scan">Body Scan</option>
                    <option value="guided">Guided</option>
                    <option value="breathing">Breathing</option>
                  </select>
                </div>

                <label className="mt-7 flex items-center gap-2 text-sm font-medium text-slate-600">
                  <input
                    type="checkbox"
                    checked={Boolean(config.guided ?? false)}
                    onChange={(event) => update("guided", event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20"
                  />
                  Guided
                </label>
              </div>
            );
          }

          if (type === "breathing") {
            return (
              <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  ["inhaleSeconds", "Inhale"],
                  ["holdSeconds", "Hold"],
                  ["exhaleSeconds", "Exhale"],
                  ["restSeconds", "Rest"],
                ].map(([key, label]) => (
                  <div key={key}>
                    <label className={labelClass}>{label} Sec</label>

                    <input
                      type="number"
                      min={0}
                      value={
                        typeof config[key] === "number"
                          ? String(config[key])
                          : ""
                      }
                      onChange={(event) =>
                        update(
                          key,
                          event.target.value === ""
                            ? undefined
                            : Number(event.target.value),
                        )
                      }
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            );
          }

          if (type === "sleep") {
            return (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Target Bedtime</label>

                  <input
                    type="time"
                    value={String(config.bedtime ?? "")}
                    onChange={(event) =>
                      update("bedtime", event.target.value || undefined)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Target Wake Time</label>

                  <input
                    type="time"
                    value={String(config.wakeTime ?? "")}
                    onChange={(event) =>
                      update("wakeTime", event.target.value || undefined)
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            );
          }

          return (
            <div className="mt-3">
              <label className={labelClass}>Measurement Type</label>

              <select
                value={String(config.measurementType ?? "weight")}
                onChange={(event) =>
                  update("measurementType", event.target.value)
                }
                className={inputClass}
              >
                <option value="weight">Weight</option>
                <option value="waist">Waist</option>
                <option value="blood_pressure">Blood Pressure</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          );
        }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Media uploader                                                             */
/* -------------------------------------------------------------------------- */

function MediaCard({
  type,
  file,
  existingUrl,
  onSelect,
  onRemove,
  disabled,
  cropRequired,
}: {
  type: "image" | "video";
  file: File | null;
  existingUrl?: string;
  onSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  disabled: boolean;
  cropRequired?: boolean;
}) {
  const previewUrl = file ? URL.createObjectURL(file) : existingUrl;

  const isImage = type === "image";

  useEffect(() => {
    if (!file) {
      return;
    }

    const url = URL.createObjectURL(file);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          {isImage ? (
            <ImagePlus className="h-4 w-4 text-emerald-600" />
          ) : (
            <Video className="h-4 w-4 text-emerald-600" />
          )}

          <div>
            <p className="text-xs font-bold text-slate-700">
              {isImage ? "Activity Image" : "Activity Video"}
            </p>

            <p className="text-[11px] text-slate-400">
              {isImage ? "16:9 recommended" : "Short demonstration clip"}
            </p>
          </div>
        </div>

        {previewUrl && (
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="rounded-lg p-1.5 text-slate-300 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
            aria-label={`Remove ${type}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {previewUrl ? (
        <div className="p-3">
          <div
            className={`relative overflow-hidden rounded-xl bg-slate-100 ${
              isImage ? "aspect-video" : "aspect-video"
            }`}
          >
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
            <p className="min-w-0 truncate text-xs font-medium text-slate-500">
              {file?.name ?? "Existing media"}
            </p>

            <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-200">
              <RefreshCw className="h-3.5 w-3.5" />
              Replace
              <input
                type="file"
                accept={
                  isImage
                    ? "image/jpeg,image/png,image/webp"
                    : "video/mp4,video/webm,video/quicktime"
                }
                className="hidden"
                disabled={disabled}
                onChange={onSelect}
              />
            </label>
          </div>

          {isImage && cropRequired && (
            <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
              <Crop className="h-3.5 w-3.5" />
              Cropped to 16:9
            </div>
          )}
        </div>
      ) : (
        <label className="m-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center transition hover:border-emerald-300 hover:bg-emerald-50/30">
          {isImage ? (
            <ImagePlus className="h-7 w-7 text-slate-300" />
          ) : (
            <Video className="h-7 w-7 text-slate-300" />
          )}

          <p className="mt-3 text-xs font-bold text-slate-600">
            Upload {isImage ? "image" : "video"}
          </p>

          <p className="mt-1 max-w-[220px] text-[11px] leading-5 text-slate-400">
            {isImage
              ? "JPG, PNG or WEBP · Max 5MB"
              : "MP4, WEBM or MOV · Max 50MB · Up to 2 minutes"}
          </p>

          <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 shadow-sm">
            <Upload className="h-3.5 w-3.5" />
            Choose file
          </span>

          <input
            type="file"
            accept={
              isImage
                ? "image/jpeg,image/png,image/webp"
                : "video/mp4,video/webm,video/quicktime"
            }
            className="hidden"
            disabled={disabled}
            onChange={onSelect}
          />
        </label>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Crop modal                                                                 */
/* -------------------------------------------------------------------------- */

function ImageCropModal({
  source,
  onCancel,
  onComplete,
}: {
  source: {
    url: string;
    file: File;
  };
  onCancel: () => void;
  onComplete: (file: File) => Promise<void>;
}) {
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [saving, setSaving] = useState(false);

  const handleComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) {
      return;
    }

    try {
      setSaving(true);

      const croppedFile = await getCroppedImageFile(
        source.url,
        croppedAreaPixels,
        source.file.name,
      );

      await onComplete(croppedFile);
    } catch {
      toast.error("Unable to crop the image.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Crop Activity Image
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Adjust the image to the standard 16:9 ratio.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative h-[55vh] min-h-[320px] bg-slate-950">
          <Cropper
            image={source.url}
            crop={crop}
            zoom={zoom}
            aspect={IMAGE_ASPECT}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleComplete}
            restrictPosition
          />
        </div>

        <div className="space-y-4 border-t border-slate-200 p-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-600">
                Zoom
              </label>

              <span className="text-xs font-medium text-slate-400">
                {zoom.toFixed(1)}x
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !croppedAreaPixels}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}

              {saving ? "Applying..." : "Apply Crop"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main component                                                             */
/* -------------------------------------------------------------------------- */

export default function ChallengeDayForm({
  mode,
  challengeId,
  dayId,
  initialValues,
}: ChallengeDayFormProps) {
  const router = useRouter();

  const [cropSource, setCropSource] = useState<{
    index: number;
    url: string;
    file: File;
  } | null>(null);

  const [saving, setSaving] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dayNumber: initialValues?.dayNumber ?? 1,

      title: initialValues?.title ?? "",

      description: initialValues?.description ?? "",

      activities: initialValues?.activities?.length
        ? initialValues.activities.map((activity) => ({
            ...createEmptyActivity(),
            ...activity,
            description: activity.description ?? "",
            instructions: activity.instructions ?? "",
            unit: activity.unit ?? "",
            configuration: activity.configuration ?? {},
            imageFile: activity.imageFile ?? null,
            videoFile: activity.videoFile ?? null,
            existingImageUrl: activity.existingImageUrl ?? activity.imageUrl,
            existingVideoUrl: activity.existingVideoUrl ?? activity.videoUrl,
            removeImage: false,
            removeVideo: false,
          }))
        : [createEmptyActivity()],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "activities",
  });

  const watchedActivities = watch("activities");

  /* ------------------------------------------------------------------------ */
  /* Media handlers                                                           */
  /* ------------------------------------------------------------------------ */

  const handleImageChange = async (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;

    event.target.value = "";

    if (!file) {
      return;
    }

    if (!IMAGE_ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > IMAGE_MAX_SIZE) {
      toast.error("Image must be 5MB or smaller.");
      return;
    }

    const sourceUrl = URL.createObjectURL(file);

    setCropSource({
      index,
      url: sourceUrl,
      file,
    });
  };

  const handleCroppedImage = async (index: number, file: File) => {
    setValue(`activities.${index}.imageFile`, file, {
      shouldDirty: true,
    });

    setValue(`activities.${index}.removeImage`, false);

    setCropSource(null);
  };

  const handleVideoChange = async (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;

    event.target.value = "";

    if (!file) {
      return;
    }

    if (!VIDEO_ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Please select an MP4, WEBM, or MOV video.");
      return;
    }

    if (file.size > VIDEO_MAX_SIZE) {
      toast.error("Video must be 50MB or smaller.");
      return;
    }

    try {
      const duration = await getVideoDuration(file);

      if (!Number.isFinite(duration) || duration <= 0) {
        toast.error("Unable to determine video duration.");
        return;
      }

      if (duration > MAX_VIDEO_DURATION_SECONDS) {
        toast.error("Video must be 2 minutes or shorter.");
        return;
      }

      setValue(`activities.${index}.videoFile`, file, {
        shouldDirty: true,
      });

      setValue(`activities.${index}.removeVideo`, false);
    } catch {
      toast.error("Unable to read the selected video.");
    }
  };

  const removeImage = (index: number) => {
    setValue(`activities.${index}.imageFile`, null, {
      shouldDirty: true,
    });

    setValue(`activities.${index}.existingImageUrl`, undefined, {
      shouldDirty: true,
    });

    setValue(`activities.${index}.removeImage`, true, {
      shouldDirty: true,
    });
  };

  const removeVideo = (index: number) => {
    setValue(`activities.${index}.videoFile`, null, {
      shouldDirty: true,
    });

    setValue(`activities.${index}.existingVideoUrl`, undefined, {
      shouldDirty: true,
    });

    setValue(`activities.${index}.removeVideo`, true, {
      shouldDirty: true,
    });
  };

  /* ------------------------------------------------------------------------ */
  /* Submit                                                                   */
  /* ------------------------------------------------------------------------ */

  const onSubmit = async (values: FormValues) => {
    if (values.activities.length === 0) {
      toast.error("Add at least one activity.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("dayNumber", String(values.dayNumber));

      formData.append("title", values.title.trim());

      formData.append("description", values.description.trim());

      const activities = values.activities.map((activity, index) => ({
        type: activity.type,
        title: activity.title.trim(),
        description: activity.description.trim() || undefined,
        instructions: activity.instructions.trim() || undefined,
        valueType: activity.valueType,
        targetValue: activity.targetValue,
        unit: activity.unit.trim() || undefined,
        estimatedDurationMinutes: activity.estimatedDurationMinutes,
        isRequired: activity.isRequired,
        order: index,
        configuration: cleanConfiguration(activity.configuration),
      }));

      formData.append("activities", JSON.stringify(activities));

      values.activities.forEach((activity, index) => {
        if (activity.imageFile) {
          formData.append("activityImages", activity.imageFile);
        }

        if (activity.videoFile) {
          formData.append("activityVideos", activity.videoFile);
        }

        formData.append(
          "activityMediaIndexes",
          JSON.stringify({
            index,
            hasImage: Boolean(activity.imageFile),
            hasVideo: Boolean(activity.videoFile),
          }),
        );
      });

      if (mode === "create") {
        await adminChallengeDayService.createDay(challengeId, formData);

        toast.success(`Day ${values.dayNumber} created successfully.`);
      } else {
        if (!dayId) {
          throw new Error("Day ID is required for editing.");
        }

        await adminChallengeDayService.updateDay(challengeId, dayId, formData);

        toast.success(`Day ${values.dayNumber} updated successfully.`);
      }

      router.push(`/admin/challenges/${challengeId}/days`);

      router.refresh();
    } catch (error) {
      console.error("Failed to save challenge day:", error);

      toast.error(
        mode === "create"
          ? "Failed to create challenge day."
          : "Failed to update challenge day.",
      );
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => {
    if (saving) {
      return;
    }

    router.push(`/admin/challenges/${challengeId}/days`);
  };

  /* ------------------------------------------------------------------------ */
  /* Derived state                                                            */
  /* ------------------------------------------------------------------------ */

  const titleLength = watch("title").length;

  const descriptionLength = watch("description").length;

  const activityCount = watchedActivities.length;

  const activitiesError = errors.activities?.root?.message;

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <>
      <div className="min-h-screen bg-slate-50 px-4 py-6 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Back */}
          <button
            type="button"
            onClick={goBack}
            disabled={saving}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-emerald-700 disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Challenge Days
          </button>

          {/* Header */}
          <div className="mt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  Challenge Day
                </div>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {mode === "create"
                    ? "Create Challenge Day"
                    : "Edit Challenge Day"}
                </h1>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  Build the day and define exactly what participants need to
                  complete.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Activities
                </p>

                <p className="mt-0.5 text-lg font-bold text-slate-900">
                  {activityCount}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            {/* Day information */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <h2 className="text-base font-bold text-slate-900">
                  Day Information
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Set the basic information participants will see for this day.
                </p>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <div>
                  <label htmlFor="dayNumber" className={labelClass}>
                    Day Number
                  </label>

                  <input
                    id="dayNumber"
                    type="number"
                    min={1}
                    disabled={mode === "edit" || saving}
                    {...register("dayNumber", {
                      valueAsNumber: true,
                    })}
                    className={`${inputClass} sm:max-w-[180px]`}
                  />

                  <p className="mt-1.5 text-[11px] text-slate-400">
                    The day number stays fixed after creation.
                  </p>

                  {errors.dayNumber && (
                    <p className={errorClass}>{errors.dayNumber.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="title" className={labelClass}>
                      Day Title
                    </label>

                    <span className="text-[11px] font-medium text-slate-400">
                      {titleLength}
                      /150
                    </span>
                  </div>

                  <input
                    id="title"
                    maxLength={150}
                    disabled={saving}
                    {...register("title")}
                    placeholder="Morning Movement"
                    className={inputClass}
                  />

                  {errors.title && (
                    <p className={errorClass}>{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="description" className={labelClass}>
                      Description
                    </label>

                    <span className="text-[11px] font-medium text-slate-400">
                      {descriptionLength}
                      /2000
                    </span>
                  </div>

                  <textarea
                    id="description"
                    rows={4}
                    maxLength={2000}
                    disabled={saving}
                    {...register("description")}
                    placeholder="Describe what participants should focus on during this day..."
                    className={`${inputClass} resize-none`}
                  />

                  {errors.description && (
                    <p className={errorClass}>{errors.description.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Activities */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Activities
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Add at least one activity. Activities can include text,
                    images, videos, targets, and custom settings.
                  </p>

                  {activitiesError && (
                    <p className={errorClass}>{activitiesError}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => append(createEmptyActivity())}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  Add Activity
                </button>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                {fields.map((field, index) => {
                  const activity = watchedActivities[index];

                  const activityErrors = errors.activities?.[index];

                  const showTarget =
                    activity?.valueType === "number" ||
                    activity?.valueType === "duration";

                  const existingImageUrl = activity?.removeImage
                    ? undefined
                    : activity?.existingImageUrl;

                  const existingVideoUrl = activity?.removeVideo
                    ? undefined
                    : activity?.existingVideoUrl;

                  return (
                    <article
                      key={field.id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70"
                    >
                      {/* Activity top bar */}
                      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                            <GripVertical className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Activity {index + 1}
                            </p>

                            <p className="text-sm font-semibold text-slate-800">
                              {activity?.title || "New activity"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={index === 0 || saving}
                            onClick={() => move(index, index - 1)}
                            className="rounded-lg p-1.5 text-slate-300 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30"
                            aria-label="Move activity up"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            disabled={index === fields.length - 1 || saving}
                            onClick={() => move(index, index + 1)}
                            className="rounded-lg p-1.5 text-slate-300 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30"
                            aria-label="Move activity down"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => remove(index)}
                            className="rounded-lg p-1.5 text-slate-300 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
                            aria-label="Remove activity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-5 p-4 sm:p-5">
                        {/* Basic */}
                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <label className={labelClass}>Activity Type</label>

                            <Controller
                              control={control}
                              name={`activities.${index}.type`}
                              render={({ field: controllerField }) => (
                                <select
                                  {...controllerField}
                                  disabled={saving}
                                  className={inputClass}
                                >
                                  {CHALLENGE_ACTIVITY_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                      {ACTIVITY_TYPE_LABELS[type]}
                                    </option>
                                  ))}
                                </select>
                              )}
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className={labelClass}>Activity Title</label>

                            <input
                              type="text"
                              disabled={saving}
                              {...register(`activities.${index}.title`)}
                              placeholder="Drink 2 liters of water"
                              className={inputClass}
                            />

                            {activityErrors?.title && (
                              <p className={errorClass}>
                                {activityErrors.title.message}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Measurement */}
                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <label className={labelClass}>Value Type</label>

                            <Controller
                              control={control}
                              name={`activities.${index}.valueType`}
                              render={({ field: controllerField }) => (
                                <select
                                  {...controllerField}
                                  disabled={saving}
                                  className={inputClass}
                                >
                                  {CHALLENGE_ACTIVITY_VALUE_TYPES.map(
                                    (type) => (
                                      <option key={type} value={type}>
                                        {VALUE_TYPE_LABELS[type]}
                                      </option>
                                    ),
                                  )}
                                </select>
                              )}
                            />
                          </div>

                          {showTarget && (
                            <>
                              <div>
                                <label className={labelClass}>
                                  Target Value
                                </label>

                                <input
                                  type="number"
                                  min={0}
                                  step="any"
                                  disabled={saving}
                                  {...register(
                                    `activities.${index}.targetValue`,
                                    {
                                      setValueAs: (value) =>
                                        value === ""
                                          ? undefined
                                          : Number(value),
                                    },
                                  )}
                                  placeholder="30"
                                  className={inputClass}
                                />
                              </div>

                              <div>
                                <label className={labelClass}>Unit</label>

                                <input
                                  type="text"
                                  maxLength={30}
                                  disabled={saving}
                                  {...register(`activities.${index}.unit`)}
                                  placeholder="ml, reps, minutes"
                                  className={inputClass}
                                />
                              </div>
                            </>
                          )}
                        </div>

                        {/* Extra */}
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className={labelClass}>
                              Estimated Duration (minutes)
                            </label>

                            <input
                              type="number"
                              min={0}
                              disabled={saving}
                              {...register(
                                `activities.${index}.estimatedDurationMinutes`,
                                {
                                  setValueAs: (value) =>
                                    value === "" ? undefined : Number(value),
                                },
                              )}
                              placeholder="Optional"
                              className={inputClass}
                            />
                          </div>

                          <label className="flex items-end gap-2 pb-1 text-sm font-semibold text-slate-600">
                            <input
                              type="checkbox"
                              disabled={saving}
                              {...register(`activities.${index}.isRequired`)}
                              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20"
                            />
                            Required activity
                          </label>
                        </div>

                        {/* Text */}
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className={labelClass}>Description</label>

                            <textarea
                              rows={3}
                              disabled={saving}
                              {...register(`activities.${index}.description`)}
                              placeholder="Explain the goal of this activity..."
                              className={`${inputClass} resize-none`}
                            />
                          </div>

                          <div>
                            <label className={labelClass}>Instructions</label>

                            <textarea
                              rows={3}
                              disabled={saving}
                              {...register(`activities.${index}.instructions`)}
                              placeholder="Explain how the participant should complete it..."
                              className={`${inputClass} resize-none`}
                            />
                          </div>
                        </div>

                        {/* Media */}
                        <div className="grid gap-4 lg:grid-cols-2">
                          <MediaCard
                            type="image"
                            file={activity?.imageFile ?? null}
                            existingUrl={existingImageUrl}
                            onSelect={(event) =>
                              handleImageChange(index, event)
                            }
                            onRemove={() => removeImage(index)}
                            disabled={saving}
                            cropRequired={Boolean(activity?.imageFile)}
                          />

                          <MediaCard
                            type="video"
                            file={activity?.videoFile ?? null}
                            existingUrl={existingVideoUrl}
                            onSelect={(event) =>
                              handleVideoChange(index, event)
                            }
                            onRemove={() => removeVideo(index)}
                            disabled={saving}
                          />
                        </div>

                        {/* Configuration */}
                        <ConfigurationFields
                          type={activity?.type ?? "custom"}
                          control={control}
                          index={index}
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Submit */}
            <div className="sticky bottom-4 z-20 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="hidden text-xs font-medium text-slate-400 sm:block">
                  {activityCount}{" "}
                  {activityCount === 1 ? "activity" : "activities"} configured
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={saving}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}

                    {saving
                      ? "Saving..."
                      : mode === "create"
                        ? "Create Day"
                        : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Image crop modal */}
      {cropSource && (
        <ImageCropModal
          source={{
            url: cropSource.url,
            file: cropSource.file,
          }}
          onCancel={() => {
            URL.revokeObjectURL(cropSource.url);
            setCropSource(null);
          }}
          onComplete={async (croppedFile) => {
            await handleCroppedImage(cropSource.index, croppedFile);

            URL.revokeObjectURL(cropSource.url);
          }}
        />
      )}
    </>
  );
}
