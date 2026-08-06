"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronRight,
  Home,
  Users,
  X,
  Filter,
  SlidersHorizontal,
  Menu,
  Star,
  Award,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Sidebar from "@/components/ui/nutritionists/SideBar";
import NutritionistCard from "@/components/ui/nutritionists/NutritionistCard";
import FilterDrawer from "@/components/ui/nutritionists/FilterDrawer";
import { useNutritionistBrowsing } from "@/hooks/user/useNutritionistBrowsing";
import { NutritionistSortBy } from "@/types/nutritionist.types";

const SORT_OPTIONS: { value: NutritionistSortBy; label: string }[] = [
  { value: "highest_rating", label: "Top Rated" },
  { value: "most_experienced", label: "Most Experienced" },
  { value: "most_reviewed", label: "Most Reviewed" },
  { value: "newest", label: "Newest" },
];

export default function NutritionistsPage() {
  const router = useRouter();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const {
    filters,
    setFilters,
    search,
    setSearch,
    nutritionists,
    stats,
    loading,
    loadingMore,
    hasMore,
    error,
    sentinelRef,
    handleSelectSpecialization,
    clearAllFilters,
    activeFilterCount,
  } = useNutritionistBrowsing();

  const activeSpecialization = filters.specialization;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Coaches", href: "/coaching" },
    ...(activeSpecialization
      ? [{ label: activeSpecialization.replace("_", " "), href: "" }]
      : []),
  ];

  const scrollToGrid = () => {
    const gridEl = document.getElementById("coaches-grid-section");
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16">
      {/* 1. HERO / BANNER SECTION (Very Top) */}
      <section className="relative overflow-hidden bg-emerald-950 text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        {/* Background Image with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
          <Image
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1600&q=80"
            alt="Health and Nutrition Banner"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-900/90 to-emerald-950/80 z-0" />

        <div className="max-w-7xl mx-auto relative z-10 text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-800/60 border border-emerald-500/30 rounded-full px-3.5 py-1 text-xs font-semibold text-emerald-200 mb-4 backdrop-blur-md shadow-xs">
              <Sparkles size={14} className="text-emerald-400" />
              NutriWise Personalized Coaching
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Transform Your Health With Accredited 1-on-1 Nutritionists
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 max-w-xl mb-6 font-normal">
              Partner with certified dietitians and clinical specialists to
              build tailored meal plans, manage chronic conditions, and reach
              your wellness goals.
            </p>

            <button
              type="button"
              onClick={scrollToGrid}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>Find Your Coach Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. BROWSE STATISTICS SECTION (Directly Below Banner) */}
      <section className="bg-white border-b border-slate-200/80 shadow-xs py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex items-center gap-3.5 transition-all hover:border-emerald-200 hover:shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                <Users size={22} />
              </div>
              <div>
                <span className="block text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  {stats ? stats.totalNutritionists.toLocaleString() : "150+"}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Total Nutritionists
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex items-center gap-3.5 transition-all hover:border-amber-200 hover:shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0">
                <Star size={22} className="fill-amber-400" />
              </div>
              <div>
                <span className="block text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  {stats && stats.averageRating
                    ? stats.averageRating.toFixed(1)
                    : "4.9"}{" "}
                  ★
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Average Rating
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex items-center gap-3.5 transition-all hover:border-sky-200 hover:shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-sky-100/80 text-sky-700 flex items-center justify-center shrink-0">
                <Award size={22} />
              </div>
              <div>
                <span className="block text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  {stats && stats.totalPeopleCoached
                    ? stats.totalPeopleCoached.toLocaleString()
                    : "1,200+"}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Clients Coached
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex items-center gap-3.5 transition-all hover:border-emerald-200 hover:shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <span className="block text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  {stats && stats.totalReviews
                    ? stats.totalReviews.toLocaleString()
                    : "2.5k+"}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Total Reviews
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN BROWSING LAYOUT */}
      <div id="coaches-grid-section" className="max-w-7xl mx-auto flex pt-8">
        {/* Permanent Left Sidebar for Specializations (Desktop) */}
        <div className="hidden lg:block shrink-0">
          <Sidebar
            selected={activeSpecialization}
            onSelect={handleSelectSpecialization}
          />
        </div>

        {/* Mobile Slide-Over Sidebar for Specializations */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close mobile sidebar backdrop"
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-white shadow-2xl z-50 overflow-y-auto">
              <Sidebar
                selected={activeSpecialization}
                onSelect={(val) => {
                  handleSelectSpecialization(val);
                  setMobileSidebarOpen(false);
                }}
                onCloseMobile={() => setMobileSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Browsing Content Area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8">
          {/* Top Controls Row: Search Bar + Sort Dropdown + Filter Button */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Breadcrumbs & Mobile Specialization Button */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 p-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors shrink-0"
              >
                <Menu size={16} />
                <span>Specializations</span>
              </button>

              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto max-w-full"
              >
                {breadcrumbs.map((crumb, idx) => (
                  <div
                    key={crumb.label}
                    className="flex items-center gap-1.5 shrink-0"
                  >
                    {idx === 0 ? (
                      <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="hover:text-emerald-700 flex items-center gap-1 font-medium transition-colors"
                      >
                        <Home size={13} />
                        <span>{crumb.label}</span>
                      </button>
                    ) : crumb.href ? (
                      <button
                        type="button"
                        onClick={() => router.push(crumb.href)}
                        className="hover:text-emerald-700 font-medium transition-colors"
                      >
                        {crumb.label}
                      </button>
                    ) : (
                      <span className="font-semibold text-slate-900 capitalize">
                        {crumb.label}
                      </span>
                    )}
                    {idx < breadcrumbs.length - 1 && (
                      <ChevronRight size={13} className="text-slate-300" />
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Right: Search Input + Sort Dropdown + Filter Button */}
            <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-end flex-wrap sm:flex-nowrap">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-56 md:w-60 lg:w-64">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                {search && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500"
                  >
                    <X size={14} />
                  </button>
                )}
                <input
                  type="text"
                  placeholder="Search coaches..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              {/* Sorting Dropdown */}
              <select
                aria-label="Sort options"
                value={filters.sortBy ?? ""}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    sortBy: (e.target.value || undefined) as
                      | NutritionistSortBy
                      | undefined,
                  }))
                }
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all cursor-pointer shrink-0"
              >
                <option value="">Sort: Default</option>
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              {/* Filter Button */}
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0"
              >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-white text-emerald-800 rounded-full text-[10px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active Filter Chips Bar */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-6 bg-emerald-50/60 border border-emerald-100 p-3 rounded-xl">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                <Filter size={12} />
                Active Filters:
              </span>

              {search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-slate-700 text-xs rounded-lg font-medium border border-slate-200">
                  Search: &quot;{search}&quot;
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="hover:text-rose-500"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {activeSpecialization && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 text-white text-xs rounded-lg font-medium">
                  {activeSpecialization.replace("_", " ")}
                  <button
                    type="button"
                    onClick={() => handleSelectSpecialization("")}
                    className="hover:text-emerald-200"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {(filters.languages || []).map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-emerald-900 text-xs rounded-lg font-medium border border-emerald-200 capitalize"
                >
                  Lang: {lang}
                  <button
                    type="button"
                    onClick={() =>
                      setFilters({
                        ...filters,
                        languages: (filters.languages || []).filter(
                          (l) => l !== lang,
                        ),
                      })
                    }
                    className="hover:text-rose-500"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              {filters.minRating && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 text-xs rounded-lg font-medium border border-amber-200">
                  {filters.minRating}+ Stars
                  <button
                    type="button"
                    onClick={() =>
                      setFilters({ ...filters, minRating: undefined })
                    }
                    className="hover:text-rose-500"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {filters.coachLevel && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 text-sky-900 text-xs rounded-lg font-medium border border-sky-200">
                  Level: {filters.coachLevel}
                  <button
                    type="button"
                    onClick={() =>
                      setFilters({ ...filters, coachLevel: undefined })
                    }
                    className="hover:text-rose-500"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors ml-auto underline"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium flex items-center justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={clearAllFilters}
                className="underline font-semibold"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Nutritionist Square Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="aspect-[1/1] rounded-2xl border border-slate-200 bg-white p-5 shadow-xs animate-pulse flex flex-col justify-between items-center"
                >
                  <div className="w-20 h-20 bg-slate-200 rounded-full mb-3" />
                  <div className="space-y-2 my-auto w-full flex flex-col items-center">
                    <div className="w-3/4 h-4 bg-slate-200 rounded-md" />
                    <div className="w-1/2 h-3 bg-slate-200 rounded-md" />
                    <div className="w-2/3 h-4 bg-slate-200 rounded-md mt-2" />
                  </div>
                  <div className="w-full h-8 bg-slate-200 rounded-xl" />
                </div>
              ))
            ) : nutritionists.length > 0 ? (
              nutritionists.map((coach) => (
                <NutritionistCard
                  key={coach.id || coach.username}
                  item={coach}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Users size={28} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  No coaches found
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mb-5">
                  We couldn&apos;t find any nutritionists matching your search
                  or filters.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-xs transition-colors shadow-xs"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Infinite Scroll Sentinel / Loader */}
          {!loading && hasMore && (
            <div
              ref={sentinelRef}
              className="py-10 flex items-center justify-center"
            >
              {loadingMore && (
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-xs">
                  <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  <span>Loading more coaches...</span>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Right-Side Filter Panel Drawer */}
      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={clearAllFilters}
        activeCount={activeFilterCount}
      />
    </div>
  );
}
