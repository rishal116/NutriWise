import { Search } from "lucide-react";
import {
  PROGRAM_STATUS_FILTER,
  SUBSCRIPTION_STATUS_FILTER,
  ProgramSortBy,
  ProgramStatusFilter,
  SubscriptionStatusFilter,
} from "@/dtos/nutritionist/program/program-request.dto";

const STATUS_LABELS: Record<ProgramStatusFilter, string> = {
  all: "All",
  upcoming: "Upcoming",
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  cancelled: "Cancelled",
};

const SUBSCRIPTION_LABELS: Record<SubscriptionStatusFilter, string> = {
  all: "All subscriptions",
  pending: "Pending",
  active: "Active",
  expired: "Expired",
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
  subscriptionStatus: SubscriptionStatusFilter;
  onSubscriptionStatusChange: (value: SubscriptionStatusFilter) => void;
  sortBy: ProgramSortBy;
  onSortByChange: (value: ProgramSortBy) => void;
}

export function ProgramFiltersBar({
  search,
  onSearchChange,
  programStatus,
  onProgramStatusChange,
  subscriptionStatus,
  onSubscriptionStatusChange,
  sortBy,
  onSortByChange,
}: ProgramFiltersBarProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search programs by client name"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
          />
        </div>

        <select
          value={subscriptionStatus}
          onChange={(e) =>
            onSubscriptionStatusChange(
              e.target.value as SubscriptionStatusFilter,
            )
          }
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 sm:w-48"
        >
          {SUBSCRIPTION_STATUS_FILTER.map((value) => (
            <option key={value} value={value}>
              {SUBSCRIPTION_LABELS[value]}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as ProgramSortBy)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 sm:w-48"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
        {PROGRAM_STATUS_FILTER.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onProgramStatusChange(value)}
            className={`shrink-0 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
              programStatus === value
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {STATUS_LABELS[value]}
          </button>
        ))}
      </div>
    </div>
  );
}
