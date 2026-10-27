"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  FileText,
  File,
  Video,
  Image as ImageIcon,
  Eye,
  Heart,
  RefreshCw,
  Inbox,
  AlertCircle,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { nutriResourceService } from "@/services/nutritionist/nutri-resource.service";

import type { NutriResourceDTO } from "@/dtos/nutritionist/resource/nutri-resource.dto"; 
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

const STATUS_OPTIONS: {
  label: string;
  value: ResourceStatus | "all";
}[] = [
  { label: "All statuses", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

const TYPE_OPTIONS: {
  label: string;
  value: ResourceType | "all";
}[] = [
  { label: "All types", value: "all" },
  { label: "Article", value: "article" },
  { label: "PDF", value: "pdf" },
  { label: "Video", value: "video" },
  { label: "Infographic", value: "infographic" },
];

function formatCategoryLabel(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const CATEGORY_OPTIONS: {
  label: string;
  value: ResourceCategory | "all";
}[] = [
  { label: "All categories", value: "all" },
  ...RESOURCE_CATEGORIES.map((category) => ({
    label: formatCategoryLabel(category),
    value: category,
  })),
];

const SORT_OPTIONS: {
  label: string;
  value: NutriResourceSortBy;
}[] = [
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
    case "article":
      return "bg-emerald-100/80 text-emerald-700";
    case "pdf":
      return "bg-rose-100/80 text-rose-700";
    case "video":
      return "bg-purple-100/80 text-purple-700";
    case "infographic":
      return "bg-orange-100/80 text-orange-700";
  }
}

function formatResourceType(type: ResourceType): string {
  switch (type) {
    case "article":
      return "Article";
    case "pdf":
      return "PDF";
    case "video":
      return "Video";
    case "infographic":
      return "Infographic";
  }
}

function formatDate(date: Date | string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export default function NutritionistResourcesPage() {
  const router = useRouter();

  const [resources, setResources] = useState<NutriResourceDTO[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

  const [status, setStatus] = useState<ResourceStatus | "all">("all");
  const [type, setType] = useState<ResourceType | "all">("all");
  const [category, setCategory] = useState<ResourceCategory | "all">("all");
  const [sortBy, setSortBy] = useState<NutriResourceSortBy>(
    NutriResourceSortBy.LATEST,
  );

  const [navigatingId, setNavigatingId] = useState<string | null>(null);

  const requestIdRef = useRef(0);
  const cursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(false);
  const fetchingRef = useRef(false);
  const loadingMoreRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const buildQuery = useCallback(
    (cursor: string | null): GetNutriResourcesQueryDTO => {
      const query: GetNutriResourcesQueryDTO = {
        limit: PAGE_LIMIT,
        sortBy,
      };

      if (cursor) {
        query.cursor = cursor;
      }

      const search = debouncedSearch.trim();

      if (search) {
        query.search = search;
      }

      if (status !== "all") {
        query.status = status;
      }

      if (type !== "all") {
        query.type = type;
      }

      if (category !== "all") {
        query.category = category;
      }

      return query;
    },
    [debouncedSearch, status, type, category, sortBy],
  );

  const fetchResources = useCallback(
    async (reset: boolean) => {
      if (fetchingRef.current) {
        return;
      }

      if (!reset && !hasMoreRef.current) {
        return;
      }

      fetchingRef.current = true;
      loadingMoreRef.current = !reset;

      if (reset) {
        const requestId = ++requestIdRef.current;

        cursorRef.current = null;
        hasMoreRef.current = false;

        setResources([]);
        setHasMore(false);
        setInitialLoading(true);
        setError(null);
        setLoadingMore(false);

        try {
          const result = await nutriResourceService.getResources(
            buildQuery(null),
          );

          if (requestId !== requestIdRef.current) {
            return;
          }

          setResources(result.items);
          cursorRef.current = result.nextCursor;
          hasMoreRef.current = result.hasMore;
          setHasMore(result.hasMore);
        } catch {
          if (requestId === requestIdRef.current) {
            setResources([]);
            setError("Couldn't load your resources. Please try again.");
          }
        } finally {
          if (requestId === requestIdRef.current) {
            fetchingRef.current = false;
            loadingMoreRef.current = false;
            setInitialLoading(false);
            setLoadingMore(false);
          }
        }

        return;
      }

      const requestId = requestIdRef.current;
      const cursor = cursorRef.current;

      setLoadingMore(true);

      try {
        const result = await nutriResourceService.getResources(
          buildQuery(cursor),
        );

        if (requestId !== requestIdRef.current) {
          return;
        }

        setResources((previous) => {
          const existingIds = new Set(
            previous.map((resource) => resource.resourceId),
          );

          const newItems = result.items.filter(
            (resource) => !existingIds.has(resource.resourceId),
          );

          return [...previous, ...newItems];
        });

        cursorRef.current = result.nextCursor;
        hasMoreRef.current = result.hasMore;
        setHasMore(result.hasMore);
      } catch {
        if (requestId === requestIdRef.current) {
          setError("Couldn't load more resources. Please try again.");
        }
      } finally {
        if (requestId === requestIdRef.current) {
          fetchingRef.current = false;
          loadingMoreRef.current = false;
          setLoadingMore(false);
        }
      }
    },
    [buildQuery],
  );

  useEffect(() => {
    void fetchResources(true);
  }, [fetchResources]);

  useEffect(() => {
    const node = sentinelRef.current;

    if (!node || initialLoading || error || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (
          entry?.isIntersecting &&
          hasMoreRef.current &&
          !fetchingRef.current &&
          !loadingMoreRef.current
        ) {
          void fetchResources(false);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [fetchResources, resources.length, initialLoading, error, hasMore]);

  const activeFilterCount =
    Number(status !== "all") +
    Number(type !== "all") +
    Number(category !== "all");

  const handleOpenResource = useCallback(
    (resourceId: string) => {
      if (navigatingId !== null) {
        return;
      }

      setNavigatingId(resourceId);
      router.push(`/nutritionist/resources/${resourceId}`);
    },
    [navigatingId, router],
  );

  const handleCardKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>, resourceId: string) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      handleOpenResource(resourceId);
    },
    [handleOpenResource],
  );

  const isEmpty = !initialLoading && !error && resources.length === 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10">
        <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Resources
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Manage your educational resources and content
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/nutritionist/resources/create")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-emerald-800"
          >
            <Plus size={17} />
            Create Resource
          </button>
        </header>

        <section
          aria-label="Resource filters"
          className="mb-6 rounded-lg border border-slate-200/80 bg-white p-3.5 shadow-xs"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-[200px] flex-1">
              <Search
                size={16}
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search resources"
                aria-label="Search resources"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="hidden h-8 w-px bg-slate-200 lg:block" />

            <div className="flex items-center gap-1.5">
              <SlidersHorizontal
                size={14}
                aria-hidden="true"
                className="text-slate-400"
              />
              {activeFilterCount > 0 && (
                <span className="rounded-md border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                  {activeFilterCount} active
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5">
              <FilterSelect
                label="Status"
                value={status}
                options={STATUS_OPTIONS}
                onChange={(value) => setStatus(value as ResourceStatus | "all")}
              />

              <FilterSelect
                label="Type"
                value={type}
                options={TYPE_OPTIONS}
                onChange={(value) => setType(value as ResourceType | "all")}
              />

              <FilterSelect
                label="Category"
                value={category}
                options={CATEGORY_OPTIONS}
                onChange={(value) =>
                  setCategory(value as ResourceCategory | "all")
                }
              />

              <FilterSelect
                label="Sort by"
                value={sortBy}
                options={SORT_OPTIONS}
                onChange={(value) => setSortBy(value as NutriResourceSortBy)}
              />
            </div>
          </div>
        </section>

        {initialLoading ? (
          <LoadingGrid />
        ) : error && resources.length === 0 ? (
          <ErrorState
            message={error}
            onRetry={() => void fetchResources(true)}
          />
        ) : isEmpty ? (
          <EmptyState
            hasFilters={Boolean(searchInput.trim() || activeFilterCount)}
          />
        ) : (
          <>
            {error && (
              <div
                role="alert"
                className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3"
              >
                <p className="text-sm text-rose-700">{error}</p>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    void fetchResources(false);
                  }}
                  className="text-sm font-semibold text-rose-700 underline underline-offset-2"
                >
                  Retry
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {resources.map((resource) => (
                <ResourceCard
                  key={resource.resourceId}
                  resource={resource}
                  isNavigating={navigatingId === resource.resourceId}
                  disabled={navigatingId !== null}
                  onOpen={handleOpenResource}
                  onKeyDown={handleCardKeyDown}
                />
              ))}
            </div>

            <div ref={sentinelRef} className="h-1" aria-hidden="true" />

            {loadingMore && (
              <div
                className="flex justify-center py-8"
                role="status"
                aria-label="Loading more resources"
              >
                <Loader2 className="animate-spin text-emerald-600" size={22} />
              </div>
            )}

            {!hasMore && resources.length > 0 && (
              <p className="py-8 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                You&apos;ve reached the end
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value as T)}
      className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function ResourceCard({
  resource,
  isNavigating,
  disabled,
  onOpen,
  onKeyDown,
}: {
  resource: NutriResourceDTO;
  isNavigating: boolean;
  disabled: boolean;
  onOpen: (resourceId: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>, resourceId: string) => void;
}) {
  const Icon = getResourceIcon(resource.type);

  return (
    <div
      role="link"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label={`View resource: ${resource.title}`}
      onClick={() => {
        if (!disabled) {
          onOpen(resource.resourceId);
        }
      }}
      onKeyDown={(event) => onKeyDown(event, resource.resourceId)}
      className={`group relative flex flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-white text-left shadow-xs transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 ${
        disabled
          ? isNavigating
            ? "cursor-wait"
            : "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <div
        className={`relative flex h-36 shrink-0 items-center justify-center overflow-hidden ${getResourceIconClasses(resource.type)}`}
      >
        <Icon size={36} strokeWidth={1.5} aria-hidden="true" />

        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
          <Icon size={11} aria-hidden="true" />
          {formatResourceType(resource.type)}
        </span>

        <span
          className={`absolute right-2 top-2 rounded-md border bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold capitalize ${statusBadgeClasses(resource.status)}`}
        >
          {resource.status}
        </span>

        {isNavigating && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Loader2
              size={22}
              className="animate-spin text-emerald-700"
              aria-label="Opening resource"
            />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <h2 className="mb-1 line-clamp-2 text-sm font-bold leading-snug text-slate-900">
          {resource.title}
        </h2>

        <p className="mb-2.5 line-clamp-2 text-xs leading-snug text-slate-500">
          {resource.description}
        </p>

        <span className="mb-3 self-start rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
          {formatCategoryLabel(resource.category)}
        </span>

        <div className="mt-auto border-t border-slate-100 pt-2.5">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <Stat icon={Eye} value={resource.viewCount} />
              <Stat icon={Heart} value={resource.likeCount} />
            </div>

            <time
              dateTime={
                Number.isNaN(new Date(resource.createdAt).getTime())
                  ? undefined
                  : new Date(resource.createdAt).toISOString()
              }
              className="text-[10px] font-medium text-slate-400"
            >
              {formatDate(resource.createdAt)}
            </time>
          </div>

          <div className="flex items-center justify-center gap-1 rounded-md bg-emerald-50/80 py-1.5 text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
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
      <Icon size={12} aria-hidden="true" />
      <span className="text-[11px] font-semibold text-slate-600">
        {formatCount(value)}
      </span>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label="Loading resources"
      role="status"
    >
      {Array.from({ length: 8 }, (_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-lg border border-slate-200/80 bg-white"
        >
          <div className="h-36 bg-slate-200" />
          <div className="p-3.5">
            <div className="mb-2 h-3.5 w-4/5 rounded bg-slate-200" />
            <div className="mb-1.5 h-3 w-full rounded bg-slate-200" />
            <div className="mb-3 h-3 w-2/3 rounded bg-slate-200" />
            <div className="mb-3 h-4 w-16 rounded bg-slate-100" />
            <div className="h-8 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white py-20 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
        <Inbox className="text-emerald-600" size={24} />
      </div>

      <h2 className="text-base font-bold text-slate-700">
        {hasFilters ? "No matching resources" : "No resources yet"}
      </h2>

      <p className="mt-1 text-sm text-slate-400">
        {hasFilters
          ? "Try changing your search or filters."
          : "Create your first educational resource to get started."}
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
    <div
      role="alert"
      className="rounded-lg border border-slate-200/80 bg-white py-20 text-center"
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
        <AlertCircle className="text-rose-600" size={24} />
      </div>

      <h2 className="text-base font-bold text-slate-600">{message}</h2>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
      >
        <RefreshCw size={14} />
        Retry
      </button>
    </div>
  );
}
