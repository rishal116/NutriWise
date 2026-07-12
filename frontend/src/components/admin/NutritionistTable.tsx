"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MoreHorizontal,
  Lock,
  Unlock,
  ExternalLink,
  Loader2,
  Star,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { adminNutritionistService } from "@/services/admin/adminNutri.service";
import { adminUserService } from "@/services/admin/adminUser.service";
import { useDebounce } from "@/hooks/admin/debounce.hooks";
import UserSearchBar from "./UserSearchBar";
import { AdminNutritionistListItemDto } from "@/dtos/admin/nutritionist/admin-nutritionist-list-item.dto";
import { InfiniteScrollResponseDto } from "@/dtos/common/infinite-scroll-response.dto";
import { AvailabilityStatus, CoachLevel } from "@/types/nutritionist.types";

interface NutritionistTableProps {
  initialData: InfiniteScrollResponseDto<AdminNutritionistListItemDto>;
  limit: number;
}

type SortBy =
  | "createdAt"
  | "fullName"
  | "rating"
  | "coachLevel"
  | "totalExperienceYears";
type SortOrder = "asc" | "desc";
type AccountStatusFilter = "all" | "active" | "blocked";
type CoachLevelFilter = "all" | CoachLevel;
type AvailabilityFilter = "all" | AvailabilityStatus;

const COACH_LEVEL_STYLES: Record<CoachLevel, string> = {
  beginner: "bg-slate-100 text-slate-600",
  verified: "bg-sky-50 text-sky-600",
  expert: "bg-violet-50 text-violet-600",
  top_coach: "bg-amber-50 text-amber-600",
};

const COACH_LEVEL_LABELS: Record<CoachLevel, string> = {
  beginner: "Beginner",
  verified: "Verified",
  expert: "Expert",
  top_coach: "Top Coach",
};

const AVAILABILITY_STYLES: Record<
  AvailabilityStatus,
  { dot: string; text: string }
> = {
  available: { dot: "bg-emerald-600", text: "text-emerald-600" },
  busy: { dot: "bg-amber-500", text: "text-amber-600" },
  offline: { dot: "bg-slate-400", text: "text-slate-500" },
};

const AVAILABILITY_LABELS: Record<AvailabilityStatus, string> = {
  available: "Available",
  busy: "Busy",
  offline: "Offline",
};

function getInitials(fullName: string) {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function CoachLevelBadge({ level }: { level: CoachLevel }) {
  return (
    <span
      className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-tight ${COACH_LEVEL_STYLES[level]}`}
    >
      {COACH_LEVEL_LABELS[level]}
    </span>
  );
}

function AvailabilityBadge({ status }: { status: AvailabilityStatus }) {
  const s = AVAILABILITY_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${s.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {AVAILABILITY_LABELS[status]}
    </span>
  );
}

function RatingDisplay({
  rating,
  totalReviews,
}: {
  rating: number;
  totalReviews: number;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700">
      <Star size={13} className="text-amber-400 fill-amber-400" />
      {rating.toFixed(1)}
      <span className="text-slate-400 font-medium">({totalReviews})</span>
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

function FilterSelect<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export default function NutritionistTable({
  initialData,
  limit,
}: NutritionistTableProps) {
  const router = useRouter();

  const [nutritionists, setNutritionists] = useState(initialData.data);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [coachLevel, setCoachLevel] = useState<CoachLevelFilter>("all");
  const [availabilityStatus, setAvailabilityStatus] =
    useState<AvailabilityFilter>("all");
  const [accountStatus, setAccountStatus] =
    useState<AccountStatusFilter>("all");

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [confirmNutritionist, setConfirmNutritionist] =
    useState<AdminNutritionistListItemDto | null>(null);

  const resettingRef = useRef(false);
  const [isResetting, setIsResetting] = useState(false);
  const skipRef = useRef(initialData.skip + initialData.data.length);
  const hasMoreRef = useRef(initialData.hasMore);
  const fetchingMoreRef = useRef(false);
  const isFirstRun = useRef(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const searchRef = useRef("");
  const sortByRef = useRef<SortBy>("createdAt");
  const sortOrderRef = useRef<SortOrder>("desc");
  const coachLevelRef = useRef<CoachLevelFilter>("all");
  const availabilityStatusRef = useRef<AvailabilityFilter>("all");
  const accountStatusRef = useRef<AccountStatusFilter>("all");

  const fetchPage = useCallback(
    async (skip: number, replace: boolean) => {
      const res = await adminNutritionistService.getNutritionists({
        skip,
        limit,
        search: searchRef.current || undefined,
        sortBy: sortByRef.current,
        sortOrder: sortOrderRef.current,
        applicationStatus: "approved",
        coachLevel:
          coachLevelRef.current === "all" ? undefined : coachLevelRef.current,
        availabilityStatus:
          availabilityStatusRef.current === "all"
            ? undefined
            : availabilityStatusRef.current,
        isBlocked:
          accountStatusRef.current === "all"
            ? undefined
            : accountStatusRef.current === "blocked",
      });

      setNutritionists((prev) => (replace ? res.data : [...prev, ...res.data]));
      skipRef.current = skip + res.data.length;
      hasMoreRef.current = res.hasMore;
    },
    [limit],
  );

  useEffect(() => {
    setNutritionists(initialData.data);
    skipRef.current = initialData.skip + initialData.data.length;
    hasMoreRef.current = initialData.hasMore;
  }, [initialData]);

  // Single reset path shared by search, sort, and every filter dimension.
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      searchRef.current = debouncedSearch;
      sortByRef.current = sortBy;
      sortOrderRef.current = sortOrder;
      coachLevelRef.current = coachLevel;
      availabilityStatusRef.current = availabilityStatus;
      accountStatusRef.current = accountStatus;
      return;
    }

    searchRef.current = debouncedSearch;
    sortByRef.current = sortBy;
    sortOrderRef.current = sortOrder;
    coachLevelRef.current = coachLevel;
    availabilityStatusRef.current = availabilityStatus;
    accountStatusRef.current = accountStatus;

    skipRef.current = 0;
    hasMoreRef.current = true;

    resettingRef.current = true;
    setIsResetting(true);

    fetchPage(0, true)
      .catch(() => toast.error("Failed to load nutritionists"))
      .finally(() => {
        resettingRef.current = false;
        setIsResetting(false);
      });
  }, [
    debouncedSearch,
    sortBy,
    sortOrder,
    coachLevel,
    availabilityStatus,
    accountStatus,
    fetchPage,
  ]);

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
          .catch(() => toast.error("Failed to load more nutritionists"))
          .finally(() => {
            fetchingMoreRef.current = false;
            setIsLoadingMore(false);
          });
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchPage]);

  useEffect(() => {
    if (!activeId) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveId(null);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [activeId]);

  const handleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Blocking is an account-level action, so it goes through adminUserService
  // against the linked userId — not the nutritionist profile's _id.
  const toggleBlock = async (nutritionist: AdminNutritionistListItemDto) => {
    setIsToggling(true);
    try {
      await adminUserService.updateBlockStatus(
        nutritionist.userId,
        !nutritionist.isBlocked,
      );

      if (accountStatus !== "all") {
        setNutritionists((prev) =>
          prev.filter((n) => n._id !== nutritionist._id),
        );
      } else {
        setNutritionists((prev) =>
          prev.map((n) =>
            n._id === nutritionist._id ? { ...n, isBlocked: !n.isBlocked } : n,
          ),
        );
      }

      toast.success(
        nutritionist.isBlocked
          ? "Nutritionist unblocked"
          : "Nutritionist blocked",
      );
    } catch {
      toast.error("Action failed");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="p-4 border-b border-slate-100 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <UserSearchBar value={search} onChange={setSearch} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            value={coachLevel}
            onChange={setCoachLevel}
            options={[
              { value: "all", label: "All Levels" },
              { value: "beginner", label: "Beginner" },
              { value: "verified", label: "Verified" },
              { value: "expert", label: "Expert" },
              { value: "top_coach", label: "Top Coach" },
            ]}
          />
          <FilterSelect
            value={availabilityStatus}
            onChange={setAvailabilityStatus}
            options={[
              { value: "all", label: "All Availability" },
              { value: "available", label: "Available" },
              { value: "busy", label: "Busy" },
              { value: "offline", label: "Offline" },
            ]}
          />
          <FilterSelect
            value={accountStatus}
            onChange={setAccountStatus}
            options={[
              { value: "all", label: "All Accounts" },
              { value: "active", label: "Active" },
              { value: "blocked", label: "Blocked" },
            ]}
          />
        </div>
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
                label="Professional"
                field="fullName"
                activeSortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="px-6 py-4"
              />
              <SortableHeader
                label="Level"
                field="coachLevel"
                activeSortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="px-6 py-4 hidden sm:table-cell"
              />
              <th className="px-6 py-4 font-semibold hidden md:table-cell">
                Availability
              </th>
              <SortableHeader
                label="Experience"
                field="totalExperienceYears"
                activeSortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="px-6 py-4 hidden lg:table-cell"
              />
              <SortableHeader
                label="Rating"
                field="rating"
                activeSortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="px-6 py-4 hidden lg:table-cell"
              />
              <th className="px-6 py-4 font-semibold hidden xl:table-cell">
                Coached
              </th>
              <th className="px-6 py-4 font-semibold text-center">Account</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {nutritionists.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-400">
                  No nutritionists found
                </td>
              </tr>
            ) : (
              nutritionists.map((n) => (
                <tr
                  key={n._id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {n.profileImage ? (
                        <Image
                          src={n.profileImage}
                          alt={n.fullName}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                          {getInitials(n.fullName)}
                        </div>
                      )}

                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 uppercase text-[13px] truncate">
                          {n.fullName}
                        </span>
                        <span className="text-xs text-slate-500 truncate">
                          @{n.username} · {n.email}
                        </span>

                        <div className="flex flex-wrap items-center gap-2 mt-1.5 sm:hidden">
                          <CoachLevelBadge level={n.coachLevel} />
                          <AvailabilityBadge status={n.availabilityStatus} />
                          <RatingDisplay
                            rating={n.rating}
                            totalReviews={n.totalReviews}
                          />
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 hidden sm:table-cell">
                    <CoachLevelBadge level={n.coachLevel} />
                  </td>

                  <td className="px-6 py-4 hidden md:table-cell">
                    <AvailabilityBadge status={n.availabilityStatus} />
                  </td>

                  <td className="px-6 py-4 hidden lg:table-cell text-slate-500 font-medium">
                    {n.totalExperienceYears} yrs
                  </td>

                  <td className="px-6 py-4 hidden lg:table-cell">
                    <RatingDisplay
                      rating={n.rating}
                      totalReviews={n.totalReviews}
                    />
                  </td>

                  <td className="px-6 py-4 hidden xl:table-cell text-slate-500 font-medium">
                    {n.totalPeopleCoached}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        n.isBlocked
                          ? "bg-red-50 text-red-600"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          n.isBlocked ? "bg-red-600" : "bg-emerald-600"
                        }`}
                      />
                      {n.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right relative">
                    <button
                      onClick={() =>
                        setActiveId(activeId === n._id ? null : n._id)
                      }
                      className="p-1.5 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all"
                    >
                      <MoreHorizontal size={18} className="text-slate-400" />
                    </button>

                    {activeId === n._id && (
                      <div
                        ref={menuRef}
                        className="absolute right-6 mt-2 w-44 bg-white border border-slate-200 shadow-xl rounded-xl z-20 p-1 animate-in fade-in slide-in-from-top-1"
                      >
                        <button
                          onClick={() =>
                            router.push(`/admin/nutritionists/${n._id}`)
                          }
                          className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                        >
                          <ExternalLink size={14} /> View Profile
                        </button>
                        <button
                          onClick={() => {
                            setConfirmNutritionist(n);
                            setActiveId(null);
                          }}
                          className={`w-full px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 mt-1 ${
                            n.isBlocked
                              ? "text-emerald-600 hover:bg-emerald-50"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                        >
                          {n.isBlocked ? (
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

      {confirmNutritionist && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-slate-100 animate-in zoom-in-95 duration-200">
            <h2 className="text-lg font-bold text-slate-900">Confirm Action</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Are you sure you want to{" "}
              {confirmNutritionist.isBlocked ? "unblock" : "block"}{" "}
              <span className="text-slate-900 font-bold italic">
                {confirmNutritionist.fullName}
              </span>
              ?
            </p>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setConfirmNutritionist(null)}
                disabled={isToggling}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await toggleBlock(confirmNutritionist);
                  setConfirmNutritionist(null);
                }}
                disabled={isToggling}
                className={`flex-1 px-4 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg transition-all disabled:opacity-50 ${
                  confirmNutritionist.isBlocked
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                    : "bg-red-600 hover:bg-red-700 shadow-red-200"
                }`}
              >
                Yes, {confirmNutritionist.isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
