"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Image from "next/image";
import {
  ArrowLeft,
  FileText,
  File,
  Video,
  Image as ImageIcon,
  Pencil,
  X,
  Loader2,
  Eye,
  Heart,
  Bookmark,
  MessageSquare,
  Send,
  Archive,
  ExternalLink,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { nutriResourceService } from "@/services/nutritionist/nutriResource.service";
import type { NutriResourceDetailsResponseDTO } from "@/dtos/nutritionist/resource/resource-details-response.dto";
import type { UpdateNutriResourceDTO } from "@/dtos/nutritionist/resource/update-resource.dto";
import {
  RESOURCE_TYPES,
  RESOURCE_CATEGORIES,
  type ResourceType,
} from "@/types/nutritionist/resource/resource.types";

// ---------------------------------------------------------------------------
// Schema (edit form)
// ---------------------------------------------------------------------------

const editResourceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000),
  type: z.enum(RESOURCE_TYPES),
  content: z.string().trim().optional(),
  externalUrl: z
    .string()
    .trim()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),
  category: z.enum(RESOURCE_CATEGORIES),
  isDownloadable: z.boolean(),
});

type EditResourceFormValues = z.infer<typeof editResourceSchema>;

// ---------------------------------------------------------------------------
// Static config
// ---------------------------------------------------------------------------

const TYPE_META: Record<
  ResourceType,
  { label: string; icon: typeof FileText; accent: string }
> = {
  article: { label: "Article", icon: FileText, accent: "emerald" },
  pdf: { label: "PDF", icon: File, accent: "rose" },
  video: { label: "Video", icon: Video, accent: "purple" },
  infographic: { label: "Infographic", icon: ImageIcon, accent: "orange" },
};

const ACCENT_CLASSES: Record<string, string> = {
  emerald: "bg-emerald-100/80 text-emerald-700",
  rose: "bg-rose-100/80 text-rose-700",
  purple: "bg-purple-100/80 text-purple-700",
  sky: "bg-sky-100/80 text-sky-700",
  orange: "bg-orange-100/80 text-orange-700",
};

function statusPillClasses(status: string): string {
  switch (status) {
    case "published":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "draft":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "archived":
      return "bg-slate-100 text-slate-600 border-slate-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

function formatLabel(value: string): string {
  return value
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatDate(value?: Date | string): string {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs font-semibold text-rose-600 mt-1.5">{message}</p>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ResourceDetailsPage() {
  const router = useRouter();
  const params = useParams<{ resourceId: string }>();
  const resourceId = params.resourceId;

  const [resource, setResource] =
    useState<NutriResourceDetailsResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditResourceFormValues>({
    resolver: zodResolver(editResourceSchema),
  });

  const editType = watch("type");

  const loadResource = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await nutriResourceService.getResourceDetails(resourceId);
      setResource(data);
    } catch {
      setError("Couldn't load this resource. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [resourceId]);

  useEffect(() => {
    loadResource();
  }, [loadResource]);

  const startEditing = () => {
    if (!resource) return;
    reset({
      title: resource.title,
      description: resource.description,
      type: resource.type,
      content: resource.content ?? "",
      category: resource.category,
    });
    setEditing(true);
  };

  const onSave = async (values: EditResourceFormValues) => {
    setSaving(true);
    try {
      const dto: UpdateNutriResourceDTO = {
        title: values.title,
        description: values.description,
        type: values.type,
        content: values.content || undefined,
        category: values.category,
      };

      const updated = await nutriResourceService.updateResource(
        resourceId,
        dto,
      );
      setResource(updated);
      setEditing(false);
      toast.success("Resource updated");
    } catch {
      toast.error("Couldn't save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const updated = await nutriResourceService.publishResource(resourceId);
      setResource(updated);
      toast.success("Resource published");
    } catch {
      toast.error("Couldn't publish this resource. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  const handleArchive = async () => {
    setArchiving(true);
    try {
      const updated = await nutriResourceService.archiveResource(resourceId);
      setResource(updated);
      toast.success("Resource archived");
    } catch {
      toast.error("Couldn't archive this resource. Please try again.");
    } finally {
      setArchiving(false);
    }
  };

  if (loading) {
    return <DetailsSkeleton />;
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl py-16 px-10 text-center border border-slate-200/80 max-w-sm">
          <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-rose-600" size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-600">
            {error ?? "Resource not found"}
          </h3>
          <button
            onClick={loadResource}
            className="mt-4 inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const meta = TYPE_META[resource.type];
  const Icon = meta.icon;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <button
            type="button"
            onClick={() => router.push("/nutritionist/resources")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Resources
          </button>

          {!editing && (
            <div className="flex flex-wrap items-center gap-2">
              {resource.status === "draft" && (
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60"
                >
                  {publishing ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Send size={15} />
                  )}
                  Publish
                </button>
              )}

              {resource.status !== "archived" && (
                <button
                  onClick={handleArchive}
                  disabled={archiving}
                  className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60"
                >
                  {archiving ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Archive size={15} />
                  )}
                  Archive
                </button>
              )}

              <button
                onClick={startEditing}
                className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
              >
                <Pencil size={15} />
                Edit
              </button>
            </div>
          )}
        </div>

        {editing ? (
          <EditForm
            register={register}
            control={control}
            errors={errors}
            editType={editType}
            saving={saving}
            onCancel={() => setEditing(false)}
            onSubmit={handleSubmit(onSave)}
          />
        ) : (
          <>
            {/* COVER */}
            <div className="relative h-52 sm:h-64 rounded-2xl overflow-hidden border border-slate-200/80 mb-6">
              {resource.thumbnailUrl ? (
                <Image
                  src={resource.thumbnailUrl}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 800px, 100vw"
                  className="object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center ${ACCENT_CLASSES[meta.accent]}`}
                >
                  <Icon size={40} strokeWidth={1.5} />
                </div>
              )}

              <span
                className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full border capitalize backdrop-blur-sm ${statusPillClasses(resource.status)}`}
              >
                {resource.status}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* MAIN */}
              <div className="lg:col-span-2 space-y-6">
                <section className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6">
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-1">
                      {formatLabel(resource.category)}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {meta.label}
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-3">
                    {resource.title}
                  </h1>

                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {resource.description}
                  </p>
                </section>

                <ResourceContent resource={resource} meta={meta} />
              </div>

              {/* SIDEBAR */}
              <div className="space-y-6">
                <section className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6">
                  <h2 className="text-sm font-bold text-slate-900 mb-4">
                    Engagement
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <StatCard
                      icon={Eye}
                      label="Views"
                      value={resource.viewCount}
                    />

                    <StatCard
                      icon={Heart}
                      label="Likes"
                      value={resource.likeCount}
                    />
                    <StatCard
                      icon={Bookmark}
                      label="Bookmarks"
                      value={resource.bookmarkCount}
                    />

                    <StatCard
                      icon={MessageSquare}
                      label="Comments"
                      value={resource.commentCount}
                    />
                  </div>
                </section>

                <section className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6">
                  <h2 className="text-sm font-bold text-slate-900 mb-4">
                    Details
                  </h2>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-400 font-medium">Published</dt>
                      <dd className="font-semibold text-slate-700">
                        {formatDate(resource.publishedAt)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-400 font-medium">Created</dt>
                      <dd className="font-semibold text-slate-700">
                        {formatDate(resource.createdAt)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-400 font-medium">
                        Last updated
                      </dt>
                      <dd className="font-semibold text-slate-700">
                        {formatDate(resource.updatedAt)}
                      </dd>
                    </div>
                  </dl>
                </section>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Content block (type-specific)
// ---------------------------------------------------------------------------

function ResourceContent({
  resource,
  meta,
}: {
  resource: NutriResourceDetailsResponseDTO;
  meta: { label: string; icon: typeof FileText };
}) {
  const Icon = meta.icon;

  return (
    <div className="space-y-6">
      {/* RESOURCE CONTENT */}
      {resource.content && (
        <section className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6">
          <div className="flex items-center gap-2 mb-4">
            <Icon size={16} className="text-emerald-600" />

            <h2 className="text-sm font-bold text-slate-900">
              Resource content
            </h2>
          </div>

          <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {resource.content}
          </div>
        </section>
      )}

      {/* ARTICLE */}
      {resource.type === "article" && !resource.content && (
        <section className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4">
            Resource content
          </h2>

          <p className="text-sm text-slate-400">
            No additional content added yet.
          </p>
        </section>
      )}

      {/* PDF */}
      {resource.type === "pdf" && (
        <section className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4">PDF file</h2>

          {resource.fileUrl ? (
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              <ExternalLink size={15} />
              Open PDF
            </a>
          ) : (
            <p className="text-sm text-slate-400">No PDF file uploaded yet.</p>
          )}
        </section>
      )}

      {/* VIDEO */}
      {resource.type === "video" && (
        <section className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Video</h2>

          {resource.fileUrl ? (
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              <ExternalLink size={15} />
              Open video
            </a>
          ) : (
            <p className="text-sm text-slate-400">
              No video file uploaded yet.
            </p>
          )}
        </section>
      )}

      {/* INFOGRAPHIC */}
      {resource.type === "infographic" && (
        <section className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Infographic</h2>

          {resource.fileUrl ? (
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              <ExternalLink size={15} />
              Open infographic
            </a>
          ) : (
            <p className="text-sm text-slate-400">
              No infographic uploaded yet.
            </p>
          )}
        </section>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Eye;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-slate-50 rounded-xl px-3 py-3 border border-slate-200/80">
      <div className="flex items-center gap-1.5 text-slate-400 mb-1">
        <Icon size={13} />
        <span className="text-[10px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-lg font-bold text-slate-800">{value}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Edit form
// ---------------------------------------------------------------------------

function EditForm({
  register,
  control,
  errors,
  editType,
  saving,
  onCancel,
  onSubmit,
}: {
  register: ReturnType<typeof useForm<EditResourceFormValues>>["register"];
  control: ReturnType<typeof useForm<EditResourceFormValues>>["control"];
  errors: ReturnType<
    typeof useForm<EditResourceFormValues>
  >["formState"]["errors"];
  editType: ResourceType;
  saving: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <section className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6">
        <h2 className="text-base font-bold text-slate-900 mb-6">
          Edit resource
        </h2>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Title
          </label>
          <input
            type="text"
            {...register("title")}
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
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
          />
          <FieldError message={errors.description?.message} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Type
            </label>
            <select
              {...register("type")}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            >
              {RESOURCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {formatLabel(t)}
                </option>
              ))}
            </select>
            <FieldError message={errors.type?.message} />
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
                  {formatLabel(cat)}
                </option>
              ))}
            </select>
            <FieldError message={errors.category?.message} />
          </div>
        </div>

        {editType === "article" && (
          <div className="mt-5">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Article content
            </label>
            <textarea
              {...register("content")}
              rows={10}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-y"
            />
            <FieldError message={errors.content?.message} />
          </div>
        )}

        {editType === "video" && (
          <div className="mt-5">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              External URL
            </label>
            <input
              type="text"
              {...register("externalUrl")}
              placeholder="https://..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <FieldError message={errors.externalUrl?.message} />
          </div>
        )}

        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 mt-5">
          <p className="text-sm font-semibold text-slate-800">Downloadable</p>
          <Controller
            control={control}
            name="isDownloadable"
            render={({ field }) => (
              <button
                type="button"
                role="switch"
                aria-checked={field.value}
                onClick={() => field.onChange(!field.value)}
                className={`relative inline-flex h-7 w-[52px] shrink-0 items-center rounded-full transition-colors duration-300 ${
                  field.value ? "bg-emerald-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute left-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                    field.value ? "translate-x-[25px]" : "translate-x-0"
                  }`}
                />
              </button>
            )}
          />
        </div>
      </section>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
        >
          <X size={15} />
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition-all disabled:opacity-60"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function DetailsSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 animate-pulse">
        <div className="h-5 w-32 bg-slate-200 rounded mb-8" />
        <div className="h-64 bg-slate-200 rounded-2xl mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-40 bg-white border border-slate-200/80 rounded-2xl" />
            <div className="h-56 bg-white border border-slate-200/80 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-white border border-slate-200/80 rounded-2xl" />
            <div className="h-40 bg-white border border-slate-200/80 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
