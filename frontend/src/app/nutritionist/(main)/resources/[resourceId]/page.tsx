"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
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
  MessageSquare,
  Send,
  Archive,
  ExternalLink,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { nutriResourceService } from "@/services/nutritionist/nutri-resource.service";
import type { NutriResourceDTO } from "@/dtos/nutritionist/resource/nutri-resource.dto";
import type { UpdateNutriResourceDTO } from "@/dtos/nutritionist/resource/update-resource.dto";
import {
  RESOURCE_TYPES,
  RESOURCE_CATEGORIES,
  type ResourceType,
} from "@/types/nutritionist/resource/resource.types";
import ResourceEngagement from "@/components/nutritionist/resource-details/ResourceEngagement";
import ResourceComments from "@/components/nutritionist/resource-details/ResourceComments";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const editResourceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
  type: z.enum(RESOURCE_TYPES),
  content: z.string().optional(),
  category: z.enum(RESOURCE_CATEGORIES),
});

type EditResourceFormValues = z.infer<typeof editResourceSchema>;

// ---------------------------------------------------------------------------
// Static configuration
// ---------------------------------------------------------------------------

const TYPE_META: Record<
  ResourceType,
  { label: string; icon: typeof FileText; accent: string }
> = {
  article: {
    label: "Article",
    icon: FileText,
    accent: "emerald",
  },
  pdf: {
    label: "PDF",
    icon: File,
    accent: "rose",
  },
  video: {
    label: "Video",
    icon: Video,
    accent: "purple",
  },
  infographic: {
    label: "Infographic",
    icon: ImageIcon,
    accent: "orange",
  },
};

const ACCENT_CLASSES: Record<string, string> = {
  emerald: "bg-emerald-100/80 text-emerald-700",
  rose: "bg-rose-100/80 text-rose-700",
  purple: "bg-purple-100/80 text-purple-700",
  orange: "bg-orange-100/80 text-orange-700",
};

function statusPillClasses(status: NutriResourceDTO["status"]): string {
  switch (status) {
    case "published":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "draft":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "archived":
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

function formatLabel(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(value?: Date | string): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="mt-1.5 text-xs font-semibold text-rose-600">{message}</p>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ResourceDetailsPage() {
  const router = useRouter();
  const params = useParams<{ resourceId: string }>();
  const resourceId = params.resourceId;

  const [resource, setResource] = useState<NutriResourceDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditResourceFormValues>({
    resolver: zodResolver(editResourceSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "article",
      content: "",
      category: RESOURCE_CATEGORIES[0],
    },
  });

  const editType = watch("type");

  const loadResource = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await nutriResourceService.getResourceDetails(resourceId);

      setResource(data);
      setIsLiked(data.isLikedByMe ?? false);
      setViewCount(data.viewCount);
      setLikeCount(data.likeCount);
      setCommentCount(data.commentCount);
    } catch {
      setError("Couldn't load this resource. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [resourceId]);

  useEffect(() => {
    void loadResource();
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
        title: values.title.trim(),
        description: values.description.trim(),
        type: values.type,
        category: values.category,
        content:
          values.type === "article"
            ? values.content?.trim() || undefined
            : undefined,
      };

      await nutriResourceService.updateResource(resourceId, dto);
      await loadResource();

      setEditing(false);
      toast.success("Resource updated successfully");
    } catch {
      toast.error("Couldn't save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);

    try {
      await nutriResourceService.publishResource(resourceId);
      await loadResource();
      toast.success("Resource published successfully");
    } catch {
      toast.error("Couldn't publish this resource. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  const handleArchive = async () => {
    setArchiving(true);

    try {
      await nutriResourceService.archiveResource(resourceId);
      await loadResource();
      toast.success("Resource archived successfully");
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-sm rounded-2xl border border-slate-200/80 bg-white px-10 py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
            <AlertCircle className="text-rose-600" size={24} />
          </div>

          <h2 className="text-base font-bold text-slate-600">
            {error ?? "Resource not found"}
          </h2>

          <button
            type="button"
            onClick={() => void loadResource()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
          >
            <RefreshCw size={14} />
            Retry
          </button>

          <button
            type="button"
            onClick={() => router.push("/nutritionist/resources")}
            className="mt-3 block w-full text-sm font-semibold text-slate-500 hover:text-emerald-700"
          >
            Back to resources
          </button>
        </div>
      </div>
    );
  }

  const meta = TYPE_META[resource.type];
  const Icon = meta.icon;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 sm:pt-10">
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => router.push("/nutritionist/resources")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-emerald-700"
          >
            <ArrowLeft size={16} />
            Back to Resources
          </button>

          {!editing && (
            <div className="flex flex-wrap items-center gap-2">
              {resource.status === "draft" && (
                <button
                  type="button"
                  onClick={() => void handlePublish()}
                  disabled={publishing || archiving}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
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
                  type="button"
                  onClick={() => void handleArchive()}
                  disabled={archiving || publishing}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
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
                type="button"
                onClick={startEditing}
                disabled={publishing || archiving}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60"
              >
                <Pencil size={15} />
                Edit
              </button>
            </div>
          )}
        </header>

        {editing ? (
          <EditForm
            register={register}
            errors={errors}
            editType={editType}
            saving={saving}
            onCancel={() => setEditing(false)}
            onSubmit={handleSubmit(onSave)}
          />
        ) : (
          <>
            <section
              className={`relative mb-6 flex h-52 items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 sm:h-64 ${ACCENT_CLASSES[meta.accent]}`}
              aria-label={`${meta.label} resource`}
            >
              <Icon size={48} strokeWidth={1.5} aria-hidden="true" />

              <span
                className={`absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusPillClasses(resource.status)}`}
              >
                {resource.status}
              </span>

              <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
                {meta.label}
              </span>
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                      {formatLabel(resource.category)}
                    </span>

                    <span className="text-[11px] font-medium text-slate-400">
                      {meta.label}
                    </span>
                  </div>

                  <h1 className="mb-3 text-2xl font-bold tracking-tight text-slate-900">
                    {resource.title}
                  </h1>

                  <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                    {resource.description}
                  </p>
                </section>

                <ResourceContent resource={resource} meta={meta} />
              </div>
              {resource.status === "published" && (
                <ResourceComments
                  resourceId={resource.resourceId}
                  onCommentCountChange={(change) => {
                    setCommentCount((count) => Math.max(0, count + change));
                  }}
                />
              )}

              <aside className="space-y-6">
                <ResourceEngagement
                  resourceId={resource.resourceId}
                  viewCount={viewCount}
                  likeCount={likeCount}
                  commentCount={commentCount}
                  isLiked={isLiked}
                  isViewed={resource.isViewedByMe ?? false}
                  onLikeStateChange={(liked) => {
                    setIsLiked(liked);
                    setLikeCount((count) =>
                      Math.max(0, count + (liked ? 1 : -1)),
                    );
                  }}
                />

                <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
                  <h2 className="mb-4 text-sm font-bold text-slate-900">
                    Details
                  </h2>

                  <dl className="space-y-3 text-sm">
                    <DetailRow
                      label="Published"
                      value={formatDate(resource.publishedAt)}
                    />
                    <DetailRow
                      label="Created"
                      value={formatDate(resource.createdAt)}
                    />
                    <DetailRow
                      label="Last updated"
                      value={formatDate(resource.updatedAt)}
                    />
                  </dl>
                </section>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Resource content
// ---------------------------------------------------------------------------

function ResourceContent({
  resource,
  meta,
}: {
  resource: NutriResourceDTO;
  meta: { label: string; icon: typeof FileText };
}) {
  const Icon = meta.icon;

  return (
    <div className="space-y-6">
      {resource.type === "article" && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="mb-4 flex items-center gap-2">
            <Icon size={16} className="text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Article content
            </h2>
          </div>

          {resource.content ? (
            <div className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-600">
              {resource.content}
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              No additional article content.
            </p>
          )}
        </section>
      )}

      {resource.type !== "article" && resource.content && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <h2 className="mb-4 text-sm font-bold text-slate-900">
            Description and notes
          </h2>

          <div className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-600">
            {resource.content}
          </div>
        </section>
      )}

      {resource.type !== "article" && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <h2 className="mb-4 text-sm font-bold text-slate-900">
            {meta.label} file
          </h2>

          {resource.fileUrl ? (
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              <ExternalLink size={15} />
              Open {meta.label.toLowerCase()}
            </a>
          ) : (
            <p className="text-sm text-slate-400">
              No {meta.label.toLowerCase()} file uploaded.
            </p>
          )}
        </section>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Edit form
// ---------------------------------------------------------------------------

function EditForm({
  register,
  errors,
  editType,
  saving,
  onCancel,
  onSubmit,
}: {
  register: ReturnType<typeof useForm<EditResourceFormValues>>["register"];
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
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h2 className="mb-6 text-base font-bold text-slate-900">
          Edit resource
        </h2>

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
            aria-invalid={Boolean(errors.title)}
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
            aria-invalid={Boolean(errors.description)}
            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
          />
          <FieldError message={errors.description?.message} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="resource-type"
              className="mb-2 block text-xs font-semibold text-slate-700"
            >
              Type
            </label>
            <select
              id="resource-type"
              {...register("type")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            >
              {RESOURCE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {formatLabel(type)}
                </option>
              ))}
            </select>
            <FieldError message={errors.type?.message} />
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
                  {formatLabel(category)}
                </option>
              ))}
            </select>
            <FieldError message={errors.category?.message} />
          </div>
        </div>

        {editType === "article" && (
          <div className="mt-5">
            <label
              htmlFor="resource-content"
              className="mb-2 block text-xs font-semibold text-slate-700"
            >
              Article content
            </label>
            <textarea
              id="resource-content"
              rows={10}
              {...register("content")}
              aria-invalid={Boolean(errors.content)}
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            />
            <FieldError message={errors.content?.message} />
          </div>
        )}

        {editType !== "article" && (
          <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
            Changing the resource type does not upload or convert a file. The
            existing file remains unchanged. Only change the type if the
            existing resource already matches the selected type.
          </p>
        )}
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
        >
          <X size={15} />
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Reusable components
// ---------------------------------------------------------------------------

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
    <div className="rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-3">
      <div className="mb-1 flex items-center gap-1.5 text-slate-400">
        <Icon size={13} />
        <span className="text-[10px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-lg font-bold text-slate-800">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="font-medium text-slate-400">{label}</dt>
      <dd className="text-right font-semibold text-slate-700">{value}</dd>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto max-w-5xl animate-pulse px-4 pt-8 sm:px-6 sm:pt-10">
        <div className="mb-8 h-5 w-32 rounded bg-slate-200" />
        <div className="mb-6 h-52 rounded-2xl bg-slate-200 sm:h-64" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="h-40 rounded-2xl border border-slate-200/80 bg-white" />
            <div className="h-56 rounded-2xl border border-slate-200/80 bg-white" />
          </div>

          <div className="space-y-6">
            <div className="h-48 rounded-2xl border border-slate-200/80 bg-white" />
            <div className="h-40 rounded-2xl border border-slate-200/80 bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
