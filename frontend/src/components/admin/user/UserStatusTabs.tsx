import { STATUS_FILTERS, type StatusFilter } from "./user-table.types";

interface UserStatusTabsProps {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}

export default function UserStatusTabs({
  value,
  onChange,
}: UserStatusTabsProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl bg-admin-bg p-1">
      {STATUS_FILTERS.map((filter) => {
        const active = value === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            aria-pressed={active}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60 ${
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
  );
}