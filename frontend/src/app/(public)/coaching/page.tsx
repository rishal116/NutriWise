"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  ChevronRight,
  Home,
  Users,
  Menu,
  X,
  Award,
  Heart,
  Star,
  TrendingUp,
} from "lucide-react";
import Sidebar from "@/components/ui/nutritionists/SideBar";
import NutritionistCard from "@/components/ui/nutritionists/NutritionistCard";
import { nutritionistListService } from "@/services/user/nutritionistList.service";

type FilterState = {
  specializations?: string;
};

export default function NutritionistsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({});
  const [nutritionists, setNutritionists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(["Homepage"]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const [page, setPage] = useState(1);
  const limit = 4; 
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const specializationFromUrl = searchParams.get("specialization");
    if (specializationFromUrl) {
      setFilters({ specializations: specializationFromUrl });
      setBreadcrumbs(["Homepage", specializationFromUrl]);
      setPage(1);
    } else {
      setFilters({});
      setBreadcrumbs(["Homepage"]);
    }
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await nutritionistListService.getAll({
        ...filters,
        search: debouncedSearch,
        page,
        limit,
      });
      setNutritionists(res.data);
      setTotalPages(res.totalPages);
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectSpecialization = (val: string) => {
    if (!val) {
      setFilters({});
      setBreadcrumbs(["Homepage"]);
      setPage(1);
      router.push("/coaching");
      setSidebarOpen(false);
      return;
    }

    setFilters({ specializations: val });
    setPage(1);
    setBreadcrumbs(["Homepage", val]);
    router.push(`/coaching?specialization=${encodeURIComponent(val)}`);
    setSidebarOpen(false);
  };

  const stats = [
    { icon: Users, number: "50+", label: "Expert Nutritionists" },
    { icon: Award, number: "10K+", label: "People Coached" },
    { icon: Star, number: "4.9", label: "Average Rating" },
    { icon: Heart, number: "95%", label: "Success Rate" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* HERO BANNER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-16 sm:py-20 lg:py-24">
        {/* Background Decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">
                Expert Guidance
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Find Your Perfect{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Nutrition Coach
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Connect with certified nutritionists who specialize in your health
              goals. Get personalized plans, expert guidance, and achieve
              lasting results.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  document
                    .getElementById("nutritionists-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Browse Nutritionists
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-12">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NUTRITIONISTS SECTION */}
      <div id="nutritionists-section" className="flex">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block border-r border-slate-200 bg-white shadow-sm">
          <Sidebar
            selected={filters.specializations ? [filters.specializations] : []}
            onSelect={handleSelectSpecialization}
          />
        </div>

        {/* Sidebar - Mobile Overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-80 z-50 lg:hidden animate-slide-in">
              <Sidebar
                selected={
                  filters.specializations ? [filters.specializations] : []
                }
                onSelect={handleSelectSpecialization}
              />
            </div>
          </>
        )}

        <main className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-14 py-6 sm:py-8 lg:py-10 overflow-y-auto">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mb-6 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all shadow-md"
          >
            <Menu size={20} />
            <span>Filters</span>
            {filters.specializations && (
              <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                1
              </span>
            )}
          </button>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8 mb-10 sm:mb-14 border-b border-slate-200 pb-6 sm:pb-8">
            <div className="flex-1">
              <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-3 flex-wrap">
                {breadcrumbs.map((label, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span
                      onClick={() =>
                        label === "Homepage" && router.push("/home")
                      }
                      className={`${
                        label === "Homepage"
                          ? "hover:text-emerald-600 cursor-pointer flex items-center gap-1"
                          : "font-medium text-slate-900"
                      }`}
                    >
                      {label === "Homepage" && <Home size={14} />}
                      {label}
                    </span>
                    {idx < breadcrumbs.length - 1 && (
                      <ChevronRight size={14} className="text-slate-300" />
                    )}
                  </div>
                ))}
              </nav>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                {filters.specializations
                  ? `Coaches for ${filters.specializations}`
                  : "All Nutrition Coaches"}
              </h2>
            </div>

            {/* Search */}
            <div className="relative group w-full md:w-auto">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  ✕
                </button>
              )}

              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-80 lg:w-96 pl-12 pr-10 py-3 sm:py-3.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
              />
            </div>
          </div>

          {/* Active Filter Badge (Mobile) */}
          {filters.specializations && (
            <div className="lg:hidden mb-6 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-slate-600">Active filter:</span>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-full text-sm font-medium text-emerald-700">
                {filters.specializations}
                <button
                  onClick={() => handleSelectSpecialization("")}
                  className="hover:text-emerald-900 transition-colors"
                  aria-label="Clear specialization filter" // This solves the error
                  title="Clear filter"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Cards - 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 animate-pulse"
                />
              ))
            ) : nutritionists.length ? (
              nutritionists.map((n) => (
                <div
                  key={n.id}
                  className="transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <NutritionistCard item={n} />
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 sm:py-28 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm px-4">
                <Users size={48} className="text-slate-300 mb-4" />
                <p className="text-slate-600 font-semibold tracking-wide text-center">
                  No coaches match your current filters.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setFilters({});
                    setPage(1);
                    setBreadcrumbs(["Homepage"]);
                    router.push("/coaching");
                  }}
                  className="mt-6 px-6 py-2.5 rounded-xl border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition font-semibold text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center mt-12 sm:mt-16 gap-2 sm:gap-3 flex-wrap">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPage(i + 1);
                    document
                      .getElementById("nutritionists-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl font-semibold transition-all border shadow-sm text-sm sm:text-base ${
                    page === i + 1
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 border-transparent text-white shadow-emerald-200"
                      : "bg-white border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
