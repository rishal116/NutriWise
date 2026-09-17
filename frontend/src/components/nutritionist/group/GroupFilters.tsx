"use client";

import {
  ArrowDownAZ,
  ArrowUpAZ,
  Filter,
  Search,
  X,
} from "lucide-react";

import type { NutritionistGroupListQueryDTO } from "@/dtos/nutritionist/group/group-list-query.dto";

interface GroupFiltersProps {
  query: NutritionistGroupListQueryDTO;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onQueryChange: (
    key: keyof NutritionistGroupListQueryDTO,
    value: string | undefined,
  ) => void;
  onClearFilters: () => void;
}

export default function GroupFilters({
  query,
  searchValue,
  onSearchChange,
  onQueryChange,
  onClearFilters,
}: GroupFiltersProps) {
  const hasFilters =
    Boolean(query.status) ||
    Boolean(query.visibility) ||
    Boolean(query.sortBy);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search your groups..."
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            aria-label="Search groups"
          />
        </div>

        <select
          value={query.sortBy ?? ""}
          onChange={(event) =>
            onQueryChange("sortBy", event.target.value || undefined)
          }
          className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 lg:w-48"
          aria-label="Sort groups"
        >
          <option value="">Sort by</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="title_asc">Title A–Z</option>
          <option value="title_desc">Title Z–A</option>
        </select>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Filter size={14} />
            Filters
          </div>

          <button
            type="button"
            onClick={() =>
              onQueryChange(
                "visibility",
                query.visibility === "public" ? undefined : "public",
              )
            }
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              query.visibility === "public"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            <GlobeIcon />
            Public
          </button>

          <button
            type="button"
            onClick={() =>
              onQueryChange(
                "visibility",
                query.visibility === "private" ? undefined : "private",
              )
            }
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              query.visibility === "private"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            <LockIcon />
            Private
          </button>

          <button
            type="button"
            onClick={() =>
              onQueryChange(
                "status",
                query.status === "active" ? undefined : "active",
              )
            }
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              query.status === "active"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            Active
          </button>

          {hasFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-400 transition hover:text-slate-700"
            >
              <X size={13} />
              Clear
            </button>
          )}
        </div>

        {query.sortBy && (
          <div className="hidden items-center gap-1.5 text-xs font-medium text-slate-400 sm:flex">
            {query.sortBy.includes("desc") ? (
              <ArrowDownAZ size={14} />
            ) : (
              <ArrowUpAZ size={14} />
            )}
            {query.sortBy.replace("_", " ")}
          </div>
        )}
      </div>
    </div>
  );
}

function GlobeIcon() {
  return <span className="text-[11px]">◉</span>;
}

function LockIcon() {
  return <span className="text-[11px]">●</span>;
}