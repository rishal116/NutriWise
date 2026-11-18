
"use client";

import { Search } from "lucide-react";

import {
  PROGRAM_STATUS_FILTER,
  ProgramSortBy,
  type ProgramStatusFilter,
} from "@/types/program.types";

const STATUS_LABELS: Record<ProgramStatusFilter, string> = {
  all: "All programs",
  upcoming: "Upcoming",
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  cancelled: "Cancelled",
};

const SORT_OPTIONS: { value: ProgramSortBy; label: string }[] = [
  { value: ProgramSortBy.LATEST, label: "Latest" },
  { value: ProgramSortBy.OLDEST, label: "Oldest" },
  { value: ProgramSortBy.START_DATE, label: "Start date" },
  { value: ProgramSortBy.END_DATE, label: "End date" },
  { value: ProgramSortBy.PROGRESS, label: "Progress" },
];

interface ProgramFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  programStatus: ProgramStatusFilter;
  onProgramStatusChange: (value: ProgramStatusFilter) => void;
  sortBy: ProgramSortBy;
  onSortByChange: (value: ProgramSortBy) => void;
}

export function ProgramFiltersBar({
  search,
  onSearchChange,
  programStatus,
  onProgramStatusChange,
  sortBy,
  onSortByChange,
}: ProgramFiltersBarProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search programs by client name"
            aria-label="Search programs by client name"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
          />
        </div>

        <select
          value={sortBy}
          onChange={(event) =>
            onSortByChange(event.target.value as ProgramSortBy)
          }
          aria-label="Sort programs"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 sm:w-48"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div
        className="no-scrollbar flex items-center gap-2 overflow-x-auto"
        role="group"
        aria-label="Filter programs by status"
      >
        {PROGRAM_STATUS_FILTER.map((value) => {
          const isSelected = programStatus === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => onProgramStatusChange(value)}
              aria-pressed={isSelected}
              className={`shrink-0 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
                isSelected
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {STATUS_LABELS[value]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
