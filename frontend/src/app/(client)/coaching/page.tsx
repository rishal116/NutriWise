"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronRight, Home, Users } from "lucide-react";
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
    return;
  }

  setFilters({ specializations: val });
  setPage(1);
  setBreadcrumbs(["Homepage", val]);
  router.push(`/coaching?specialization=${encodeURIComponent(val)}`);
};

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      
      <div className="border-r border-slate-200 bg-white shadow-sm">
        <Sidebar
          selected={filters.specializations ? [filters.specializations] : []}
          onSelect={handleSelectSpecialization}
        />
      </div>

      <main className="flex-1 px-8 py-10 lg:px-14 overflow-y-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-14 border-b border-slate-200 pb-8">
          <div>
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-3">
              {breadcrumbs.map((label, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span
                    onClick={() => label === "Homepage" && router.push("/home")}
                    className={`${
                      label === "Homepage"
                        ? "hover:text-green-600 cursor-pointer flex items-center gap-1"
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

            <h1 className="text-4xl font-extrabold tracking-tight">
              {filters.specializations
                ? `Coaches for ${filters.specializations}`
                : "Fitness & Nutrition Coaches"}
            </h1>
          </div>

          {/* Search */}
<div className="relative group">
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
      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
    >
      ✕
    </button>
  )}

  <input
    type="text"
    placeholder="Search by name or keyword..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full md:w-96 pl-12 pr-10 py-3.5 border rounded-2xl"
  />
</div>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-72 rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 animate-pulse"
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
            <div className="col-span-full flex flex-col items-center justify-center py-28 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
              <Users size={48} className="text-slate-300 mb-4" />
              <p className="text-slate-600 font-semibold tracking-wide">
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
              className="mt-6 px-6 py-2.5 rounded-xl border border-green-600 text-green-600 hover:bg-green-50 transition font-semibold text-sm">
                Clear all filters
                </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center mt-16 gap-3">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setPage(i + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-11 h-11 rounded-xl font-semibold transition-all border shadow-sm ${
                  page === i + 1
                    ? "bg-green-600 border-green-600 text-white shadow-green-200"
                    : "bg-white border-slate-200 text-slate-600 hover:border-green-500 hover:text-green-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
