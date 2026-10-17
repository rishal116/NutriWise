"use client";

import {
  NUTRI_SESSION_SORT_OPTIONS,
  type NutriSessionSortOption,
} from "@/dtos/nutritionist/session/session-list-query.dto";
import type {
  SessionStatus,
  SessionType,
} from "@/types/nutritionist/session/session.types";
import {
  SORT_LABELS,
  STATUS_OPTIONS,
  TYPE_OPTIONS,
} from "@/components/nutritionist/sessions/session-list.constants";
import { Search } from "lucide-react";

interface SessionFiltersProps {
  search: string;
  type: SessionType | "";
  status: SessionStatus | "";
  sortBy: NutriSessionSortOption;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: SessionType | "") => void;
  onStatusChange: (value: SessionStatus | "") => void;
  onSortChange: (value: NutriSessionSortOption) => void;
}

export default function SessionFilters({
  search,
  type,
  status,
  sortBy,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onSortChange,
}: SessionFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs sm:grid-cols-3 xl:grid-cols-[minmax(0,1fr)_11rem_10rem_10rem]">
      <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 sm:col-span-3 xl:col-span-1">
        <Search className="h-4 w-4 shrink-0 text-slate-400" />

        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search sessions..."
          aria-label="Search sessions"
          className="h-full w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>

      <select
        value={type}
        onChange={(event) =>
          onTypeChange(event.target.value as SessionType | "")
        }
        aria-label="Filter by session type"
        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
      >
        <option value="">All Types</option>
        {TYPE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value as SessionStatus | "")
        }
        aria-label="Filter by session status"
        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
      >
        <option value="">All Status</option>
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(event) =>
          onSortChange(event.target.value as NutriSessionSortOption)
        }
        aria-label="Sort sessions"
        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
      >
        {NUTRI_SESSION_SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {SORT_LABELS[option]}
          </option>
        ))}
      </select>
    </div>
  );
}
