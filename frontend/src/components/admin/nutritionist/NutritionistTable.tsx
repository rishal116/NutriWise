"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";

import type { AdminNutritionistListItemDto } from "@/dtos/admin/nutritionist/admin-nutritionist-list-item.dto";
import { useDebounce } from "@/hooks/admin/debounce.hooks";
import { useInfiniteScroll } from "@/hooks/admin/infiniteScroll.hooks";
import { useAdminNutritionists } from "@/hooks/admin/useAdminNutritionists.hooks";

import ConfirmBlockDialog from "../user/ConfirmBlockDialog";
import type { SortBy, StatusFilter } from "../user/user-table.types";

import NutritionistRow from "./NutritionistRow";
import NutritionistToolbar from "./NutritionistToolbar";
import type { CoachLevelFilter } from "./nutritionist-table.types";

export default function NutritionistTable() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [coachLevel, setCoachLevel] = useState<CoachLevelFilter>("all");
  const [confirmTarget, setConfirmTarget] =
    useState<AdminNutritionistListItemDto | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const {
    nutritionists,
    hasMore,
    isLoading,
    isRefreshing,
    isLoadingMore,
    isToggling,
    loadMore,
    toggleBlock,
  } = useAdminNutritionists({
    search: debouncedSearch,
    coachLevel,
    status,
    sortBy,
  });

  const sentinelRef = useInfiniteScroll(loadMore, hasMore);

  const hasActiveFilters =
    Boolean(search.trim()) ||
    status !== "all" ||
    coachLevel !== "all" ||
    sortBy !== "newest";

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setCoachLevel("all");
    setSortBy("newest");
  };

  const handleConfirm = async () => {
    if (confirmTarget && (await toggleBlock(confirmTarget))) {
      setConfirmTarget(null);
    }
  };

  const SortIcon = sortBy === "newest" ? ArrowDown : ArrowUp;

  return (
    <div className="bg-white">
      <NutritionistToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        coachLevel={coachLevel}
        onCoachLevelChange={setCoachLevel}
        hasActiveFilters={hasActiveFilters}
        onClear={clearFilters}
      />

      <div className="relative overflow-x-auto">
        {isRefreshing && (
          <div className="absolute inset-0 z-10 flex items-start justify-center bg-white/70 pt-16 backdrop-blur-[1px]">
            <Loader2
              size={20}
              className="animate-spin text-slate-400"
              aria-label="Refreshing nutritionists"
            />
          </div>
        )}

        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/50 font-medium text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Nutritionist</th>
              <th className="hidden px-6 py-4 font-semibold sm:table-cell">
                Level
              </th>
              <th className="hidden px-6 py-4 font-semibold md:table-cell">
                Rating
              </th>
              <th className="hidden px-6 py-4 lg:table-cell">
                <button
                  type="button"
                  onClick={() =>
                    setSortBy((prev) =>
                      prev === "newest" ? "oldest" : "newest",
                    )
                  }
                  aria-label={`Sort by join date, currently ${sortBy}`}
                  className="flex items-center gap-1 font-semibold text-slate-600 transition-colors hover:text-slate-900"
                >
                  Joined
                  <SortIcon size={13} />
                </button>
              </th>
              <th className="px-6 py-4 text-center font-semibold">Status</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {nutritionists.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-14 text-center text-slate-400">
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Loading nutritionists...
                    </span>
                  ) : (
                    "No nutritionists found"
                  )}
                </td>
              </tr>
            ) : (
              nutritionists.map((nutritionist) => (
                <NutritionistRow
                  key={nutritionist.id}
                  nutritionist={nutritionist}
                  onRequestToggleBlock={setConfirmTarget}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div
        ref={sentinelRef}
        className="flex h-16 items-center justify-center"
        aria-live="polite"
      >
        {isLoadingMore && (
          <Loader2
            size={18}
            className="animate-spin text-slate-400"
            aria-label="Loading more nutritionists"
          />
        )}
        {!isLoading &&
          !isLoadingMore &&
          !hasMore &&
          nutritionists.length > 0 && (
            <span className="text-xs font-medium text-slate-400">
              No more nutritionists
            </span>
          )}
      </div>

      {confirmTarget && (
        <ConfirmBlockDialog
          user={confirmTarget}
          isLoading={isToggling}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </div>
  );
}
