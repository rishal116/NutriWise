"use client";

import { X, RotateCcw, Filter, Check, Star, CheckCircle2, Globe } from "lucide-react";
import { NutritionistFilterState } from "@/hooks/user/useNutritionistBrowsing";
import {
  CoachLevel,
  Language,
  LANGUAGES,
  NutritionistSortBy,
} from "@/types/nutritionist.types";
import { Gender } from "@/enums/user/user.enum";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: NutritionistFilterState;
  onFilterChange: (filters: NutritionistFilterState) => void;
  onClearFilters: () => void;
  activeCount: number;
}

const SORT_OPTIONS: { value: NutritionistSortBy; label: string }[] = [
  { value: "highest_rating", label: "Top Rated" },
  { value: "most_experienced", label: "Most Experienced" },
  { value: "most_reviewed", label: "Most Reviewed" },
  { value: "newest", label: "Newest" },
];

const RATING_OPTIONS = [
  { value: undefined, label: "Any Rating" },
  { value: 3, label: "3.0+ Stars" },
  { value: 4, label: "4.0+ Stars" },
  { value: 4.5, label: "4.5+ Stars" },
];

const COACH_LEVEL_OPTIONS: { value: CoachLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "verified", label: "Verified" },
  { value: "expert", label: "Expert" },
  { value: "top_coach", label: "Top Coach" },
];

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: Gender.MALE, label: "Male" },
  { value: Gender.FEMALE, label: "Female" },
  { value: Gender.OTHER, label: "Other" },
];

export default function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
  activeCount,
}: FilterDrawerProps) {
  if (!isOpen) return null;

  const toggleLanguage = (lang: Language) => {
    const current = filters.languages || [];
    const updated = current.includes(lang)
      ? current.filter((l) => l !== lang)
      : [...current, lang];
    onFilterChange({
      ...filters,
      languages: updated.length > 0 ? updated : undefined,
    });
  };

  const setCoachLevel = (level?: CoachLevel) => {
    onFilterChange({
      ...filters,
      coachLevel: filters.coachLevel === level ? undefined : level,
    });
  };

  const setGender = (g?: Gender) => {
    onFilterChange({
      ...filters,
      gender: filters.gender === g ? undefined : g,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close filter drawer backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over Drawer Panel */}
      <aside className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col z-50 border-l border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Filter size={16} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Filter Coaches
                {activeCount > 0 && (
                  <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-full text-[11px] font-semibold">
                    {activeCount}
                  </span>
                )}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <button
                type="button"
                onClick={onClearFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors px-2.5 py-1 hover:bg-rose-50 rounded-lg"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors hover:bg-slate-100"
              aria-label="Close drawer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Filter Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
          {/* Languages Filter (Multi-select) */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe size={13} className="text-slate-500" />
              Languages Spoken
            </label>
            <div className="flex flex-wrap gap-1.5">
              {LANGUAGES.map((lang) => {
                const isSelected = (filters.languages || []).includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                      isSelected
                        ? "bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold flex items-center gap-1"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected && <Check size={12} className="text-emerald-700" />}
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Sort By
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SORT_OPTIONS.map((opt) => {
                const isSelected = filters.sortBy === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      onFilterChange({
                        ...filters,
                        sortBy: isSelected ? undefined : opt.value,
                      })
                    }
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all ${
                      isSelected
                        ? "bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold"
                        : "bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coach Level */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Coach Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COACH_LEVEL_OPTIONS.map((opt) => {
                const isSelected = filters.coachLevel === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCoachLevel(opt.value)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all ${
                      isSelected
                        ? "bg-sky-50 text-sky-900 border-sky-300 font-semibold"
                        : "bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Minimum Rating
            </label>
            <div className="grid grid-cols-2 gap-2">
              {RATING_OPTIONS.map((opt) => {
                const isSelected = filters.minRating === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() =>
                      onFilterChange({
                        ...filters,
                        minRating: isSelected ? undefined : opt.value,
                      })
                    }
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-amber-50 text-amber-900 border-amber-300 font-semibold"
                        : "bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {opt.value && (
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Gender
            </label>
            <div className="grid grid-cols-3 gap-2">
              {GENDER_OPTIONS.map((opt) => {
                const isSelected = filters.gender === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setGender(opt.value)}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? "bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold"
                        : "bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 cursor-pointer select-none">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                Available Coaches Only
              </span>
              <input
                type="checkbox"
                checked={filters.availableOnly || false}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    availableOnly: e.target.checked ? true : undefined,
                  })
                }
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center gap-2">
          <button
            type="button"
            onClick={onClearFilters}
            className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors text-center"
          >
            Clear Filters
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-2/3 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs text-center"
          >
            Apply Filters
          </button>
        </div>
      </aside>
    </div>
  );
}
