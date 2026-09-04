"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  FileText,
  File,
  Video,
  Image as ImageIcon,
  Eye,
  Heart,
  Bookmark,
  RefreshCw,
  Inbox,
  AlertCircle,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Loader2,
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
  { label: "Infographic", value: "infographic" },
];

function formatCategoryLabel(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
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
];

function statusBadgeClasses(status: ResourceStatus): string {
  switch (status) {
    case "published":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "draft":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "archived":
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
    case "infographic":
      return ImageIcon;
  }
}

function getResourceIconClasses(type: ResourceType): string {
  switch (type) {
    case "video":
      return "bg-purple-100/80 text-purple-700";
    case "pdf":
      return "bg-rose-100/80 text-rose-700";
    case "infographic":
      return "bg-orange-100/80 text-orange-700";
    case "article":
      return "bg-emerald-100/80 text-emerald-700";
  }
}

function formatResourceType(type: ResourceType): string {
  switch (type) {
    case "pdf":
      return "PDF";
    case "video":
      return "Video";
    case "infographic":
      return "Infographic";
    case "article":
      return "Article";
  }
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NutritionistResourcesPage() {
  const router = useRouter();

  const [resources, setResources] = useState<NutriResourceListItemDTO[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

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

  const [navigatingId, setNavigatingId] = useState<string | null>(null);

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

  const handleOpenResource = useCallback(
    (resourceId: string) => {
      if (navigatingId) return;
      setNavigatingId(resourceId);
      router.push(`/nutritionist/resources/${resourceId}`);
    },
    [router, navigatingId],
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
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
            className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-lg font-semibold text-sm shadow-xs transition-colors"
          >
            <Plus size={17} />
            Create Resource
          </button>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white border border-slate-200/80 rounded-lg p-3.5 mb-6 shadow-xs">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search resources"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="hidden lg:block h-8 w-px bg-slate-200" />

            <div className="flex items-center gap-1.5">
              <SlidersHorizontal size={14} className="text-slate-400" />
              {activeFilterCount > 0 && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-1.5 py-0.5">
                  {activeFilterCount} active
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5">
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as ResourceStatus | "all")
                }
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
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
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
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
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
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
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {resources.map((resource) => (
                <ResourceCard
                  key={resource.resourceId}
                  resource={resource}
                  isNavigating={navigatingId === resource.resourceId}
                  disabled={navigatingId !== null}
                  onOpen={handleOpenResource}
                />
              ))}
            </div>

            <div ref={sentinelRef} className="h-1" />

            {loadingMore && (
              <div className="flex justify-center py-8">
                <RefreshCw
                  className="animate-spin text-emerald-600"
                  size={20}
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
  isNavigating,
  disabled,
  onOpen,
}: {
  resource: NutriResourceListItemDTO;
  isNavigating: boolean;
  disabled: boolean;
  onOpen: (resourceId: string) => void;
}) {
  const Icon = getResourceIcon(resource.type);

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={() => !disabled && onOpen(resource.resourceId)}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onOpen(resource.resourceId);
        }
      }}
      className={`group relative bg-white rounded-lg border border-slate-200/80 shadow-xs flex flex-col overflow-hidden text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 ${
        disabled
          ? isNavigating
            ? "opacity-100 cursor-wait"
            : "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:shadow-sm hover:border-slate-300"
      }`}
    >
      {/* THUMBNAIL */}
      <div className="relative h-36 shrink-0 overflow-hidden bg-slate-100">
        {resource.thumbnailUrl ? (
          <Image
            src={resource.thumbnailUrl}
            alt=""
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${getResourceIconClasses(resource.type)}`}
          >
            <Icon size={28} strokeWidth={1.75} />
          </div>
        )}

        <span className="absolute top-2 left-2 inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-white/90 text-slate-700 border border-slate-200">
          <Icon size={11} />
          {formatResourceType(resource.type)}
        </span>

        <span
          className={`absolute top-2 right-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-md border capitalize bg-white/90 ${statusBadgeClasses(resource.status)}`}
        >
          {resource.status}
        </span>

        {isNavigating && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <Loader2 size={20} className="animate-spin text-emerald-700" />
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="flex flex-col flex-1 p-3.5">
        <h3 className="font-bold text-sm leading-snug text-slate-900 line-clamp-2 mb-1">
          {resource.title}
        </h3>

        <p className="text-xs text-slate-500 leading-snug line-clamp-2 mb-2.5">
          {resource.description}
        </p>

        <span className="self-start text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded-md px-1.5 py-0.5 mb-3">
          {formatCategoryLabel(resource.category)}
        </span>

        <div className="mt-auto pt-2.5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2.5">
              <Stat icon={Eye} value={resource.viewCount} />
              <Stat icon={Heart} value={resource.likeCount} />
              <Stat icon={Bookmark} value={resource.bookmarkCount} />
            </div>
            <span className="text-[10px] font-medium text-slate-400">
              {formatDate(resource.createdAt)}
            </span>
          </div>

          <div className="flex items-center justify-center gap-1 text-xs font-semibold text-emerald-700 group-hover:text-emerald-800 py-1.5 rounded-md bg-emerald-50/80">
            {isNavigating ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Opening
              </>
            ) : (
              <>
                View details
                <ChevronRight
                  size={13}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, value }: { icon: typeof Eye; value: number }) {
  return (
    <div className="flex items-center gap-1 text-slate-400">
      <Icon size={12} />
      <span className="text-[11px] font-semibold text-slate-600">{value}</span>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-slate-200/80 overflow-hidden animate-pulse"
        >
          <div className="h-36 bg-slate-200" />
          <div className="p-3.5">
            <div className="h-3.5 bg-slate-200 rounded w-4/5 mb-2" />
            <div className="h-3 bg-slate-200 rounded w-full mb-1.5" />
            <div className="h-3 bg-slate-200 rounded w-2/3 mb-3" />
            <div className="h-4 bg-slate-100 rounded w-16 mb-3" />
            <div className="h-4 bg-slate-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-lg py-20 text-center border border-dashed border-slate-300">
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
    <div className="bg-white rounded-lg py-20 text-center border border-slate-200/80">
      <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="text-rose-600" size={24} />
      </div>
      <h3 className="text-base font-bold text-slate-600">{message}</h3>
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors"
      >
        <RefreshCw size={14} />
        Retry
      </button>
    </div>
  );
}
