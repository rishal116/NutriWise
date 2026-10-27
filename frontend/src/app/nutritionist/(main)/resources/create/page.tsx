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
  Image as ImageIcon,
  UploadCloud,
  X,
  Loader2,
} from "lucide-react";

import { nutriResourceService } from "@/services/nutritionist/nutri-resource.service";
import type { CreateNutriResourceDTO } from "@/dtos/nutritionist/resource/create-resource.dto";
import {
  RESOURCE_CATEGORIES,
  type ResourceType,
} from "@/types/nutritionist/resource/resource.types";
import {
  createResourceSchema,
  type CreateResourceFormValues,
} from "@/validations/nutritionist/resource/create-resource.validation";

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
    hint: "PDF file",
    icon: File,
    accent: "rose",
  },
  {
    value: "video",
    label: "Video",
    hint: "Video content",
    icon: Video,
    accent: "purple",
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
  orange: {
    active: "border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20",
    icon: "bg-orange-100/80 text-orange-700",
  },
};

const ACCEPT_MAP: Partial<Record<ResourceType, string>> = {
  pdf: "application/pdf",
  video: "video/mp4,video/webm",
  infographic: "image/jpeg,image/png,image/webp",
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="mt-1.5 text-xs font-semibold text-rose-600">{message}</p>
  );
}

function CharCount({ value, max }: { value: string; max: number }) {
  return (
    <p className="mt-1 text-right text-[11px] font-medium text-slate-400">
      {value.length}/{max}
    </p>
  );
}

function FileDropField({
  label,
  accept,
  hint,
  file,
  onSelect,
  onClear,
  error,
}: {
  label: string;
  accept: string;
  hint: string;
  file?: File;
  onSelect: (file: File) => void;
  onClear: () => void;
  error?: string;
}) {
  const inputId = `resource-file-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-2 block text-xs font-semibold text-slate-700"
      >
        {label}
      </label>

      <p className="mb-2 text-[11px] font-medium text-slate-400">{hint}</p>

      {file ? (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {file.name}
            </p>
            <p className="text-[11px] text-slate-400">
              {formatFileSize(file.size)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClear}
            aria-label={`Remove ${file.name}`}
            className="shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-200"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-8 transition-colors hover:border-emerald-400 hover:bg-emerald-50/40"
        >
          <UploadCloud size={22} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">
            Click to upload
          </span>
          <input
            id={inputId}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(event) => {
              const selectedFile = event.currentTarget.files?.[0];

              if (selectedFile) {
                onSelect(selectedFile);
              }

              event.currentTarget.value = "";
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
      category: RESOURCE_CATEGORIES[0],
    },
  });

  const type = watch("type");
  const description = watch("description");
  const content = watch("content") ?? "";
  const file = watch("file");

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

  const onSubmit = async (values: CreateResourceFormValues) => {
    setSubmitting(true);

    try {
      const dto: CreateNutriResourceDTO = {
        title: values.title.trim(),
        description: values.description.trim(),
        type: values.type,
        category: values.category,
        ...(values.type === "article" && values.content?.trim()
          ? { content: values.content.trim() }
          : {}),
      };

      await nutriResourceService.createResource(dto, values.file);

      toast.success("Resource created successfully");
      router.push("/nutritionist/resources");
    } catch (error) {
      console.error("Create resource failed:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Couldn't create the resource. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 sm:pt-10">
        <header className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/nutritionist/resources")}
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-emerald-700"
          >
            <ArrowLeft size={16} />
            Back to Resources
          </button>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Create Resource
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Add educational content, guides, videos, and useful resources for
            your clients.
          </p>
        </header>
        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.error("Resource validation errors:", errors);
            toast.error("Please fix the form validation errors.");
          })}
          className="space-y-6"
          noValidate
        >
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="mb-6">
              <h2 className="text-base font-bold text-slate-900">
                Basic Information
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Provide the main information about your resource.
              </p>
            </div>

            <div>
              <label
                htmlFor="resource-title"
                className="mb-2 block text-xs font-semibold text-slate-700"
              >
                Title
              </label>
              <input
                id="resource-title"
                type="text"
                maxLength={200}
                {...register("title")}
                placeholder="e.g. Understanding Macronutrients"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
              <FieldError message={errors.title?.message} />
            </div>

            <div className="mt-5">
              <label
                htmlFor="resource-description"
                className="mb-2 block text-xs font-semibold text-slate-700"
              >
                Description
              </label>
              <textarea
                id="resource-description"
                rows={4}
                maxLength={1000}
                {...register("description")}
                placeholder="A short summary clients will see in the resource list"
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
              <CharCount value={description ?? ""} max={1000} />
              <FieldError message={errors.description?.message} />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="mb-6">
              <h2 className="text-base font-bold text-slate-900">
                Resource Type
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Choose the type of content you want to create.
              </p>
            </div>

            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {TYPE_CARDS.map((card) => {
                    const Icon = card.icon;
                    const active = field.value === card.value;
                    const accent = ACCENT_CLASSES[card.accent];

                    return (
                      <button
                        key={card.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          field.onChange(card.value);
                          setValue("file", undefined, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                          setValue(
                            "content",
                            card.value === "article" ? content : "",
                            {
                              shouldValidate: true,
                            },
                          );
                        }}
                        className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all ${
                          active
                            ? accent.active
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent.icon}`}
                        >
                          <Icon size={16} />
                        </span>
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

          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="mb-6">
              <h2 className="text-base font-bold text-slate-900">Content</h2>
              <p className="mt-1 text-xs text-slate-400">
                Add the main content or upload your resource file.
              </p>
            </div>

            {type === "article" ? (
              <div>
                <label
                  htmlFor="resource-content"
                  className="mb-2 block text-xs font-semibold text-slate-700"
                >
                  Article content
                </label>
                <textarea
                  id="resource-content"
                  rows={10}
                  maxLength={20000}
                  {...register("content")}
                  placeholder="Write the full article content here"
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                />
                <CharCount value={content} max={20000} />
                <FieldError message={errors.content?.message} />
              </div>
            ) : (
              <FileDropField
                label={
                  type === "pdf"
                    ? "PDF file"
                    : type === "video"
                      ? "Video file"
                      : "Infographic image"
                }
                accept={ACCEPT_MAP[type] ?? ""}
                hint={
                  type === "pdf"
                    ? "PDF · Max 10 MB"
                    : type === "video"
                      ? "MP4 or WebM · Max 100 MB"
                      : "JPG, PNG or WebP · Max 10 MB"
                }
                file={file}
                onSelect={handleFileSelect}
                onClear={handleFileClear}
                error={errors.file?.message}
              />
            )}
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="mb-6">
              <h2 className="text-base font-bold text-slate-900">
                Organization
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Categorize your resource so clients can discover it easily.
              </p>
            </div>

            <div>
              <label
                htmlFor="resource-category"
                className="mb-2 block text-xs font-semibold text-slate-700"
              >
                Category
              </label>
              <select
                id="resource-category"
                {...register("category")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              >
                {RESOURCE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {formatCategoryLabel(category)}
                  </option>
                ))}
              </select>
              <FieldError message={errors.category?.message} />
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/nutritionist/resources")}
              disabled={submitting}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
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
