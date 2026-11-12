
"use client";

import { Layers, Search } from "lucide-react";

import {
  PLAN_TABS,
  SORT_LABELS,
  SPECIALIZATIONS,
  type PlanTab,
} from "@/constants/nutritionist/plan/plan.constants";

import type { Specialization } from "@/types/nutritionist.types";
import { PLAN_SORT, type PlanSort } from "@/types/plan.types";

interface PlanFiltersProps {
  activeTab: PlanTab;
  search: string;
  specialization: Specialization | "";
  sort: PlanSort;
  planCount: number;
  onTabChange: (tab: PlanTab) => void;
  onSearchChange: (value: string) => void;
  onSpecializationChange: (value: Specialization | "") => void;
  onSortChange: (value: PlanSort) => void;
}

export default function PlanFilters({
  activeTab,
  search,
  specialization,
  sort,
  planCount,
  onTabChange,
  onSearchChange,
  onSpecializationChange,
  onSortChange,
}: PlanFiltersProps) {
  return (
    <section className="space-y-5">
      <div className="inline-flex w-fit flex-wrap rounded-xl border border-slate-200 bg-slate-100 p-1">
        {PLAN_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            aria-pressed={activeTab === tab}
            className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
              activeTab === tab
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search plans..."
            aria-label="Search plans"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        <select
          value={specialization}
          onChange={(event) =>
            onSpecializationChange(
              event.target.value as Specialization | "",
            )
          }
          aria-label="Filter by specialization"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        >
          <option value="">All Specializations</option>

          {SPECIALIZATIONS.map((item) => (
            <option key={item} value={item}>
              {item.replace(/_/g, " ")}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) =>
            onSortChange(event.target.value as PlanSort)
          }
          aria-label="Sort plans"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        >
          {PLAN_SORT.map((item) => (
            <option key={item} value={item}>
              {SORT_LABELS[item]}
            </option>
          ))}
        </select>

        <div className="flex w-fit shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
          <Layers size={14} className="text-emerald-600" />

          <span className="whitespace-nowrap text-xs font-bold text-slate-600">
            {planCount} {planCount === 1 ? "Plan" : "Plans"}
          </span>
        </div>
      </div>
    </section>
  );
}
