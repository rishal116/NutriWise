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
    <div className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1">
      {STATUS_FILTERS.map((filter) => {
        const active = value === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            aria-pressed={active}
            className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
              active
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}