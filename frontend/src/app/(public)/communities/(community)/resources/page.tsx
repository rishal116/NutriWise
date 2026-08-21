"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bookmark,
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  PlayCircle,
  Search,
} from "lucide-react";

import { publicResourceService } from "@/services/public/publicResource.service";
import { getErrorMessage } from "@/utils/getErrorMessage"; // adjust to actual path

import type { PublicResourceListItemDTO } from "@/dtos/public/resource/public-resource-list-item.dto";
import type {
  PublicResourceCategory,
  PublicResourceListQueryDTO,
  PublicResourceSortBy,
  PublicResourceType,
} from "@/dtos/public/resource/public-resource-list-query.dto";

const RESOURCE_TYPES: { value: PublicResourceType | ""; label: string }[] = [
  { value: "", label: "All Types" },
  { value: "article", label: "Articles" },
  { value: "pdf", label: "PDFs" },
  { value: "video", label: "Videos" },
  { value: "external_link", label: "External Links" },
  { value: "infographic", label: "Infographics" },
];

const RESOURCE_CATEGORIES: {
  value: PublicResourceCategory | "";
  label: string;
}[] = [
  { value: "", label: "All Categories" },
  { value: "nutrition", label: "Nutrition" },
  { value: "fitness", label: "Fitness" },
  { value: "wellness", label: "Wellness" },
  { value: "recipes", label: "Recipes" },
];

const RESOURCE_SORT_OPTIONS: { value: PublicResourceSortBy; label: string }[] =
  [
    { value: "LATEST", label: "Latest" },
    { value: "OLDEST", label: "Oldest" },
    { value: "MOST_VIEWED", label: "Most Viewed" },
    { value: "MOST_DOWNLOADED", label: "Most Downloaded" },
    { value: "TITLE_ASC", label: "Title A-Z" },
    { value: "TITLE_DESC", label: "Title Z-A" },
  ];

const SEARCH_DEBOUNCE_MS = 400;
const PAGE_LIMIT = 12;

export default function PublicResourcesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [type, setType] = useState<PublicResourceType | "">("");
  const [category, setCategory] = useState<PublicResourceCategory | "">("");
  const [sortBy, setSortBy] = useState<PublicResourceSortBy>("LATEST");

  const [resources, setResources] = useState<PublicResourceListItemDTO[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Bump this to force a refetch of page 1 without changing the query itself
  // (used by the "Try Again" button on error).
  const [refetchToken, setRefetchToken] = useState(0);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [searchInput]);

  const query = useMemo<PublicResourceListQueryDTO>(
    () => ({
      limit: PAGE_LIMIT,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(type ? { type } : {}),
      ...(category ? { category } : {}),
      sortBy,
    }),
    [debouncedSearch, type, category, sortBy],
  );

  const fetchFirstPage = useCallback(async (q: PublicResourceListQueryDTO) => {
    setLoading(true);
    setError(null);

    try {
      const response = await publicResourceService.getResources(q);
      const data = response.data;

      setResources(data.items);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Single source of truth: query change OR refetchToken bump -> reload page 1.
  useEffect(() => {
    fetchFirstPage(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(query), refetchToken]);

  const loadMore = async () => {
    if (!cursor || loadingMore) return;

    setLoadingMore(true);
    setError(null);

    try {
      const response = await publicResourceService.getResources({
        ...query,
        cursor,
      });
      const data = response.data;

      setResources((prev) => [...prev, ...data.items]);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingMore(false);
    }
  };

  const getResourceIcon = (resourceType: PublicResourceType) => {
    switch (resourceType) {
      case "video":
        return <PlayCircle size={48} />;
      case "pdf":
      case "article":
        return <FileText size={48} />;
      case "infographic":
        return <ImageIcon size={48} />;
      default:
        return <FileText size={48} />;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-700">
              NutriWise Resources
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Learn. Eat better. Live healthier.
            </h1>

            <p className="mt-3 text-slate-600">
              Explore expert nutrition, fitness, wellness, and recipe resources
              curated by nutrition professionals.
            </p>
          </div>

          <div className="mt-8 flex max-w-3xl gap-3">
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search resources..."
                aria-label="Search resources"
                className="w-full rounded-xl border border-slate-200/80 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <button
              type="button"
              onClick={() => setDebouncedSearch(searchInput.trim())}
              className="rounded-xl bg-emerald-700 px-6 py-3 font-medium text-white shadow-xs transition hover:-translate-y-0.5 hover:bg-emerald-800"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as PublicResourceType | "")}
            aria-label="Filter by resource type"
            className="rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-sm text-slate-700 outline-none focus:border-emerald-600"
          >
            {RESOURCE_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as PublicResourceCategory | "")
            }
            aria-label="Filter by category"
            className="rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-sm text-slate-700 outline-none focus:border-emerald-600"
          >
            {RESOURCE_CATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as PublicResourceSortBy)}
            aria-label="Sort resources"
            className="rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-sm text-slate-700 outline-none focus:border-emerald-600"
          >
            {RESOURCE_SORT_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Resources */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loading ? (
          <ResourceSkeleton />
        ) : error ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-xs">
            <p className="text-rose-600">{error}</p>

            <button
              onClick={() => setRefetchToken((t) => t + 1)}
              className="mt-4 rounded-xl bg-emerald-700 px-5 py-2 text-sm font-medium text-white shadow-xs transition hover:-translate-y-0.5 hover:bg-emerald-800"
            >
              Try Again
            </button>
          </div>
        ) : resources.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
            <FileText size={40} className="mx-auto text-slate-400" />

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No resources found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Resources
              </h2>

              <span className="text-sm text-slate-500">
                {resources.length} resources
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <ResourceCard
                  key={resource.resourceId}
                  resource={resource}
                  getResourceIcon={getResourceIcon}
                />
              ))}
            </div>

            {hasMore && cursor && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="rounded-xl border border-slate-200/80 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-xs transition hover:-translate-y-0.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function ResourceCard({
  resource,
  getResourceIcon,
}: {
  resource: PublicResourceListItemDTO;
  getResourceIcon: (type: PublicResourceType) => React.ReactNode;
}) {
  return (
    <Link
      href={`/communities/resources/${resource.resourceId}`}
      className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        {resource.thumbnailUrl ? (
          <Image
            src={resource.thumbnailUrl}
            alt={resource.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            {getResourceIcon(resource.type)}
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium capitalize text-slate-700">
          {resource.type.replace("_", " ")}
        </span>
      </div>

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          {resource.category}
        </p>

        <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-slate-900">
          {resource.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
          {resource.description}
        </p>

        <div className="mt-5 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Eye size={14} />
            {resource.viewCount}
          </span>

          <span className="flex items-center gap-1">
            <Download size={14} />
            {resource.downloadCount}
          </span>

          <span className="flex items-center gap-1">
            <Bookmark size={14} />
            {resource.bookmarkCount}
          </span>
        </div>
      </div>
    </Link>
  );
}

function ResourceSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs"
        >
          <div className="aspect-video animate-pulse bg-slate-200" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
