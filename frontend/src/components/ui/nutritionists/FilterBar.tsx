
"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

type Gender = "Male" | "Female" | "";

interface FilterState {
  search: string;
  gender: Gender;
  rating: number;
}

interface FilterBarProps {
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
}

export default function FilterBar({
  filters,
  setFilters,
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (value: string): void => {
    setFilters((previous) => ({
      ...previous,
      search: value,
    }));
  };

  const handleGenderChange = (gender: Gender): void => {
    setFilters((previous) => ({
      ...previous,
      gender: previous.gender === gender ? "" : gender,
    }));
  };

  const handleRatingChange = (rating: number): void => {
    setFilters((previous) => ({
      ...previous,
      rating,
    }));
  };

  const resetFilters = (): void => {
    setFilters({
      search: filters.search,
      gender: "",
      rating: 1,
    });
  };

  return (
    <div className="flex items-center gap-4">
      {/* SEARCH */}
      <div className="relative group">
        <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 w-80">
          <Search size={18} className="text-gray-400 shrink-0" />

          <input
            type="text"
            className="bg-transparent outline-none text-sm w-full text-black ml-2"
            placeholder="Search coach..."
            value={filters.search}
            onChange={(event) => handleSearchChange(event.target.value)}
          />

          <button
            type="button"
            className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold ml-2"
          >
            Search
          </button>
        </div>
      </div>

      {/* FILTER BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 hover:text-gray-600 text-black"
      >
        <span>Filters</span>
        <SlidersHorizontal size={18} />
      </button>

      {/* FILTER MODAL */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-title"
            className="bg-white w-full max-w-md p-6 rounded-3xl border border-gray-300 relative shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            {/* HEADER */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close filters"
              className="absolute right-6 top-6 text-gray-600 hover:text-black"
            >
              <X size={24} />
            </button>

            <h2
              id="filter-title"
              className="text-xl font-bold mb-6 text-black"
            >
              Filter Options
            </h2>

            {/* GENDER */}
            <div className="mb-6">
              <p className="text-gray-500 mb-2 text-sm">Gender</p>

              <div className="flex gap-2">
                {(["Male", "Female"] as const).map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => handleGenderChange(gender)}
                    aria-pressed={filters.gender === gender}
                    className={`px-4 py-2 rounded-xl border text-sm transition-colors ${
                      filters.gender === gender
                        ? "bg-black text-white border-black"
                        : "bg-gray-100 text-black border-gray-300 hover:border-black"
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            {/* MINIMUM RATING */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-500 text-sm">
                    Minimum Rating
                  </p>

                  <span className="text-sm font-semibold text-black">
                    {filters.rating.toFixed(1)}+
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={filters.rating}
                  onChange={(event) =>
                    handleRatingChange(Number(event.target.value))
                  }
                  className="w-full accent-black"
                />

                <div className="flex justify-between text-xs text-gray-400">
                  <span>1 Star</span>
                  <span>5 Stars</span>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 border border-gray-300 text-black py-3 rounded-2xl font-semibold hover:bg-gray-100"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-black text-white py-3 rounded-2xl font-bold hover:bg-gray-800"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
