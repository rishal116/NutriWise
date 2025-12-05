"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import React, { useState } from "react";

export default function FilterBar({ onApply }: any) {
  const [filters, setFilters] = useState({
    search: "",
    expertise: [] as string[],
    language: [] as string[],
    region: [] as string[],
    minFee: "",
    maxFee: "",
  });

  const toggleFilter = (
    key: "expertise" | "language" | "region",
    value: string
  ) => {
    setFilters((p) => ({
      ...p,
      [key]: p[key].includes(value)
        ? p[key].filter((v) => v !== value)
        : [...p[key], value],
    }));
  };

  const clearAllFilters = () =>
    setFilters({
      search: "",
      expertise: [],
      language: [],
      region: [],
      minFee: "",
      maxFee: "",
    });

  const hasFilters =
    filters.search ||
    filters.expertise.length ||
    filters.language.length ||
    filters.region.length ||
    filters.minFee ||
    filters.maxFee;

  const expertiseOptions = ["Weight Loss", "Diabetes", "Sports Nutrition", "PCOS", "Women's Health", "General Diet"];
  const languageOptions = ["English", "Hindi", "Malayalam", "Tamil", "Kannada", "Telugu"];
  const regionOptions = ["North India", "South India", "East India", "West India", "Central India"];

  return (
    <div className="bg-white rounded-2xl border shadow-md flex flex-col">
      {/* Header */}
      <div className="bg-green-600 px-5 py-4 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="text-white w-5 h-5" />
          <h2 className="text-white font-semibold text-lg">Filters</h2>
        </div>
        {hasFilters && (
          <button
            onClick={clearAllFilters}
            className="text-white/90 hover:text-white text-sm"
          >
            Clear
          </button>
        )}
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-xl">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            className="ml-2 bg-transparent outline-none w-full"
            placeholder="Search nutritionist..."
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />
          {filters.search && (
            <X
              className="w-4 h-4 text-gray-500 cursor-pointer"
              onClick={() => setFilters({ ...filters, search: "" })}
            />
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        <FilterSection
          title="Expertise"
          options={expertiseOptions}
          selected={filters.expertise}
          onToggle={(v: string) => toggleFilter("expertise", v)}
        />

        <FilterSection
          title="Language"
          options={languageOptions}
          selected={filters.language}
          onToggle={(v: string) => toggleFilter("language", v)}
        />

        <FilterSection
          title="Region"
          options={regionOptions}
          selected={filters.region}
          onToggle={(v: string) => toggleFilter("region", v)}
        />

        {/* Fee */}
        <div>
          <h3 className="font-semibold text-gray-800">Fee Range</h3>
          <div className="flex gap-2 mt-2">
            <input
              type="number"
              placeholder="Min ₹"
              className="w-1/2 border rounded-xl px-3 py-2"
              value={filters.minFee}
              onChange={(e) =>
                setFilters({ ...filters, minFee: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Max ₹"
              className="w-1/2 border rounded-xl px-3 py-2"
              value={filters.maxFee}
              onChange={(e) =>
                setFilters({ ...filters, maxFee: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Apply */}
      <div className="p-4 border-t">
        <button
          onClick={() => onApply(filters)}   // 🔥 THIS IS THE MAIN CHANGE
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

function FilterSection({ title, options, selected, onToggle }: any) {
  return (
    <div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <div className="mt-2 flex flex-col gap-2">
        {options.map((opt: string) => (
          <label key={opt} className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 accent-green-600"
              checked={selected.includes(opt)}
              onChange={() => onToggle(opt)}
            />
            <span className="text-gray-700">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
