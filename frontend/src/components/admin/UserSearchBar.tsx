"use client";

import { Search, X } from "lucide-react";

interface UserSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function UserSearchBar({
  value,
  onChange,
  placeholder = "Search users...",
}: UserSearchBarProps) {
  return (
    <div className="relative w-full sm:w-72">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted"
        size={16}
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-lg border border-admin-border bg-admin-surface py-2 pl-9 pr-8 text-sm text-admin-text transition-colors placeholder:text-admin-muted focus:border-admin-accent focus:outline-none focus:ring-2 focus:ring-admin-accent/30"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-admin-muted transition-colors hover:text-admin-text"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}