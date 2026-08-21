"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  FileText,
  File,
  Video,
  Link as LinkIcon,
  Image as ImageIcon,
  ChevronRight,
  RefreshCw,
  Inbox,
  AlertCircle,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { nutriResourceService } from "@/services/nutritionist/nutriResource.service";

import type { NutriResourceListItemDTO } from "@/dtos/nutritionist/resource/resource-list-response.dto";
import type { GetNutriResourcesQueryDTO } from "@/dtos/nutritionist/resource/resource-list-query.dto";
import { NutriResourceSortBy } from "@/dtos/nutritionist/resource/resource-list-query.dto";

import {
  RESOURCE_CATEGORIES,
  type ResourceCategory,
  type ResourceStatus,
  type ResourceType,
} from "@/types/nutritionist/resource/resource.types";

import { useDebounce } from "@/hooks/common/debounce.hooks";

const PAGE_LIMIT = 12;

const STATUS_OPTIONS: { label: string; value: ResourceStatus | "all" }[] = [
  { label: "All statuses", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

const TYPE_OPTIONS: { label: string; value: ResourceType | "all" }[] = [
  { label: "All types", value: "all" },
  { label: "Article", value: "article" },
  { label: "PDF", value: "pdf" },
  { label: "Video", value: "video" },
  { label: "External link", value: "external_link" },
  { label: "Infographic", value: "infographic" },
];

function formatCategoryLabel(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const CATEGORY_OPTIONS: { label: string; value: ResourceCategory | "all" }[] = [
  { label: "All categories", value: "all" },
  ...RESOURCE_CATEGORIES.map((cat) => ({
    label: formatCategoryLabel(cat),
    value: cat,
  })),
];

const SORT_OPTIONS: { label: string; value: NutriResourceSortBy }[] = [
  { label: "Latest", value: NutriResourceSortBy.LATEST },
  { label: "Oldest", value: NutriResourceSortBy.OLDEST },
  { label: "Title A-Z", value: NutriResourceSortBy.TITLE_ASC },
  { label: "Title Z-A", value: NutriResourceSortBy.TITLE_DESC },
  { label: "Most viewed", value: NutriResourceSortBy.MOST_VIEWED },
  { label: "Most downloaded", value: NutriResourceSortBy.MOST_DOWNLOADED },
];

function statusPillClasses(status: ResourceStatus): string {
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

function getResourceIcon(type: ResourceType) {
  switch (type) {
    case "article":
      return FileText;
    case "pdf":
      return File;
    case "video":
      return Video;
    case "external_link":
      return LinkIcon;
    case "infographic":
      return ImageIcon;
    default:
      return FileText;
  }
}

function getResourceIconClasses(type: ResourceType): string {
  switch (type) {
    case "video":
      return "bg-purple-100/80 text-purple-700";
    case "pdf":
      return "bg-rose-100/80 text-rose-700";
    case "external_link":
      return "bg-sky-100/80 text-sky-700";
    case "infographic":
      return "bg-orange-100/80 text-orange-700";
    case "article":
    default:
      return "bg-emerald-100/80 text-emerald-700";
  }
}

function formatResourceType(type: ResourceType): string {
  switch (type) {
    case "external_link":
      return "External link";
    case "pdf":
      return "PDF";
    case "video":
      return "Video";
    case "infographic":
      return "Infographic";
    case "article":
      return "Article";
    default:
      return type;
  }
}

export default function NutritionistResourcesPage() {
  const router = useRouter();

  const [resources, setResources] = useState<NutriResourceListItemDTO[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true); // state, not just ref — drives UI

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

  const [status, setStatus] = useState<ResourceStatus | "all">("all");
  const [type, setType] = useState<ResourceType | "all">("all");
  const [category, setCategory] = useState<ResourceCategory | "all">("all");
  const [sortBy, setSortBy] = useState<NutriResourceSortBy>(
    NutriResourceSortBy.LATEST,
  );

  const searchRef = useRef(debouncedSearch);
  const statusRef = useRef(status);
  const typeRef = useRef(type);
  const categoryRef = useRef(category);
  const sortByRef = useRef(sortBy);

  const cursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);

  const fetchingRef = useRef(false);
  const resettingRef = useRef(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    searchRef.current = debouncedSearch;
    statusRef.current = status;
    typeRef.current = type;
    categoryRef.current = category;
    sortByRef.current = sortBy;
  }, [debouncedSearch, status, type, category, sortBy]);

  const buildQuery = useCallback(
    (cursor: string | null): GetNutriResourcesQueryDTO => {
      const query: GetNutriResourcesQueryDTO = {
        limit: PAGE_LIMIT,
        sortBy: sortByRef.current,
      };

      if (cursor) query.cursor = cursor;
      if (searchRef.current.trim()) query.search = searchRef.current.trim();
      if (statusRef.current !== "all") query.status = statusRef.current;
      if (typeRef.current !== "all") query.type = typeRef.current;
      if (categoryRef.current !== "all") query.category = categoryRef.current;

      return query;
    },
    [],
  );

  const fetchResources = useCallback(
    async (reset: boolean) => {
      if (reset) {
        if (resettingRef.current) return;

        resettingRef.current = true;
        fetchingRef.current = true;

        cursorRef.current = null;
        hasMoreRef.current = true;
        setHasMore(true);

        setInitialLoading(true);
        setError(null);
      } else {
        if (fetchingRef.current || !hasMoreRef.current) return;

        fetchingRef.current = true;
        setLoadingMore(true);
      }

      try {
        const result = await nutriResourceService.getResources(
          buildQuery(cursorRef.current),
        );
        const { items, nextCursor, hasMore: more } = result;

        setResources((previous) => (reset ? items : [...previous, ...items]));

        cursorRef.current = nextCursor;
        hasMoreRef.current = more;
        setHasMore(more);
      } catch {
        setError("Couldn't load your resources. Please try again.");
        if (reset) setResources([]);
      } finally {
        fetchingRef.current = false;
        resettingRef.current = false;

        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    [buildQuery],
  );

  useEffect(() => {
    fetchResources(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, status, type, category, sortBy]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          hasMoreRef.current &&
          !fetchingRef.current
        ) {
          fetchResources(false);
        }
      },
      { rootMargin: "200px" },
    );

    observerRef.current.observe(node);

    return () => observerRef.current?.disconnect();
  }, [fetchResources, resources.length]);

  const isEmpty = !initialLoading && !error && resources.length === 0;

  const activeFilterCount =
    (status !== "all" ? 1 : 0) +
    (type !== "all" ? 1 : 0) +
    (category !== "all" ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Resources
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Manage your educational resources and content
            </p>
          </div>

          <button
            onClick={() => router.push("/nutritionist/resources/create")}
            className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 hover:-translate-y-0.5 text-white px-5 py-3 rounded-xl font-semibold shadow-xs transition-all"
          >
            <Plus size={18} />
            Create Resource
          </button>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 mb-8 shadow-xs">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search resources"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="hidden lg:block h-8 w-px bg-slate-200" />

            <div className="flex items-center gap-1.5">
              <SlidersHorizontal size={14} className="text-slate-400 mr-1" />
              {activeFilterCount > 0 && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                  {activeFilterCount} active
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as ResourceStatus | "all")
                }
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as ResourceType | "all")
                }
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as ResourceCategory | "all")
                }
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                {CATEGORY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as NutriResourceSortBy)
                }
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        {initialLoading ? (
          <LoadingGrid />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchResources(true)} />
        ) : isEmpty ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {resources.map((resource) => (
                <ResourceCard
                  key={resource.resourceId}
                  resource={resource}
                  router={router}
                />
              ))}
            </div>

            <div ref={sentinelRef} className="h-1" />

            {loadingMore && (
              <div className="flex justify-center py-8">
                <RefreshCw
                  className="animate-spin text-emerald-600"
                  size={22}
                />
              </div>
            )}

            {!hasMore && resources.length > 0 && (
              <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider py-8">
                {`You've reached the end`}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ResourceCard({
  resource,
  router,
}: {
  resource: NutriResourceListItemDTO;
  router: ReturnType<typeof useRouter>;
}) {
  const Icon = getResourceIcon(resource.type);

  return (
    <div className="group relative aspect-square bg-white rounded-[20px] border border-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_28px_-8px_rgba(15,23,42,0.16)] hover:-translate-y-0.5 hover:border-slate-300/80 transition-all duration-300 flex flex-col overflow-hidden">
      {/* COVER */}
      <div className="relative h-[38%] shrink-0 overflow-hidden">
        {resource.thumbnailUrl ? (
          <Image
            src={resource.thumbnailUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${getResourceIconClasses(resource.type)}`}
          >
            <Icon size={26} strokeWidth={1.75} />
          </div>
        )}

        <span
          className={`absolute top-2.5 right-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize backdrop-blur-sm ${statusPillClasses(resource.status)}`}
        >
          {resource.status}
        </span>
      </div>

      {/* BODY */}
      <div className="flex flex-col flex-1 p-3.5 pt-3">
        <h3 className="font-bold text-[13px] leading-snug text-slate-900 line-clamp-2 mb-1.5">
          {resource.title}
        </h3>

        <div className="flex items-center gap-1.5 flex-wrap mb-auto">
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5 truncate max-w-[100px]">
            {formatCategoryLabel(resource.category)}
          </span>
          <span className="text-[10px] font-medium text-slate-400">
            {formatResourceType(resource.type)}
          </span>
        </div>

        {/* STATS */}
        <div className="flex items-center gap-3 mt-3 mb-2.5 px-0.5">
          <Stat value={resource.viewCount} label="views" />
          <Stat value={resource.downloadCount} label="dl" />
          <Stat value={resource.likeCount} label="likes" accent />
        </div>

        <button
          onClick={() =>
            router.push(`/nutritionist/resources/${resource.resourceId}`)
          }
          className="w-full bg-slate-900 group-hover:bg-emerald-700 text-white py-2 rounded-xl flex items-center justify-center gap-1 font-semibold text-xs transition-colors duration-300"
        >
          Details
          <ChevronRight
            size={13}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
  accent = false,
}: {
  value: number;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-1">
      <span
        className={`text-[12px] font-bold ${accent ? "text-emerald-700" : "text-slate-700"}`}
      >
        {value}
      </span>
      <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="aspect-square bg-white rounded-2xl border border-slate-200/80 p-4 animate-pulse"
        >
          <div className="flex justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-slate-200" />
            <div className="w-16 h-4 rounded-full bg-slate-200" />
          </div>
          <div className="h-3.5 bg-slate-200 rounded w-3/4 mb-2" />
          <div className="h-3.5 bg-slate-200 rounded w-1/2 mb-4" />
          <div className="h-10 bg-slate-100 rounded-lg mb-2" />
          <div className="h-8 bg-slate-100 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl py-20 text-center border border-dashed border-slate-300">
      <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
        <Inbox className="text-emerald-600" size={24} />
      </div>
      <h3 className="text-base font-bold text-slate-600">No resources found</h3>
      <p className="text-sm text-slate-400 mt-1">
        Try adjusting your filters or search
      </p>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl py-20 text-center border border-slate-200/80">
      <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="text-rose-600" size={24} />
      </div>
      <h3 className="text-base font-bold text-slate-600">{message}</h3>
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 hover:-translate-y-0.5 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
      >
        <RefreshCw size={14} />
        Retry
      </button>
    </div>
  );
}
