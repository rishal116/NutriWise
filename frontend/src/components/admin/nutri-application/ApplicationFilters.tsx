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

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60";

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
    <div className="flex flex-col gap-3 border-b border-admin-border p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center gap-1 self-start rounded-xl bg-admin-bg p-1">
          {STATUS_FILTERS.map((filter) => {
            const active = statusFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => onStatusChange(filter.value)}
                aria-pressed={active}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${focusRing} ${
                  active
                    ? "bg-admin-surface text-admin-accent shadow-sm"
                    : "text-admin-muted hover:text-admin-text"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <UserSearchBar
            value={search}
            onChange={onSearchChange}
            placeholder="Search applications..."
          />

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="shrink-0 text-xs font-semibold text-admin-accent transition-colors hover:text-admin-accent-hover"
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
          className={`inline-flex items-center gap-2 rounded-lg text-xs font-semibold text-admin-muted transition-colors hover:text-admin-text ${focusRing}`}
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