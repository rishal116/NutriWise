"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronRight, Home, Users, Menu, X } from "lucide-react";
import Sidebar from "@/components/ui/nutritionists/SideBar";
import NutritionistCard from "@/components/ui/nutritionists/NutritionistCard";
import { nutritionistBrowsingService } from "@/services/user/nutriBrowsing.service";
import { useDebounce } from "@/hooks/common/debounce.hooks";
import { NutritionistListQueryDTO } from "@/dtos/user/nutri-browsing/nutri-list-query.dto";
import { NutritionistCardDTO } from "@/dtos/user/nutri-browsing/nutri-card.dto";
import { NutritionistStatsDTO } from "@/dtos/user/nutri-browsing/nutri-stats.dto";
import { NutritionistSortBy, Specialization } from "@/types/nutritionist.types";

type FilterState = Pick<
  NutritionistListQueryDTO,
  "specializations" | "sortBy" | "minRating"
>;

const SORT_OPTIONS: { value: NutritionistSortBy; label: string }[] = [
  { value: "rating", label: "Top Rated" },
  { value: "experience", label: "Most Experienced" },
  { value: "reviews", label: "Most Reviewed" },
  { value: "newest", label: "Newest" },
];

const MIN_RATING_OPTIONS = [
  { value: undefined, label: "Any Rating" },
  { value: 3, label: "3.0+" },
  { value: 4, label: "4.0+" },
  { value: 4.5, label: "4.5+" },
];

export default function NutritionistsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({});
  const [nutritionists, setNutritionists] = useState<NutritionistCardDTO[]>([]);
  const [stats, setStats] = useState<NutritionistStatsDTO | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(["Homepage"]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const filtersRef = useRef(filters);
  const searchRef = useRef(debouncedSearch);
  const cursorRef = useRef<string | undefined>(undefined);
  const hasMoreRef = useRef(true);
  const fetchingMoreRef = useRef(false);
  const resettingRef = useRef(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    searchRef.current = debouncedSearch;
  }, [debouncedSearch]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    const specializationFromUrl = searchParams.get("specialization");
    if (specializationFromUrl) {
      setFilters((f) => ({
        ...f,
        specializations: [specializationFromUrl as Specialization],
      }));
      setBreadcrumbs(["Homepage", specializationFromUrl]);
    } else {
      setFilters((f) => ({ ...f, specializations: undefined }));
      setBreadcrumbs(["Homepage"]);
    }
  }, [searchParams]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await nutritionistBrowsingService.getNutritionistStats();
      setStats(data);
    } catch {
      setStats(null);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const resetAndFetch = useCallback(async () => {
    resettingRef.current = true;
    cursorRef.current = undefined;
    setHasMore(true);
    hasMoreRef.current = true;
    setLoading(true);

    try {
      const res = await nutritionistBrowsingService.browseNutritionists({
        ...filtersRef.current,
        search: searchRef.current || undefined,
        limit: 8,
      });
      console.log(res);
      
      setNutritionists(res.items);
      cursorRef.current = res.nextCursor ?? undefined;
      setHasMore(res.hasMore);
      hasMoreRef.current = res.hasMore;
    } finally {
      setLoading(false);
      resettingRef.current = false;
    }
  }, []);

  useEffect(() => {
    resetAndFetch();
  }, [filters, debouncedSearch, resetAndFetch]);

  const fetchMore = useCallback(async () => {
    if (fetchingMoreRef.current || resettingRef.current || !hasMoreRef.current) {
      return;
    }

    fetchingMoreRef.current = true;
    setLoadingMore(true);

    try {
      const res = await nutritionistBrowsingService.browseNutritionists({
        ...filtersRef.current,
        search: searchRef.current || undefined,
        cursor: cursorRef.current,
        limit: 8,
      });
      setNutritionists((prev) => [...prev, ...res.items]);
      cursorRef.current = res.nextCursor ?? undefined;
      setHasMore(res.hasMore);
      hasMoreRef.current = res.hasMore;
    } finally {
      setLoadingMore(false);
      fetchingMoreRef.current = false;
    }
  }, []);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) fetchMore();
      },
      { rootMargin: "200px" },
    );
    observerRef.current.observe(node);

    return () => observerRef.current?.disconnect();
  }, [fetchMore, nutritionists.length]);

  const handleSelectSpecialization = (val: string) => {
    if (!val) {
      setBreadcrumbs(["Homepage"]);
      router.push("/coaching");
      setSidebarOpen(false);
      return;
    }
    setBreadcrumbs(["Homepage", val]);
    router.push(`/coaching?specialization=${encodeURIComponent(val)}`);
    setSidebarOpen(false);
  };

  const activeSpecialization = filters.specializations?.[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-emerald-50 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Find Your Perfect Nutrition Coach
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-6">
            Connect with certified nutritionists who specialize in your health goals.
          </p>
          {stats && (
            <span className="inline-block bg-white rounded-full px-5 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              {stats.totalNutritionists.toLocaleString()} Expert Nutritionists
            </span>
          )}
        </div>
      </section>

      <div className="flex">
        <div className="hidden lg:block border-r border-slate-200 bg-white shadow-sm">
          <Sidebar
            selected={activeSpecialization ? [activeSpecialization] : []}
            onSelect={handleSelectSpecialization}
          />
        </div>

        {sidebarOpen && (
          <>
            <button
              type="button"
              aria-label="Close filters"
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-80 z-50 lg:hidden">
              <Sidebar
                selected={activeSpecialization ? [activeSpecialization] : []}
                onSelect={handleSelectSpecialization}
              />
            </div>
          </>
        )}

        <main className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-14 py-6 sm:py-8 lg:py-10">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mb-6 flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
          >
            <Menu size={20} />
            <span>Filters</span>
            {activeSpecialization && (
              <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">1</span>
            )}
          </button>

          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-3">
            {breadcrumbs.map((label, idx) => (
              <div key={label} className="flex items-center gap-2">
                {label === "Homepage" ? (
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="hover:text-emerald-600 flex items-center gap-1"
                  >
                    <Home size={14} />
                    {label}
                  </button>
                ) : (
                  <span className="font-medium text-slate-900">{label}</span>
                )}
                {idx < breadcrumbs.length - 1 && (
                  <ChevronRight size={14} className="text-slate-300" />
                )}
              </div>
            ))}
          </nav>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-6">
            {activeSpecialization ? `Coaches for ${activeSpecialization}` : "All Nutrition Coaches"}
          </h2>

          {/* Toolbar: search + sort + min rating */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8 border-b border-slate-200 pb-6">
            <div className="relative flex-1 sm:max-w-xs">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
                >
                  <X size={16} />
                </button>
              )}
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-9 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>

            <select
              value={filters.sortBy ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  sortBy: (e.target.value || undefined) as NutritionistSortBy | undefined,
                }))
              }
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="">Sort By</option>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <select
              value={filters.minRating ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  minRating: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {MIN_RATING_OPTIONS.map((o) => (
                <option key={o.label} value={o.value ?? ""}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="h-80 rounded-2xl border border-slate-200 bg-slate-100 animate-pulse"
                />
              ))
            ) : nutritionists.length ? (
              nutritionists.map((n) => <NutritionistCard key={n.username} item={n} />)
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 px-4">
                <Users size={48} className="text-slate-300 mb-4" />
                <p className="text-slate-600 font-semibold text-center">
                  No coaches match your current filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilters({});
                    handleSelectSpecialization("");
                  }}
                  className="mt-6 px-6 py-2.5 rounded-xl border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {!loading && hasMore && (
            <div ref={sentinelRef} className="h-10 flex items-center justify-center mt-8">
              {loadingMore && <span className="text-sm text-slate-400">Loading more…</span>}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}