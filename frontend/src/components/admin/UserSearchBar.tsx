"use client";

import { Search, X } from "lucide-react";

interface UserSearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export default function UserSearchBar({ value, onChange }: UserSearchBarProps) {
  return (
    <div className="relative group w-full sm:max-w-xs">
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        <Search
          size={14}
          strokeWidth={2}
          className="text-slate-400 group-focus-within:text-teal-500 transition-colors"
        />
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search users..."
        className="w-full rounded-xl bg-slate-50 border border-slate-200 py-2 pl-9 pr-8 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}