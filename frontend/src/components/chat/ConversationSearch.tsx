"use client";

import { Search, X } from "lucide-react";

interface ConversationSearchProps {
  value: string;
  onChange: (val: string) => void;
}

export default function ConversationSearch({
  value,
  onChange,
}: ConversationSearchProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        placeholder="Search chats..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-9 py-2 bg-slate-100/80 border border-transparent rounded-xl text-xs text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/10 font-medium"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3 h-3 text-slate-500" />
        </button>
      )}
    </div>
  );
}
