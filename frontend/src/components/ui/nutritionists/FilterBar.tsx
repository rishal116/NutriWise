"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

/* -------------------- Types -------------------- */
export interface Filters {
  search?: string;
  specializations?: string[];
  languages?: string[];
  country?: string[];
  availabilityStatus?: string[];
  minExperience?: number;
  minRating?: number;
}

interface Props {
  onApply: (filters: Filters) => void;
}

/* -------------------- Component -------------------- */
export default function FilterBar({ onApply }: Props) {
  const [filters, setFilters] = useState({
    search: "",
    specializations: [] as string[],
    languages: [] as string[],
    country: [] as string[],
    availabilityStatus: [] as string[],
    minExperience: "",
    minRating: "",
  });

  /* -------------------- Helpers -------------------- */
  const toggleArrayFilter = (
    key:
      | "specializations"
      | "languages"
      | "country"
      | "availabilityStatus",
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const clearAll = () => {
    setFilters({
      search: "",
      specializations: [],
      languages: [],
      country: [],
      availabilityStatus: [],
      minExperience: "",
      minRating: "",
    });

    onApply({});
  };

  const applyFilters = () => {
    const cleaned: Filters = {};

    if (filters.search.trim())
      cleaned.search = filters.search.trim();

    if (filters.specializations.length)
      cleaned.specializations = filters.specializations;

    if (filters.languages.length)
      cleaned.languages = filters.languages;

    if (filters.country.length)
      cleaned.country = filters.country;

    if (filters.availabilityStatus.length)
      cleaned.availabilityStatus = filters.availabilityStatus;

    if (filters.minExperience)
      cleaned.minExperience = Number(filters.minExperience);

    if (filters.minRating)
      cleaned.minRating = Number(filters.minRating);

    onApply(cleaned);
  };

  const hasFilters =
    filters.search ||
    filters.specializations.length ||
    filters.languages.length ||
    filters.country.length ||
    filters.availabilityStatus.length ||
    filters.minExperience ||
    filters.minRating;

  /* -------------------- UI -------------------- */
  return (
    <div className="bg-white rounded-2xl border shadow-md flex flex-col h-fit sticky top-6">
      {/* Header */}
      <div className="bg-green-600 px-5 py-4 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="text-white w-5 h-5" />
          <h2 className="text-white font-semibold text-lg">Filters</h2>
        </div>

        {hasFilters && (
          <button
            onClick={clearAll}
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
              onClick={() =>
                setFilters({ ...filters, search: "" })
              }
            />
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="p-4 space-y-4 max-h-[65vh] overflow-y-auto">
        <FilterSection
          title="Specializations"
          options={[
            "Weight Loss",
            "Diabetes",
            "Sports Nutrition",
            "PCOS",
            "Women’s Health",
            "General Diet",
          ]}
          selected={filters.specializations}
          onToggle={(v) => toggleArrayFilter("specializations", v)}
        />

        <FilterSection
          title="Languages"
          options={[
            "English",
            "Hindi",
            "Malayalam",
            "Tamil",
            "Kannada",
            "Telugu",
          ]}
          selected={filters.languages}
          onToggle={(v) => toggleArrayFilter("languages", v)}
        />

        <FilterSection
          title="Country"
          options={["India", "UAE", "USA", "UK", "Canada"]}
          selected={filters.country}
          onToggle={(v) => toggleArrayFilter("country", v)}
        />

        <FilterSection
          title="Availability"
          options={["available", "busy", "unavailable"]}
          selected={filters.availabilityStatus}
          onToggle={(v) =>
            toggleArrayFilter("availabilityStatus", v)
          }
        />

        {/* Experience */}
        <div>
          <h3 className="font-semibold text-gray-800">
            Minimum Experience (years)
          </h3>
          <input
            type="number"
            min={0}
            placeholder="e.g. 5"
            className="mt-2 w-full border rounded-xl px-3 py-2"
            value={filters.minExperience}
            onChange={(e) =>
              setFilters({
                ...filters,
                minExperience: e.target.value,
              })
            }
          />
        </div>

        {/* Rating */}
        <div>
          <h3 className="font-semibold text-gray-800">
            Minimum Rating
          </h3>
          <input
            type="number"
            step="0.5"
            max="5"
            min="0"
            placeholder="e.g. 4"
            className="mt-2 w-full border rounded-xl px-3 py-2"
            value={filters.minRating}
            onChange={(e) =>
              setFilters({
                ...filters,
                minRating: e.target.value,
              })
            }
          />
        </div>
      </div>

      {/* Apply Button */}
      <div className="p-4 border-t">
        <button
          onClick={applyFilters}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

/* -------------------- Filter Section -------------------- */
function FilterSection({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <div className="mt-2 flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 accent-green-600"
              checked={selected.includes(opt)}
              onChange={() => onToggle(opt)}
            />
            <span className="text-gray-700 capitalize">
              {opt}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
