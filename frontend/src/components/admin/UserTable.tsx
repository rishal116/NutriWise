"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Lock,
  Unlock,
  ExternalLink,
  Loader2,
  CheckCircle2,
  Circle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { toast } from "sonner";

import { adminUserService } from "@/services/admin/adminUser.service";

import { useDebounce } from "@/hooks/admin/debounce.hooks";

import UserSearchBar from "./UserSearchBar";

import { AdminUserListItemDto } from "@/dtos/admin/user/admin-user-list-item.dto";

import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import { UserRole } from "@/enums/user/user.enum";

interface UserTableProps {
  initialData: InfiniteScrollResponseDTO<AdminUserListItemDto>;
}

type SortBy = "newest" | "oldest";

type StatusFilter = "all" | "active" | "blocked";

const ROLE_STYLES: Record<UserRole, string> = {
  [UserRole.ADMIN]: "bg-violet-50 text-violet-600",
  [UserRole.NUTRITIONIST]: "bg-emerald-50 text-emerald-600",
  [UserRole.USER]: "bg-slate-100 text-slate-600",
};

const STATUS_FILTERS: {
  value: StatusFilter;
  label: string;
}[] = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "blocked",
    label: "Blocked",
  },
];

function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(value: string | Date): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={`rounded-md px-2 py-1 text-xs font-bold uppercase tracking-tight ${
        ROLE_STYLES[role]
      }`}
    >
      {role}
    </span>
  );
}

function ProfileStatus({ completed }: { completed: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold ${
        completed ? "text-emerald-600" : "text-slate-400"
      }`}
    >
      {completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}

      {completed ? "Complete" : "Incomplete"}
    </span>
  );
}

function StatusFilterTabs({
  value,
  onChange,
}: {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1">
      {STATUS_FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => onChange(filter.value)}
          className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
            value === filter.value
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

function SortHeader({
  sortBy,
  onSort,
}: {
  sortBy: SortBy;
  onSort: () => void;
}) {
  return (
    <th className="hidden px-6 py-4 text-left lg:table-cell">
      <button
        type="button"
        onClick={onSort}
        className="flex items-center gap-1 font-semibold text-slate-600 transition-colors hover:text-slate-900"
      >
        Joined
        {sortBy === "newest" ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
      </button>
    </th>
  );
}

export default function UserTable({ initialData }: UserTableProps) {
  const router = useRouter();

  const [users, setUsers] = useState<AdminUserListItemDto[]>(initialData.items);

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const [sortBy, setSortBy] = useState<SortBy>("newest");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [nextCursor, setNextCursor] = useState<string | null>(
    initialData.nextCursor,
  );

  const [hasMore, setHasMore] = useState(initialData.hasMore);

  const [isLoading, setIsLoading] = useState(false);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [isToggling, setIsToggling] = useState(false);

  const [isResetting, setIsResetting] = useState(false);

  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  const [confirmUser, setConfirmUser] = useState<AdminUserListItemDto | null>(
    null,
  );

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const fetchingMoreRef = useRef(false);

  const resetRef = useRef(false);

  const searchRef = useRef("");

  const sortByRef = useRef<SortBy>("newest");

  const statusFilterRef = useRef<StatusFilter>("all");

  const getIsBlocked = (status: StatusFilter): boolean | undefined => {
    if (status === "active") {
      return false;
    }

    if (status === "blocked") {
      return true;
    }

    return undefined;
  };

  const fetchUsers = useCallback(async (cursor?: string) => {
    const response = await adminUserService.getUsers({
      search: searchRef.current || undefined,

      isBlocked: getIsBlocked(statusFilterRef.current),

      sortBy: sortByRef.current,

      cursor,

      limit: 10,
    });

    const data = response.data;

    if (cursor) {
      setUsers((prev) => [...prev, ...data.items]);
    } else {
      setUsers(data.items);
    }

    setNextCursor(data.nextCursor);
    setHasMore(data.hasMore);
  }, []);

  useEffect(() => {
    if (
      debouncedSearch === "" &&
      sortBy === "newest" &&
      statusFilter === "all"
    ) {
      return;
    }

    searchRef.current = debouncedSearch;
    sortByRef.current = sortBy;
    statusFilterRef.current = statusFilter;

    resetRef.current = true;
    setIsResetting(true);

    fetchUsers()
      .catch(() => {
        toast.error("Failed to load users.");
      })
      .finally(() => {
        resetRef.current = false;
        setIsResetting(false);
      });
  }, [debouncedSearch, sortBy, statusFilter, fetchUsers]);

  useEffect(() => {
    searchRef.current = debouncedSearch;
    sortByRef.current = sortBy;
    statusFilterRef.current = statusFilter;
  }, [debouncedSearch, sortBy, statusFilter]);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        if (resetRef.current) {
          return;
        }

        if (fetchingMoreRef.current) {
          return;
        }

        if (!hasMore) {
          return;
        }

        if (!nextCursor) {
          return;
        }

        fetchingMoreRef.current = true;
        setIsLoadingMore(true);

        fetchUsers(nextCursor)
          .catch(() => {
            toast.error("Failed to load more users.");
          })
          .finally(() => {
            fetchingMoreRef.current = false;
            setIsLoadingMore(false);
          });
      },
      {
        rootMargin: "200px",
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [fetchUsers, hasMore, nextCursor]);

  useEffect(() => {
    if (!activeUserId) {
      return;
    }

    const handleMouseDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveUserId(null);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [activeUserId]);

  useEffect(() => {
    setUsers(initialData.items);
    setNextCursor(initialData.nextCursor);
    setHasMore(initialData.hasMore);
  }, [initialData]);

  const handleSort = () => {
    setSortBy((prev) => (prev === "newest" ? "oldest" : "newest"));
  };

  const handleStatusChange = (value: StatusFilter) => {
    setStatusFilter(value);
  };

  const toggleBlock = async (user: AdminUserListItemDto) => {
    setIsToggling(true);

    try {
      await adminUserService.updateBlockStatus(user.id, !user.isBlocked);

      if (statusFilter !== "all") {
        setUsers((prev) => prev.filter((item) => item.id !== user.id));
      } else {
        setUsers((prev) =>
          prev.map((item) =>
            item.id === user.id
              ? {
                  ...item,
                  isBlocked: !item.isBlocked,
                }
              : item,
          ),
        );
      }

      toast.success(user.isBlocked ? "User unblocked" : "User blocked");
    } catch {
      toast.error("Action failed");
    } finally {
      setIsToggling(false);
    }
  };

  const hasActiveFilters =
    Boolean(search.trim()) || statusFilter !== "all" || sortBy !== "newest";

  const handleClearFilters = () => {
    setSearch("");
    setSortBy("newest");
    setStatusFilter("all");
  };

  return (
    <div className="bg-white">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <StatusFilterTabs value={statusFilter} onChange={handleStatusChange} />

        <div className="flex items-center gap-3">
          <UserSearchBar value={search} onChange={setSearch} />

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="shrink-0 text-xs font-semibold text-teal-700 transition hover:text-teal-800"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto">
        {isResetting && (
          <div className="absolute inset-0 z-10 flex items-start justify-center bg-white/70 pt-16 backdrop-blur-[1px]">
            <Loader2 size={20} className="animate-spin text-slate-400" />
          </div>
        )}

        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/50 font-medium text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">User</th>

              <th className="hidden px-6 py-4 font-semibold sm:table-cell">
                Role
              </th>

              <th className="hidden px-6 py-4 font-semibold md:table-cell">
                Profile
              </th>

              <SortHeader sortBy={sortBy} onSort={handleSort} />

              <th className="px-6 py-4 text-center font-semibold">Status</th>

              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-14 text-center text-slate-400">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="group transition-colors hover:bg-slate-50/50"
                >
                  {/* User */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.profileImage ? (
                        <Image
                          src={user.profileImage}
                          alt={user.fullName}
                          width={40}
                          height={40}
                          className="h-10 w-10 shrink-0 rounded-full border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-emerald-50 text-xs font-bold text-emerald-600">
                          {getInitials(user.fullName)}
                        </div>
                      )}

                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-[13px] font-bold text-slate-900">
                          {user.fullName}
                        </span>

                        <span className="truncate text-xs text-slate-500">
                          @{user.username} · {user.email}
                        </span>

                        <div className="mt-1.5 flex items-center gap-2 sm:hidden">
                          <RoleBadge role={user.activeRole} />

                          <ProfileStatus completed={user.isProfileCompleted} />
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="hidden px-6 py-4 sm:table-cell">
                    <RoleBadge role={user.activeRole} />
                  </td>

                  {/* Profile */}
                  <td className="hidden px-6 py-4 md:table-cell">
                    <ProfileStatus completed={user.isProfileCompleted} />
                  </td>

                  {/* Joined */}
                  <td className="hidden px-6 py-4 font-medium text-slate-500 lg:table-cell">
                    {formatDate(user.createdAt)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                        user.isBlocked
                          ? "bg-red-50 text-red-600"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      <span
                        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                          user.isBlocked ? "bg-red-600" : "bg-emerald-600"
                        }`}
                      />

                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="relative px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveUserId(
                          activeUserId === user.id ? null : user.id,
                        )
                      }
                      className="rounded-lg border border-transparent p-1.5 transition-all hover:border-slate-200 hover:bg-white"
                      aria-label={`Actions for ${user.fullName}`}
                    >
                      <MoreHorizontal size={18} className="text-slate-400" />
                    </button>

                    {activeUserId === user.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-6 top-12 z-20 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-xl"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setActiveUserId(null);

                            router.push(`/admin/users/${user.id}`);
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <ExternalLink size={14} />
                          View Profile
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setConfirmUser(user);

                            setActiveUserId(null);
                          }}
                          className={`mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                            user.isBlocked
                              ? "text-emerald-600 hover:bg-emerald-50"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                        >
                          {user.isBlocked ? (
                            <>
                              <Unlock size={14} />
                              Unblock
                            </>
                          ) : (
                            <>
                              <Lock size={14} />
                              Block
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Infinite Scroll Sentinel */}
      <div ref={sentinelRef} className="flex h-16 items-center justify-center">
        {isLoadingMore && (
          <Loader2 size={18} className="animate-spin text-slate-400" />
        )}

        {!isLoadingMore && !hasMore && users.length > 0 && (
          <span className="text-xs font-medium text-slate-400">
            No more users
          </span>
        )}
      </div>

      {/* Confirm Dialog */}
      {confirmUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900">Confirm Action</h2>

            <p className="mt-2 text-sm font-medium text-slate-500">
              Are you sure you want to{" "}
              {confirmUser.isBlocked ? "unblock" : "block"}{" "}
              <span className="font-bold italic text-slate-900">
                {confirmUser.fullName}
              </span>
              ?
            </p>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmUser(null)}
                disabled={isToggling}
                className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-500 transition hover:bg-slate-200 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={async () => {
                  await toggleBlock(confirmUser);

                  setConfirmUser(null);
                }}
                disabled={isToggling}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-lg transition disabled:opacity-50 ${
                  confirmUser.isBlocked
                    ? "bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700"
                    : "bg-red-600 shadow-red-200 hover:bg-red-700"
                }`}
              >
                {isToggling
                  ? "Please wait..."
                  : `Yes, ${confirmUser.isBlocked ? "Unblock" : "Block"}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
