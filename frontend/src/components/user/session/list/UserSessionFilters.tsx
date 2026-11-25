"use client";

import type { FormEvent } from "react";
import { Search, RotateCcw } from "lucide-react";

import type {
  UserSessionListQueryDTO,
  UserSessionSortBy,
} from "@/dtos/user/session/user-session-list-query.dto";
import { SessionRegistrationStatus } from "@/constants/common/session-registration.constants";
import { SessionStatus } from "@/constants/common/session.constants";

const REGISTRATION_STATUSES: SessionRegistrationStatus[] = [
  "registered",
  "cancelled",
  "attended",
  "absent",
];

const SESSION_STATUSES: SessionStatus[] = [
  "draft",
  "scheduled",
  "live",
  "completed",
  "cancelled",
];

const SORT_OPTIONS: { label: string; value: UserSessionSortBy }[] = [
  { label: "Upcoming first", value: "upcoming" },
  { label: "Recently registered", value: "latest" },
  { label: "Oldest registration", value: "oldest" },
  { label: "Title A–Z", value: "title_asc" },
  { label: "Title Z–A", value: "title_desc" },
];

interface UserSessionFiltersProps {
  search: string;
  registrationStatus: UserSessionListQueryDTO["registrationStatus"] | "";
  sessionStatus: UserSessionListQueryDTO["sessionStatus"] | "";
  sortBy: UserSessionSortBy;
  onSearchChange: (value: string) => void;
  onRegistrationStatusChange: (
    value: SessionRegistrationStatus | "",
  ) => void;
  onSessionStatusChange: (value: SessionStatus | "") => void;
  onSortChange: (value: UserSessionSortBy) => void;
  onSubmit: () => void;
  onReset: () => void;
}

function formatLabel(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function UserSessionFilters({
  search,
  registrationStatus,
  sessionStatus,
  sortBy,
  onSearchChange,
  onRegistrationStatusChange,
  onSessionStatusChange,
  onSortChange,
  onSubmit,
  onReset,
}: UserSessionFiltersProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  const selectClass =
    "h-9 w-full rounded-lg border border-gray-200 bg-white px-2.5 text-xs text-gray-700 outline-none transition focus:border-emerald-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 bg-white p-3"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            id="session-search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search sessions..."
            maxLength={100}
            className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-xs text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-emerald-500"
          />
        </div>

        {/* Registration status */}
        <select
          aria-label="Registration status"
          value={registrationStatus}
          onChange={(event) =>
            onRegistrationStatusChange(
              event.target.value as SessionRegistrationStatus | "",
            )
          }
          className={`${selectClass} sm:w-36`}
        >
          <option value="">All registrations</option>
          {REGISTRATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {formatLabel(status)}
            </option>
          ))}
        </select>

        {/* Session status */}
        <select
          aria-label="Session status"
          value={sessionStatus}
          onChange={(event) =>
            onSessionStatusChange(event.target.value as SessionStatus | "")
          }
          className={`${selectClass} sm:w-32`}
        >
          <option value="">All statuses</option>
          {SESSION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {formatLabel(status)}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          aria-label="Sort sessions"
          value={sortBy}
          onChange={(event) =>
            onSortChange(event.target.value as UserSessionSortBy)
          }
          className={`${selectClass} sm:w-40`}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white transition hover:bg-emerald-700 sm:flex-none"
          >
            <Search size={14} />
            Apply
          </button>

          <button
            type="button"
            onClick={onReset}
            aria-label="Reset filters"
            title="Reset filters"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-200 px-3 text-gray-600 transition hover:bg-gray-50"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </form>
  );
}