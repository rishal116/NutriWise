"use client";

import { ArrowDown, ArrowUp } from "lucide-react";

import type { SortBy, StatusFilter } from "./application-table.utils";
import { STATUS_FILTERS } from "./application-table.utils";
import UserSearchBar from "../UserSearchBar";

interface ApplicationFiltersProps {
  search: string;
  sortBy: SortBy;
  statusFilter: StatusFilter;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onSort: () => void;
  onStatusChange: (value: StatusFilter) => void;
  onClearFilters: () => void;
}

export default function ApplicationFilters({
  search,
  sortBy,
  statusFilter,
  hasActiveFilters,
  onSearchChange,
  onSort,
  onStatusChange,
  onClearFilters,
}: ApplicationFiltersProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => onStatusChange(filter.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                statusFilter === filter.value
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <UserSearchBar value={search} onChange={onSearchChange} />

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="shrink-0 text-xs font-semibold text-teal-700 transition hover:text-teal-800"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={onSort}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-800"
        >
          {sortBy === "newest" ? (
            <ArrowDown size={13} />
          ) : (
            <ArrowUp size={13} />
          )}
          {sortBy === "newest" ? "Newest first" : "Oldest first"}
        </button>
      </div>
    </div>
  );
}