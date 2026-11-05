import UserSearchBar from "../UserSearchBar";
import UserStatusTabs from "../user/UserStatusTabs";
import type { StatusFilter } from "../user/user-table.types";

import {
  COACH_LEVEL_OPTIONS,
  type CoachLevelFilter,
} from "./nutritionist-table.types";

interface NutritionistToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  coachLevel: CoachLevelFilter;
  onCoachLevelChange: (value: CoachLevelFilter) => void;
  hasActiveFilters: boolean;
  onClear: () => void;
}

export default function NutritionistToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  coachLevel,
  onCoachLevelChange,
  hasActiveFilters,
  onClear,
}: NutritionistToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-admin-border p-4 lg:flex-row lg:items-center lg:justify-between">
      <UserStatusTabs value={status} onChange={onStatusChange} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={coachLevel}
          onChange={(event) =>
            onCoachLevelChange(event.target.value as CoachLevelFilter)
          }
          aria-label="Filter by coach level"
          className="w-full rounded-lg border border-admin-border bg-admin-surface-hover px-3 py-2 text-xs font-bold text-admin-text outline-none transition-colors focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/20 sm:w-auto"
        >
          {COACH_LEVEL_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <UserSearchBar value={search} onChange={onSearchChange} />

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 self-start text-xs font-semibold text-admin-accent transition-colors hover:text-admin-accent-hover sm:self-auto"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}