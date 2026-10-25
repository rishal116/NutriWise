
"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";

import type { AdminUserListItemDto } from "@/dtos/admin/user/admin-user-list-item.dto";
import { useDebounce } from "@/hooks/admin/debounce.hooks";
import { useInfiniteScroll } from "@/hooks/admin/infiniteScroll.hooks";
import { useAdminUsers } from "@/hooks/admin/useAdminUsers.hooks";

import ConfirmBlockDialog from "./ConfirmBlockDialog";
import UserRow from "./UserRow";
import UserSearchBar from "../UserSearchBar";
import UserStatusTabs from "./UserStatusTabs";
import type { SortBy, StatusFilter } from "./user-table.types";

export default function UserTable() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [confirmUser, setConfirmUser] =
    useState<AdminUserListItemDto | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const {
    users,
    hasMore,
    isLoading,
    isRefreshing,
    isLoadingMore,
    isToggling,
    loadMore,
    toggleBlock,
  } = useAdminUsers({ search: debouncedSearch, status, sortBy });

  const sentinelRef = useInfiniteScroll(loadMore, hasMore);

  const hasActiveFilters =
    Boolean(search.trim()) || status !== "all" || sortBy !== "newest";

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setSortBy("newest");
  };

  const handleConfirm = async () => {
    if (confirmUser && (await toggleBlock(confirmUser))) {
      setConfirmUser(null);
    }
  };

  const SortIcon = sortBy === "newest" ? ArrowDown : ArrowUp;

  return (
    <div className="bg-white">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <UserStatusTabs value={status} onChange={setStatus} />

        <div className="flex items-center gap-3">
          <UserSearchBar value={search} onChange={setSearch} />

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="shrink-0 text-xs font-semibold text-teal-700 transition hover:text-teal-800"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto">
        {isRefreshing && (
          <div className="absolute inset-0 z-10 flex items-start justify-center bg-white/70 pt-16 backdrop-blur-[1px]">
            <Loader2
              size={20}
              className="animate-spin text-slate-400"
              aria-label="Refreshing users"
            />
          </div>
        )}

        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/50 font-medium text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">
                User
              </th>

              <th
                scope="col"
                className="hidden px-6 py-4 font-semibold sm:table-cell"
              >
                Role
              </th>

              <th
                scope="col"
                className="hidden px-6 py-4 font-semibold lg:table-cell"
              >
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
                  <SortIcon size={13} aria-hidden="true" />
                </button>
              </th>

              <th
                scope="col"
                className="px-6 py-4 text-center font-semibold"
              >
                Status
              </th>

              <th
                scope="col"
                className="px-6 py-4 text-right font-semibold"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-14 text-center text-slate-400"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Loading users...
                    </span>
                  ) : (
                    "No users found"
                  )}
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onRequestToggleBlock={setConfirmUser}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Infinite scroll sentinel */}
      <div
        ref={sentinelRef}
        className="flex h-16 items-center justify-center"
        aria-live="polite"
      >
        {isLoadingMore && (
          <Loader2
            size={18}
            className="animate-spin text-slate-400"
            aria-label="Loading more users"
          />
        )}

        {!isLoading &&
          !isLoadingMore &&
          !hasMore &&
          users.length > 0 && (
            <span className="text-xs font-medium text-slate-400">
              No more users
            </span>
          )}
      </div>

      {confirmUser && (
        <ConfirmBlockDialog
          user={confirmUser}
          isLoading={isToggling}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmUser(null)}
        />
      )}
    </div>
  );
}
