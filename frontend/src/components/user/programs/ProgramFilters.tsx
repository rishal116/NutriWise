import { Search, X } from "lucide-react";

import {
  PROGRAM_STATUS,
  ProgramStatus,
  SUBSCRIPTION_STATUS,
  SubscriptionStatus,
  UserProgramSort,
} from "@/dtos/user/program/user-program-request.dto";

const SORT_LABELS: Record<UserProgramSort, string> = {
  [UserProgramSort.NEWEST]: "Newest first",
  [UserProgramSort.OLDEST]: "Oldest first",
  [UserProgramSort.START_DATE]: "Start date",
  [UserProgramSort.END_DATE]: "End date",
};

interface ProgramFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  programStatus: ProgramStatus | "all";
  onProgramStatusChange: (value: ProgramStatus | "all") => void;
  subscriptionStatus: SubscriptionStatus | "all";
  onSubscriptionStatusChange: (value: SubscriptionStatus | "all") => void;
  sort: UserProgramSort;
  onSortChange: (value: UserProgramSort) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const selectClassName =
  "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition-colors duration-150 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

export function ProgramFilters({
  search,
  onSearchChange,
  programStatus,
  onProgramStatusChange,
  subscriptionStatus,
  onSubscriptionStatusChange,
  sort,
  onSortChange,
  onReset,
  hasActiveFilters,
}: ProgramFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search programs..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs font-medium text-slate-700 transition-colors duration-150 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={programStatus}
          onChange={(e) =>
            onProgramStatusChange(e.target.value as ProgramStatus | "all")
          }
          className={selectClassName}
        >
          <option value="all">All program status</option>
          {PROGRAM_STATUS.map((status) => (
            <option key={status} value={status} className="capitalize">
              {status}
            </option>
          ))}
        </select>

        <select
          value={subscriptionStatus}
          onChange={(e) =>
            onSubscriptionStatusChange(
              e.target.value as SubscriptionStatus | "all",
            )
          }
          className={selectClassName}
        >
          <option value="all">All subscription status</option>
          {SUBSCRIPTION_STATUS.map((status) => (
            <option key={status} value={status} className="capitalize">
              {status}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as UserProgramSort)}
          className={selectClassName}
        >
          {Object.values(UserProgramSort).map((value) => (
            <option key={value} value={value}>
              {SORT_LABELS[value]}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
