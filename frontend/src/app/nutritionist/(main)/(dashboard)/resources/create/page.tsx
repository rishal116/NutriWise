"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileText,
  File,
  Video,
  Link as LinkIcon,
  Image as ImageIcon,
  UploadCloud,
  X,
  Loader2,
  Info,
} from "lucide-react";

import { nutriResourceService } from "@/services/nutritionist/nutriResource.service";
import type { CreateNutriResourceDTO } from "@/dtos/nutritionist/resource/create-resource.dto";
import {
  RESOURCE_CATEGORIES,
  type ResourceType,
} from "@/types/nutritionist/resource/resource.types";

import {
  createResourceSchema,
  type CreateResourceFormValues,
} from "@/validations/nutritionist/resource/create-resource.validation";

// ---------------------------------------------------------------------------
// Static config
// ---------------------------------------------------------------------------

const TYPE_CARDS: {
  value: ResourceType;
  label: string;
  hint: string;
  icon: typeof FileText;
  accent: string;
}[] = [
  {
    value: "article",
    label: "Article",
    hint: "Written content",
    icon: FileText,
    accent: "emerald",
  },
  {
    value: "pdf",
    label: "PDF",
    hint: "Downloadable file",
    icon: File,
    accent: "rose",
  },
  {
    value: "video",
    label: "Video",
    hint: "Upload or link",
    icon: Video,
    accent: "purple",
  },
  {
    value: "external_link",
    label: "External link",
    hint: "Link out",
    icon: LinkIcon,
    accent: "sky",
  },
  {
    value: "infographic",
    label: "Infographic",
    hint: "Image content",
    icon: ImageIcon,
    accent: "orange",
  },
];

const ACCENT_CLASSES: Record<string, { active: string; icon: string }> = {
  emerald: {
    active: "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20",
    icon: "bg-emerald-100/80 text-emerald-700",
  },
  rose: {
    active: "border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20",
    icon: "bg-rose-100/80 text-rose-700",
  },
  purple: {
    active: "border-purple-500 bg-purple-50/60 ring-2 ring-purple-500/20",
    icon: "bg-purple-100/80 text-purple-700",
  },
  sky: {
    active: "border-sky-500 bg-sky-50/60 ring-2 ring-sky-500/20",
    icon: "bg-sky-100/80 text-sky-700",
  },
  orange: {
    active: "border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20",
    icon: "bg-orange-100/80 text-orange-700",
  },
};

const ACCEPT_MAP: Record<string, string> = {
  pdf: "application/pdf",
  video: "video/*",
  infographic: "image/*",
};

// ---------------------------------------------------------------------------
// Reusable bits
// ---------------------------------------------------------------------------

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs font-semibold text-rose-600 mt-1.5">{message}</p>
  );
}

function CharCount({ value, max }: { value: string; max: number }) {
  return (
    <p className="text-[11px] font-medium text-slate-400 mt-1 text-right">
      {value.length}/{max}
    </p>
  );
}

function FileDropField({
  label,
  accept,
  fileName,
  fileSizeLabel,
  onSelect,
  onClear,
  error,
}: {
  label: string;
  accept: string;
  fileName?: string;
  fileSizeLabel?: string;
  onSelect: (file: File) => void;
  onClear: () => void;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-2">
        {label}
      </label>

      {fileName ? (
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {fileName}
            </p>
            {fileSizeLabel && (
              <p className="text-[11px] text-slate-400">{fileSizeLabel}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClear}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl py-8 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/40 transition-colors">
          <UploadCloud size={22} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">
            Click to upload
          </span>
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onSelect(file);
              e.target.value = "";
            }}
          />
        </label>
      )}

      <FieldError message={error} />
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatCategoryLabel(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CreateResourcePage() {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateResourceFormValues>({
    resolver: zodResolver(createResourceSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "article",
      content: "",
      file: undefined,
      thumbnail: undefined,
      externalUrl: "",
      category: RESOURCE_CATEGORIES[0],
      isDownloadable: false,
    },
  });

  const type = watch("type");
  const description = watch("description");
  const content = watch("content") ?? "";
  const file = watch("file");
  const thumbnail = watch("thumbnail");

  const handleFileSelect = useCallback(
    (selectedFile: File) => {
      setValue("file", selectedFile, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue],
  );

  const handleFileClear = useCallback(() => {
    setValue("file", undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [setValue]);

  const handleThumbnailSelect = useCallback(
    (selectedFile: File) => {
      setValue("thumbnail", selectedFile, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue],
  );

  const handleThumbnailClear = useCallback(() => {
    setValue("thumbnail", undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [setValue]);

  const onSubmit = async (values: CreateResourceFormValues) => {
    setSubmitting(true);

    try {
      const dto: CreateNutriResourceDTO = {
        title: values.title,
        description: values.description,
        type: values.type,
        content: values.content || undefined,
        externalUrl: values.externalUrl || undefined,
        category: values.category,
        isDownloadable: values.isDownloadable,
      };

      await nutriResourceService.createResource(
        dto,
        values.file,
        values.thumbnail,
      );

      toast.success("Resource created");

      router.push(`/nutritionist/resources`);
    } catch (error) {
      console.error("Create resource failed:", error);
      toast.error("Couldn't create the resource. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        {/* HEADER */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/nutritionist/resources")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-700 transition-colors mb-5"
          >
            <ArrowLeft size={16} />
            Back to Resources
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Create Resource
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Add educational content, guides, videos, and useful resources for
            your clients.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          {/* BASIC INFORMATION */}
          <section className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6">
            <div className="mb-6">
              <h2 className="text-base font-bold text-slate-900">
                Basic Information
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Provide the main information about your resource.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Title
              </label>
              <input
                type="text"
                {...register("title")}
                placeholder="e.g. Understanding Macronutrients"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              <FieldError message={errors.title?.message} />
            </div>

            <div className="mt-5">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={4}
                placeholder="A short summary clients will see in the resource list"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
              />
              <CharCount value={description ?? ""} max={1000} />
              <FieldError message={errors.description?.message} />
            </div>
          </section>

          {/* RESOURCE TYPE */}
          <section className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6">
            <div className="mb-6">
              <h2 className="text-base font-bold text-slate-900">
                Resource Type
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Choose the type of content you want to create.
              </p>
            </div>

            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {TYPE_CARDS.map((card) => {
                    const Icon = card.icon;
                    const active = field.value === card.value;
                    const accent = ACCENT_CLASSES[card.accent];

                    return (
                      <button
                        key={card.value}
                        type="button"
                        onClick={() => field.onChange(card.value)}
                        className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all ${
                          active
                            ? accent.active
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent.icon}`}
                        >
                          <Icon size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          {card.label}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          {card.hint}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </section>

          {/* CONTENT */}
          <section className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6">
            <div className="mb-6">
              <h2 className="text-base font-bold text-slate-900">Content</h2>
              <p className="text-xs text-slate-400 mt-1">
                Add the main content or resource file.
              </p>
            </div>

            <div className="space-y-5">
              {type === "article" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Article content
                  </label>

                  <textarea
                    {...register("content")}
                    rows={10}
                    placeholder="Write the full article content here"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-y"
                  />

                  <CharCount value={content} max={20000} />

                  <FieldError message={errors.content?.message} />
                </div>
              )}

              {(type === "pdf" || type === "infographic") && (
                <FileDropField
                  label={type === "pdf" ? "PDF file" : "Image file"}
                  accept={ACCEPT_MAP[type]}
                  fileName={file?.name}
                  fileSizeLabel={file ? formatFileSize(file.size) : undefined}
                  onSelect={handleFileSelect}
                  onClear={handleFileClear}
                  error={errors.file?.message}
                />
              )}

              {type === "video" && (
                <>
                  <FileDropField
                    label="Video file (optional if using an external URL)"
                    accept={ACCEPT_MAP.video}
                    fileName={file?.name}
                    fileSizeLabel={file ? formatFileSize(file.size) : undefined}
                    onSelect={handleFileSelect}
                    onClear={handleFileClear}
                    error={errors.file?.message}
                  />

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Or external video URL
                    </label>

                    <input
                      type="text"
                      {...register("externalUrl")}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />

                    <FieldError message={errors.externalUrl?.message} />
                  </div>
                </>
              )}

              {type === "external_link" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    External URL
                  </label>

                  <input
                    type="text"
                    {...register("externalUrl")}
                    placeholder="https://example.com/article"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />

                  <FieldError message={errors.externalUrl?.message} />
                </div>
              )}

              <div className="pt-1 border-t border-slate-100">
                <FileDropField
                  label="Cover thumbnail (optional)"
                  accept="image/*"
                  fileName={thumbnail?.name}
                  fileSizeLabel={
                    thumbnail ? formatFileSize(thumbnail.size) : undefined
                  }
                  onSelect={handleThumbnailSelect}
                  onClear={handleThumbnailClear}
                  error={errors.thumbnail?.message}
                />
              </div>
            </div>
          </section>

          {/* ORGANIZATION */}
          <section className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6">
            <div className="mb-6">
              <h2 className="text-base font-bold text-slate-900">
                Organization
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Categorize your resource so it can be easily discovered.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Category
              </label>
              <select
                {...register("category")}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              >
                {RESOURCE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {formatCategoryLabel(cat)}
                  </option>
                ))}
              </select>
              <FieldError message={errors.category?.message} />
            </div>
          </section>

          {/* SETTINGS */}
          <section className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6">
            <div className="mb-6">
              <h2 className="text-base font-bold text-slate-900">
                Resource Settings
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure how clients can use this resource.
              </p>
            </div>

            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Downloadable
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Allow clients to download this resource
                </p>
              </div>

              <Controller
                control={control}
                name="isDownloadable"
                render={({ field }) => (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={field.value}
                    onClick={() => field.onChange(!field.value)}
                    className={`group relative inline-flex h-7 w-[52px] shrink-0 items-center rounded-full transition-colors duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 ${
                      field.value
                        ? "bg-emerald-600 shadow-inner shadow-emerald-900/20"
                        : "bg-slate-200 shadow-inner shadow-slate-300/40"
                    }`}
                  >
                    <span
                      className={`absolute left-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                        field.value ? "translate-x-[25px]" : "translate-x-0"
                      }`}
                    >
                      <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        className={`h-3 w-3 transition-all duration-200 ${
                          field.value
                            ? "scale-100 opacity-100 text-emerald-600"
                            : "scale-50 opacity-0 text-slate-300"
                        }`}
                      >
                        <path
                          d="M2.5 6L5 8.5L9.5 3.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                )}
              />
            </div>

            <div className="flex items-start gap-2 mt-5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <Info size={14} className="text-amber-600 mt-0.5 shrink-0" />
              <p className="text-[11px] font-medium text-amber-700">
                File uploads are preview-only until a real resource upload
                endpoint is wired in — the current object URLs will not resolve
                after this session.
              </p>
            </div>
          </section>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/nutritionist/resources")}
              disabled={submitting}
              className="px-5 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition-all disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? "Creating..." : "Create Resource"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
