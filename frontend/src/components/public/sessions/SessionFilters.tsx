"use client";

import type { FormEvent } from "react";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";

import type { PublicSessionSortOption } from "@/dtos/public/session/public-session-list-query.dto";
import {
  SESSION_SORT_OPTIONS,
  SESSION_TYPE_LABELS,
} from "@/constants/public/session.constants";
import type {
  SessionPricingType,
  SessionType,
} from "@/types/public/session/session.types";

interface SessionFiltersProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearch: (value: string) => void;
  type: SessionType | undefined;
  onTypeChange: (value: SessionType | undefined) => void;
  pricingType: SessionPricingType | undefined;
  onPricingTypeChange: (value: SessionPricingType | undefined) => void;
  sortBy: PublicSessionSortOption;
  onSortChange: (value: PublicSessionSortOption) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  sessionTypes: readonly SessionType[];
  pricingTypes: readonly SessionPricingType[];
}

export default function SessionFilters({
  searchInput,
  onSearchInputChange,
  onSearch,
  type,
  onTypeChange,
  pricingType,
  onPricingTypeChange,
  sortBy,
  onSortChange,
  hasActiveFilters,
  onClearFilters,
  sessionTypes,
  pricingTypes,
}: SessionFiltersProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchInput);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <Search
          aria-hidden="true"
          className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        />

        <input
          type="search"
          value={searchInput}
          onChange={(event) => onSearchInputChange(event.target.value)}
          placeholder="Search sessions..."
          aria-label="Search sessions"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-24 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />

        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          Search
        </button>
      </form>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
            <SlidersHorizontal size={15} aria-hidden="true" />
            Filters
          </span>

          <div className="relative">
            <select
              aria-label="Filter by session type"
              value={type ?? ""}
              onChange={(event) =>
                onTypeChange((event.target.value as SessionType) || undefined)
              }
              className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">All types</option>
              {sessionTypes.map((sessionType) => (
                <option key={sessionType} value={sessionType}>
                  {SESSION_TYPE_LABELS[sessionType]}
                </option>
              ))}
            </select>

            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
          </div>

          <div className="relative">
            <select
              aria-label="Filter by pricing"
              value={pricingType ?? ""}
              onChange={(event) =>
                onPricingTypeChange(
                  (event.target.value as SessionPricingType) || undefined,
                )
              }
              className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">All pricing</option>
              {pricingTypes.map((pricing) => (
                <option key={pricing} value={pricing}>
                  {pricing === "free" ? "Free" : "Paid"}
                </option>
              ))}
            </select>

            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="rounded-lg px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="relative self-start lg:self-auto">
          <select
            aria-label="Sort sessions"
            value={sortBy}
            onChange={(event) =>
              onSortChange(event.target.value as PublicSessionSortOption)
            }
            className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {SESSION_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>
    </div>
  );
}
