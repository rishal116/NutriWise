"use client";

import { Search } from "lucide-react";

export default function UserSearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex justify-end mb-4">
      <div className="relative w-72">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search users..."
          className="w-full bg-gray-900 text-sm pl-9 pr-3 py-2 rounded-md border border-gray-700 text-white focus:outline-none"
        />
      </div>
    </div>
  );
}
