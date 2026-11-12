import { ArrowUpDown, RotateCcw, Search } from "lucide-react";

import { NutritionistPlanDaySort } from "@/dtos/nutritionist/plan-day/nutritionist-plan-day-list-query.dto";

interface PlanDayFiltersProps {
  search: string;
  dayNumber: string;
  sort: NutritionistPlanDaySort;
  onSearchChange: (value: string) => void;
  onDayNumberChange: (value: string) => void;
  onSortChange: (value: NutritionistPlanDaySort) => void;
  onClear: () => void;
}

export default function PlanDayFilters({
  search,
  dayNumber,
  sort,
  onSearchChange,
  onDayNumberChange,
  onSortChange,
  onClear,
}: PlanDayFiltersProps) {
  const hasFilters = Boolean(search.trim() || dayNumber);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative min-w-0 flex-1 sm:min-w-56">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search plan days..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs font-medium text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-400"
        />
      </div>

      <input
        type="number"
        min={1}
        step={1}
        value={dayNumber}
        onChange={(event) => onDayNumberChange(event.target.value)}
        placeholder="Day number"
        aria-label="Filter by day number"
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-400 sm:w-32"
      />

      <div className="relative">
        <ArrowUpDown
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <select
          value={sort}
          onChange={(event) =>
            onSortChange(event.target.value as NutritionistPlanDaySort)
          }
          aria-label="Sort plan days"
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-xs font-bold text-slate-600 outline-none transition-colors focus:border-emerald-400 sm:w-auto"
        >
          <option value={NutritionistPlanDaySort.DAY_ASC}>
            Day: Low–High
          </option>

          <option value={NutritionistPlanDaySort.DAY_DESC}>
            Day: High–Low
          </option>

          <option value={NutritionistPlanDaySort.NEWEST}>
            Newest first
          </option>

          <option value={NutritionistPlanDaySort.OLDEST}>
            Oldest first
          </option>
        </select>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-500 transition-colors hover:border-emerald-200 hover:text-emerald-600"
        >
          <RotateCcw size={13} />
          Clear filters
        </button>
      )}
    </div>
  );
}