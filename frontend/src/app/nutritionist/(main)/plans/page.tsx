"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Clock,
  FileText,
  Plus,
  IndianRupee,
  AlertCircle,
  Search,
  ChevronRight,
  MoreHorizontal,
  LayoutGrid,
  Layers,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { nutritionistPlanService } from "@/services/nutritionist/nutriPlan.service";
import { PlanDto } from "@/dtos/nutritionist/plan/plan.dto";
import type { Specialization } from "@/types/nutritionist.types";
import { PLAN_SORT, PlanSort } from "@/types/plan.types";

type Tab = "all" | "published" | "draft" | "archived";

const SPECIALIZATIONS: Specialization[] = [
  "weight_loss",
  "weight_gain",
  "sports_nutrition",
  "clinical_nutrition",
  "diabetes_management",
  "pcos_nutrition",
  "renal_nutrition",
  "cardiac_nutrition",
  "gut_health",
  "child_nutrition",
  "pregnancy_nutrition",
  "elderly_nutrition",
  "vegan_nutrition",
  "ketogenic_diet",
  "general_wellness",
];

const SORT_LABELS: Record<PlanSort, string> = {
  newest: "Newest",
  price_low_to_high: "Price: Low to High",
  price_high_to_low: "Price: High to Low",
  duration_shortest: "Duration: Shortest",
  duration_longest: "Duration: Longest",
};

export default function MyPlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<PlanDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState<Specialization | "">("");
  const [sort, setSort] = useState<PlanSort>("newest");

  // Refs mirror current filter state to avoid stale closures in the observer callback
  const cursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);
  const fetchingMoreRef = useRef(false);
  const resettingRef = useRef(false);
  const searchRef = useRef(search);
  const specializationRef = useRef(specialization);
  const sortRef = useRef(sort);
  const tabRef = useRef(activeTab);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);
  useEffect(() => {
    specializationRef.current = specialization;
  }, [specialization]);
  useEffect(() => {
    sortRef.current = sort;
  }, [sort]);
  useEffect(() => {
    tabRef.current = activeTab;
  }, [activeTab]);

  const buildParams = useCallback(
    (cursor?: string) => ({
      cursor,
      limit: 12,
      search: searchRef.current || undefined,
      specialization: specializationRef.current || undefined,
      sort: sortRef.current,
      status: tabRef.current === "all" ? undefined : tabRef.current,
    }),
    [],
  );

  // Reset + refetch whenever tab, search, specialization, or sort changes
  useEffect(() => {
    const load = async () => {
      resettingRef.current = true;
      setLoading(true);
      try {
        const res = await nutritionistPlanService.getPlans(buildParams());
        setPlans(res.items);
        cursorRef.current = res.nextCursor;
        hasMoreRef.current = res.hasMore;
        setHasMore(res.hasMore);
      } catch (error) {
        console.error("Failed to fetch plans", error);
      } finally {
        setLoading(false);
        resettingRef.current = false;
      }
    };
    load();
  }, [activeTab, search, specialization, sort, buildParams]);

  const loadMore = useCallback(async () => {
    if (fetchingMoreRef.current || resettingRef.current || !hasMoreRef.current)
      return;
    fetchingMoreRef.current = true;
    setLoadingMore(true);
    try {
      const res = await nutritionistPlanService.getPlans(
        buildParams(cursorRef.current ?? undefined),
      );
      setPlans((prev) => [...prev, ...res.items]);
      cursorRef.current = res.nextCursor;
      hasMoreRef.current = res.hasMore;
      setHasMore(res.hasMore);
    } catch (error) {
      console.error("Failed to load more plans", error);
    } finally {
      fetchingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [buildParams]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-emerald-900 rounded-2xl p-6 md:p-10 text-white">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
            Nutrition Dashboard
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Manage Your Plans
          </h1>
          <p className="text-emerald-100/70 text-sm max-w-md">
            Create, edit, and track your nutrition plans from one place.
          </p>
        </div>
        <button
          onClick={() => router.push("/nutritionist/plans/create")}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-emerald-900 font-bold rounded-xl hover:bg-emerald-50 transition-colors shrink-0"
        >
          <Plus size={18} strokeWidth={3} />
          New Plan
        </button>
      </div>

      {/* Tabs */}
      <div className="inline-flex flex-wrap p-1 bg-slate-100 rounded-xl border border-slate-200 w-fit">
        {(["all", "published", "draft", "archived"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-lg transition-colors ${
              activeTab === tab
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search plans..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
        </div>

        <select
          value={specialization}
          onChange={(e) =>
            setSpecialization(e.target.value as Specialization | "")
          }
          className="px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
        >
          <option value="">All Specializations</option>
          {SPECIALIZATIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as PlanSort)}
          className="px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
        >
          {PLAN_SORT.map((s) => (
            <option key={s} value={s}>
              {SORT_LABELS[s]}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl w-fit shrink-0">
          <Layers size={14} className="text-emerald-600" />
          <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
            {plans.length} {plans.length === 1 ? "Plan" : "Plans"}
          </span>
        </div>
      </div>

      {/* Grid */}
      {plans.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>

          {/* Infinite scroll sentinel */}
          <div
            ref={sentinelRef}
            className="h-10 flex items-center justify-center"
          >
            {loadingMore && (
              <Loader2 size={20} className="text-emerald-600 animate-spin" />
            )}
            {!hasMore && plans.length > 0 && (
              <span className="text-xs text-slate-400 font-medium">
                No more plans
              </span>
            )}
          </div>
        </>
      ) : (
        <EmptyState hasPlans={plans.length > 0} activeTab={activeTab} />
      )}
    </div>
  );
}

function PlanCard({ plan }: { plan: PlanDto }) {
  const isPublished = plan.status === "published";
  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
              isPublished
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-slate-50 text-slate-500 border-slate-200"
            }`}
          >
            {plan.status}
          </span>
          <button
            aria-label="More options"
            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>

        <div className="space-y-1 mb-4">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
            {plan.specialization.replace(/_/g, " ")}
          </span>
          <h3 className="text-xl font-bold text-slate-900 leading-tight line-clamp-2">
            {plan.title}
          </h3>
        </div>

        <div className="flex items-center gap-4 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-emerald-600" />
            <span className="text-xs font-semibold text-slate-600">
              {plan.durationDays} Days
            </span>
          </div>
          <div className="w-px h-3 bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <LayoutGrid size={14} className="text-emerald-600" />
            <span className="text-xs font-semibold text-slate-600">
              {plan.features.length} Features
            </span>
          </div>
        </div>

        <div className="space-y-2 flex-1">
          {plan.features.slice(0, 2).map((feature, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="mt-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
              <span className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-900 flex items-center justify-between">
        <div>
          <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wide block">
            Price
          </span>
          <div className="flex items-center font-bold text-white">
            {plan.currency === "INR" ? (
              <IndianRupee
                size={16}
                strokeWidth={3}
                className="text-emerald-400"
              />
            ) : (
              <span className="text-emerald-400 mr-0.5">$</span>
            )}
            <span className="text-xl tracking-tight">
              {plan.price.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/nutritionist/plans/edit/${plan.id}`)}
            aria-label="Edit plan"
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <FileText size={16} />
          </button>
          <button
            onClick={() => router.push(`/nutritionist/plans/${plan.id}`)}
            className="flex items-center gap-1.5 pl-3 pr-2.5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-lg transition-colors"
          >
            <span className="text-[10px] uppercase">Review</span>
            <ChevronRight size={14} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-pulse pb-20">
      <div className="h-40 bg-slate-100 rounded-2xl" />
      <div className="h-10 w-64 bg-slate-100 rounded-xl" />
      <div className="flex gap-3">
        <div className="h-11 flex-1 bg-slate-100 rounded-xl" />
        <div className="h-11 w-40 bg-slate-100 rounded-xl" />
        <div className="h-11 w-40 bg-slate-100 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-80 bg-slate-50 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

function EmptyState({
  hasPlans,
  activeTab,
}: {
  hasPlans: boolean;
  activeTab: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-emerald-50/40 rounded-2xl border-2 border-dashed border-emerald-100">
      <div className="p-5 bg-white rounded-2xl shadow-sm mb-5">
        <AlertCircle size={32} className="text-emerald-600" />
      </div>
      <h3 className="text-lg font-bold text-slate-800">
        {!hasPlans ? "Ready to launch?" : `No ${activeTab} plans`}
      </h3>
      <p className="text-slate-500 text-sm mt-2 max-w-xs text-center">
        {!hasPlans
          ? "Create your first nutrition plan and start helping clients today."
          : "Try adjusting your search or filters."}
      </p>
    </div>
  );
}
