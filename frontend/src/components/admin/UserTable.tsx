"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  ArrowUpDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { adminUserService } from "@/services/admin/adminUser.service";
import { useDebounce } from "@/hooks/admin/debounce.hooks";
import UserSearchBar from "./UserSearchBar";
import { AdminUserListItemDto } from "@/dtos/admin/user/admin-user-list-item.dto";
import { InfiniteScrollResponseDto } from "@/dtos/common/infinite-scroll-response.dto";
import { UserRole } from "@/enums/user/user.enum";

interface UserTableProps {
  initialData: InfiniteScrollResponseDto<AdminUserListItemDto>;
  limit: number;
}

type SortBy = "createdAt" | "fullName" | "email";
type SortOrder = "asc" | "desc";
type StatusFilter = "all" | "active" | "blocked";

const ROLE_STYLES: Record<UserRole, string> = {
  [UserRole.ADMIN]: "bg-violet-50 text-violet-600",
  [UserRole.NUTRITIONIST]: "bg-emerald-50 text-emerald-600",
  [UserRole.USER]: "bg-slate-100 text-slate-600",
};

function getInitials(fullName: string) {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-tight ${ROLE_STYLES[role]}`}
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

function SortableHeader({
  label,
  field,
  activeSortBy,
  sortOrder,
  onSort,
  className,
}: {
  label: string;
  field: SortBy;
  activeSortBy: SortBy;
  sortOrder: SortOrder;
  onSort: (field: SortBy) => void;
  className?: string;
}) {
  const isActive = activeSortBy === field;

  return (
    <th className={className}>
      <button
        onClick={() => onSort(field)}
        className={`flex items-center gap-1 font-semibold hover:text-slate-700 transition-colors ${
          isActive ? "text-slate-900" : ""
        }`}
      >
        {label}
        {isActive ? (
          sortOrder === "asc" ? (
            <ArrowUp size={13} />
          ) : (
            <ArrowDown size={13} />
          )
        ) : (
          <ArrowUpDown size={13} className="text-slate-300" />
        )}
      </button>
    </th>
  );
}

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
];

function StatusFilterTabs({
  value,
  onChange,
}: {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}) {
  return (
    <div className="inline-flex items-center bg-slate-100 rounded-lg p-1 gap-1">
      {STATUS_FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
            value === f.value
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

export default function UserTable({ initialData, limit }: UserTableProps) {
  const router = useRouter();

  const [users, setUsers] = useState(initialData.data);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [confirmUser, setConfirmUser] = useState<AdminUserListItemDto | null>(
    null,
  );

  const resettingRef = useRef(false);
  const [isResetting, setIsResetting] = useState(false);
  const skipRef = useRef(initialData.skip + initialData.data.length);
  const hasMoreRef = useRef(initialData.hasMore);
  const fetchingMoreRef = useRef(false);
  const isFirstRun = useRef(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Params refs — kept in sync so the IntersectionObserver's fetchPage call
  // (fired from a stale closure otherwise) always reads current filters.
  const searchRef = useRef("");
  const sortByRef = useRef<SortBy>("createdAt");
  const sortOrderRef = useRef<SortOrder>("desc");
  const statusFilterRef = useRef<StatusFilter>("all");

  const toIsBlocked = (status: StatusFilter): boolean | undefined => {
    if (status === "active") return false;
    if (status === "blocked") return true;
    return undefined;
  };

  const fetchPage = useCallback(
    async (skip: number, replace: boolean) => {
      console.log("FETCH", {
        skip,
        replace,
      });

      const res = await adminUserService.getUsers({
        skip,
        limit,
        search: searchRef.current || undefined,
        sortBy: sortByRef.current,
        sortOrder: sortOrderRef.current,
        isBlocked: toIsBlocked(statusFilterRef.current),
      });

      console.log(
        "Returned ids",
        res.data.map((u) => u.id),
      );

      setUsers((prev) => {
        console.log(
          "Previous",
          prev.map((u) => u.id),
        );

        return replace ? res.data : [...prev, ...res.data];
      });

      skipRef.current = skip + res.data.length;
      hasMoreRef.current = res.hasMore;
    },
    [limit],
  );

  useEffect(() => {
    console.log(users.map((u) => u.id));
  }, [users]);

  useEffect(() => {
    setUsers(initialData.data);
    skipRef.current = initialData.skip + initialData.data.length;
    hasMoreRef.current = initialData.hasMore;
  }, [initialData]);

  // Single reset path shared by search, sort, and status filter changes.
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;

      searchRef.current = debouncedSearch;
      sortByRef.current = sortBy;
      sortOrderRef.current = sortOrder;
      statusFilterRef.current = statusFilter;

      return;
    }

    searchRef.current = debouncedSearch;
    sortByRef.current = sortBy;
    sortOrderRef.current = sortOrder;
    statusFilterRef.current = statusFilter;

    skipRef.current = 0;
    hasMoreRef.current = true;

    resettingRef.current = true;
    setIsResetting(true);

    fetchPage(0, true)
      .catch(() => toast.error("Failed to load users"))
      .finally(() => {
        resettingRef.current = false;
        setIsResetting(false);
      });
  }, [debouncedSearch, sortBy, sortOrder, statusFilter, fetchPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        if (resettingRef.current) return;

        if (fetchingMoreRef.current) return;

        if (!hasMoreRef.current) return;

        fetchingMoreRef.current = true;
        setIsLoadingMore(true);

        fetchPage(skipRef.current, false)
          .catch(() => toast.error("Failed to load more users"))
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

    return () => observer.disconnect();
  }, [fetchPage]);

  useEffect(() => {
    if (!activeUserId) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveUserId(null);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [activeUserId]);

  const handleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const toggleBlock = async (user: AdminUserListItemDto) => {
    setIsToggling(true);
    try {
      await adminUserService.updateBlockStatus(user.id, !user.isBlocked);

      // If a status filter is active, an optimistic flip would leave a user
      // sitting in a list they no longer belong to (e.g. blocking someone
      // while viewing "Active"). Refetch instead of patching in place.
      if (statusFilter !== "all") {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
      } else {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, isBlocked: !u.isBlocked } : u,
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

  return (
    <div className="bg-white">
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <StatusFilterTabs value={statusFilter} onChange={setStatusFilter} />
        <UserSearchBar value={search} onChange={setSearch} />
      </div>

      <div className="overflow-x-auto relative">
        {isResetting && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-start justify-center pt-16">
            <Loader2 size={20} className="animate-spin text-slate-400" />
          </div>
        )}

        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
            <tr>
              <SortableHeader
                label="User"
                field="fullName"
                activeSortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="px-6 py-4"
              />
              <th className="px-6 py-4 font-semibold hidden sm:table-cell">
                Role
              </th>
              <th className="px-6 py-4 font-semibold hidden md:table-cell">
                Profile
              </th>
              <SortableHeader
                label="Joined"
                field="createdAt"
                activeSortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="px-6 py-4 hidden lg:table-cell"
              />
              <th className="px-6 py-4 font-semibold text-center">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {u.profileImage ? (
                        <Image
                          src={u.profileImage}
                          alt={u.fullName}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                          {getInitials(u.fullName)}
                        </div>
                      )}

                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 uppercase text-[13px] truncate">
                          {u.fullName}
                        </span>
                        <span className="text-xs text-slate-500 truncate">
                          @{u.username} · {u.email}
                        </span>

                        <div className="flex items-center gap-2 mt-1.5 sm:hidden">
                          <RoleBadge role={u.activeRole} />
                          <ProfileStatus completed={u.isProfileCompleted} />
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 hidden sm:table-cell">
                    <RoleBadge role={u.activeRole} />
                  </td>

                  <td className="px-6 py-4 hidden md:table-cell">
                    <ProfileStatus completed={u.isProfileCompleted} />
                  </td>

                  <td className="px-6 py-4 hidden lg:table-cell text-slate-500 font-medium">
                    {formatDate(u.createdAt)}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        u.isBlocked
                          ? "bg-red-50 text-red-600"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          u.isBlocked ? "bg-red-600" : "bg-emerald-600"
                        }`}
                      />
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right relative">
                    <button
                      onClick={() =>
                        setActiveUserId(activeUserId === u.id ? null : u.id)
                      }
                      className="p-1.5 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all"
                    >
                      <MoreHorizontal size={18} className="text-slate-400" />
                    </button>

                    {activeUserId === u.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-6 mt-2 w-44 bg-white border border-slate-200 shadow-xl rounded-xl z-20 p-1 animate-in fade-in slide-in-from-top-1"
                      >
                        <button
                          onClick={() => router.push(`/admin/users/${u.id}`)}
                          className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                        >
                          <ExternalLink size={14} /> View Profile
                        </button>
                        <button
                          onClick={() => {
                            setConfirmUser(u);
                            setActiveUserId(null);
                          }}
                          className={`w-full px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 mt-1 ${
                            u.isBlocked
                              ? "text-emerald-600 hover:bg-emerald-50"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                        >
                          {u.isBlocked ? (
                            <>
                              <Unlock size={14} /> Unblock
                            </>
                          ) : (
                            <>
                              <Lock size={14} /> Block
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

      <div ref={sentinelRef} className="h-10 flex items-center justify-center">
        {isLoadingMore && (
          <Loader2 size={18} className="animate-spin text-slate-400" />
        )}
      </div>

      {confirmUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-slate-100 animate-in zoom-in-95 duration-200">
            <h2 className="text-lg font-bold text-slate-900">Confirm Action</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Are you sure you want to{" "}
              {confirmUser.isBlocked ? "unblock" : "block"}{" "}
              <span className="text-slate-900 font-bold italic">
                {confirmUser.fullName}
              </span>
              ?
            </p>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setConfirmUser(null)}
                disabled={isToggling}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await toggleBlock(confirmUser);
                  setConfirmUser(null);
                }}
                disabled={isToggling}
                className={`flex-1 px-4 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg transition-all disabled:opacity-50 ${
                  confirmUser.isBlocked
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                    : "bg-red-600 hover:bg-red-700 shadow-red-200"
                }`}
              >
                Yes, {confirmUser.isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
