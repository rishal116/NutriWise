"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  Eye,
  Heart,
  MessageCircle,
  Search,
  Trash2,
  LoaderCircle,
  RefreshCw,
  UserRound,
  ExternalLink,
} from "lucide-react";

import { adminResourceService } from "@/services/admin/admin-resource.service";
import type { AdminResourceListItemDTO } from "@/dtos/admin/resource/admin-resource-list-item.dto";

const PAGE_SIZE = 10;

export default function AdminResources() {
  const [resources, setResources] = useState<AdminResourceListItemDTO[]>([]);
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadResources = useCallback(
    async (nextCursor?: string, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await adminResourceService.getResources({
          limit: PAGE_SIZE,
          cursor: nextCursor,
        });

        if (!response.success || !response.data) {
          toast.error(response.message || "Unable to load resources.");
          return;
        }

        const result = response.data;

        setResources((previous) =>
          append ? [...previous, ...result.items] : result.items,
        );
        setCursor(result.nextCursor ?? undefined);
        setHasMore(result.hasMore);
      } catch {
        toast.error("Unable to load resources.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadResources();
  }, [loadResources]);

  const filteredResources = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesSearch =
        !normalizedSearch ||
        resource.title.toLowerCase().includes(normalizedSearch) ||
        resource.description.toLowerCase().includes(normalizedSearch) ||
        (resource.createdBy?.fullName ?? "")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesType =
        typeFilter === "all" || resource.type === typeFilter;

      const matchesCategory =
        categoryFilter === "all" || resource.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" || resource.status === statusFilter;

      return (
        matchesSearch && matchesType && matchesCategory && matchesStatus
      );
    });
  }, [resources, search, typeFilter, categoryFilter, statusFilter]);

  const handleDelete = async (resourceId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resource? This action may be permanent.",
    );

    if (!confirmed) return;

    setDeletingId(resourceId);

    try {
      await adminResourceService.deleteResource(resourceId);

      setResources((previous) =>
        previous.filter((resource) => resource.id !== resourceId),
      );

      toast.success("Resource deleted successfully.");
    } catch {
      toast.error("Unable to delete resource.");
    } finally {
      setDeletingId(null);
    }
  };

  const categories = useMemo(
    () => [...new Set(resources.map((resource) => resource.category))],
    [resources],
  );

  const resourceTypes = useMemo(
    () => [...new Set(resources.map((resource) => resource.type))],
    [resources],
  );

  const resourceStatuses = useMemo(
    () => [...new Set(resources.map((resource) => resource.status))],
    [resources],
  );

  return (
    <section className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="size-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage Resources
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Review nutrition resources and manage published content.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadResources()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <RefreshCw className="size-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Loaded resources" value={resources.length} />
        <StatCard
          label="Total views"
          value={resources.reduce(
            (total, resource) => total + resource.viewCount,
            0,
          )}
        />
        <StatCard
          label="Total likes"
          value={resources.reduce(
            (total, resource) => total + resource.likeCount,
            0,
          )}
        />
      </div>

      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, description, or creator..."
            className="w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 dark:border-gray-700"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <FilterSelect
            label="Type"
            value={typeFilter}
            onChange={setTypeFilter}
            options={resourceTypes}
          />
          <FilterSelect
            label="Category"
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categories}
          />
          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={resourceStatuses}
          />
        </div>

        <p className="text-sm text-gray-500">
          Showing {filteredResources.length} of {resources.length} loaded
          resources
        </p>
      </div>

      {loading ? (
        <LoadingState />
      ) : filteredResources.length === 0 ? (
        <EmptyState message="No matching resources found." />
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredResources.map((resource) => (
            <article
              key={resource.id}
              className="min-w-0 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium capitalize text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {resource.type.replaceAll("_", " ")}
                    </span>
                    <StatusBadge status={resource.status} />
                  </div>

                  <h2 className="mt-3 break-words text-lg font-semibold text-gray-900 dark:text-white">
                    {resource.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {resource.category.replaceAll("_", " ")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void handleDelete(resource.id)}
                  disabled={deletingId === resource.id}
                  aria-label={`Delete resource ${resource.title}`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950"
                >
                  {deletingId === resource.id ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                  Delete
                </button>
              </div>

              <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700 dark:text-gray-300">
                {resource.description}
              </p>

              {resource.content && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    View resource content
                  </summary>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {resource.content}
                  </p>
                </details>
              )}

              {resource.fileUrl && (
                <a
                  href={resource.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 break-all text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                >
                  Open resource file
                  <ExternalLink className="size-4 shrink-0" />
                </a>
              )}

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                {resource.createdBy?.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resource.createdBy.profileImage}
                    alt={resource.createdBy.fullName}
                    className="size-7 rounded-full object-cover"
                  />
                ) : (
                  <UserRound className="size-5" />
                )}
                <span className="truncate">
                  {resource.createdBy?.fullName ?? "Unknown creator"}
                </span>
                <span aria-hidden="true">·</span>
                <span className="shrink-0">
                  {new Date(resource.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-5 border-t border-gray-100 pt-4 text-sm text-gray-500 dark:border-gray-800">
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="size-4" />
                  {resource.viewCount} views
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Heart className="size-4" />
                  {resource.likeCount} likes
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MessageCircle className="size-4" />
                  {resource.commentCount} comments
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => void loadResources(cursor, true)}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loadingMore && (
              <LoaderCircle className="size-4 animate-spin" />
            )}
            {loadingMore ? "Loading..." : "Load more resources"}
          </button>
        </div>
      )}
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm capitalize outline-none focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-900"
      >
        <option value="all">All {label.toLowerCase()}s</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option.replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colorClass =
    status === "published"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
      : status === "draft"
        ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${colorClass}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-gray-500">
      <LoaderCircle className="size-5 animate-spin" />
      Loading resources...
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 px-6 py-16 text-center dark:border-gray-700">
      <BookOpen className="mx-auto size-10 text-gray-400" />
      <p className="mt-3 font-medium text-gray-700 dark:text-gray-300">
        {message}
      </p>
    </div>
  );
}