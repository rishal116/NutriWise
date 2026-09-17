import { RotateCcw, Search } from "lucide-react";

import { AdminChallengeListQueryDTO } from "@/dtos/admin/challenge/admin-challenge-list-query.dto";

interface ChallengeFiltersProps {
  query: AdminChallengeListQueryDTO;
  isFiltered: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onAccessTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
}

const selectClassName =
  "min-h-10 w-full rounded-lg border border-slate-200/80 bg-slate-50/50 px-3 py-2 text-sm font-medium text-slate-700 transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10";

const inputClassName =
  "min-h-10 w-full rounded-lg border border-slate-200/80 bg-slate-50/50 py-2 pl-9 pr-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10";

export function ChallengeFilters({
  query,
  isFiltered,
  onSearchChange,
  onCategoryChange,
  onDifficultyChange,
  onAccessTypeChange,
  onStatusChange,
  onSortChange,
  onClearFilters,
}: ChallengeFiltersProps) {
  return (
    <section className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm sm:p-4">
      {/* Search + filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {/* Search */}
        <div className="relative sm:col-span-2 lg:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search challenges..."
            value={query.search ?? ""}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            className={inputClassName}
          />
        </div>

        {/* Category */}
        <select
          value={query.category ?? "all"}
          onChange={(event) =>
            onCategoryChange(event.target.value)
          }
          className={selectClassName}
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          <option value="nutrition">Nutrition</option>
          <option value="hydration">Hydration</option>
          <option value="fitness">Fitness</option>
          <option value="sleep">Sleep</option>
          <option value="mindfulness">Mindfulness</option>
          <option value="healthy_habits">
            Healthy Habits
          </option>
          <option value="wellness">Wellness</option>
          <option value="weight_management">
            Weight Management
          </option>
        </select>

        {/* Difficulty */}
        <select
          value={query.difficulty ?? "all"}
          onChange={(event) =>
            onDifficultyChange(event.target.value)
          }
          className={selectClassName}
          aria-label="Filter by difficulty"
        >
          <option value="all">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">
            Intermediate
          </option>
          <option value="advanced">Advanced</option>
        </select>

        {/* Access */}
        <select
          value={query.accessType ?? "all"}
          onChange={(event) =>
            onAccessTypeChange(event.target.value)
          }
          className={selectClassName}
          aria-label="Filter by access type"
        >
          <option value="all">All Access</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>

        {/* Status */}
        <select
          value={query.status ?? "all"}
          onChange={(event) =>
            onStatusChange(event.target.value)
          }
          className={selectClassName}
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Bottom controls */}
      <div className="mt-3 flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="challenge-sort"
            className="shrink-0 text-xs font-medium text-slate-400"
          >
            Sort by
          </label>

          <select
            id="challenge-sort"
            value={query.sortBy ?? "newest"}
            onChange={(event) =>
              onSortChange(event.target.value)
            }
            className="min-h-9 rounded-lg border border-transparent bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Clear filters */}
        {isFiltered && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:border-emerald-200 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 sm:w-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>
    </section>
  );
}