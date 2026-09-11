"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Loader2,
  Lock,
  MoreHorizontal,
  Star,
  Unlock,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { toast } from "sonner";

import { adminNutritionistService } from "@/services/admin/adminNutri.service";
import { adminUserService } from "@/services/admin/adminUser.service";

import { useDebounce } from "@/hooks/admin/debounce.hooks";

import UserSearchBar from "./UserSearchBar";

import { AdminNutritionistListItemDto } from "@/dtos/admin/nutritionist/admin-nutritionist-list-item.dto";

import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import { AvailabilityStatus, CoachLevel } from "@/types/nutritionist.types";

interface NutritionistTableProps {
  initialData: InfiniteScrollResponseDTO<AdminNutritionistListItemDto>;
}

type SortBy = "newest" | "oldest";

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
  available: {
    dot: "bg-emerald-600",
    text: "text-emerald-600",
  },
  busy: {
    dot: "bg-amber-500",
    text: "text-amber-600",
  },
  offline: {
    dot: "bg-slate-400",
    text: "text-slate-500",
  },
};

const AVAILABILITY_LABELS: Record<AvailabilityStatus, string> = {
  available: "Available",
  busy: "Busy",
  offline: "Offline",
};

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

function CoachLevelBadge({ level }: { level: CoachLevel }) {
  return (
    <span
      className={`rounded-md px-2 py-1 text-xs font-bold uppercase tracking-tight ${COACH_LEVEL_STYLES[level]}`}
    >
      {COACH_LEVEL_LABELS[level]}
    </span>
  );
}

function AvailabilityBadge({ status }: { status: AvailabilityStatus }) {
  const style = AVAILABILITY_STYLES[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />

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
      <Star size={13} className="fill-amber-400 text-amber-400" />

      {rating.toFixed(1)}

      <span className="font-medium text-slate-400">({totalReviews})</span>
    </span>
  );
}

function FilterSelect<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: {
    value: T;
    label: string;
  }[];
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as T)}
      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default function NutritionistTable({
  initialData,
}: NutritionistTableProps) {
  const router = useRouter();

  const [nutritionists, setNutritionists] = useState<
    AdminNutritionistListItemDto[]
  >(initialData.items);

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const [sortBy, setSortBy] = useState<SortBy>("newest");

  const [coachLevel, setCoachLevel] = useState<CoachLevelFilter>("all");

  const [availabilityStatus, setAvailabilityStatus] =
    useState<AvailabilityFilter>("all");

  const [accountStatus, setAccountStatus] =
    useState<AccountStatusFilter>("all");

  const [nextCursor, setNextCursor] = useState<string | null>(
    initialData.nextCursor,
  );

  const [hasMore, setHasMore] = useState(initialData.hasMore);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [isResetting, setIsResetting] = useState(false);

  const [isToggling, setIsToggling] = useState(false);

  const [activeId, setActiveId] = useState<string | null>(null);

  const [confirmNutritionist, setConfirmNutritionist] =
    useState<AdminNutritionistListItemDto | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const fetchingMoreRef = useRef(false);

  const resettingRef = useRef(false);

  const searchRef = useRef("");

  const sortByRef = useRef<SortBy>("newest");

  const coachLevelRef = useRef<CoachLevelFilter>("all");

  const availabilityStatusRef = useRef<AvailabilityFilter>("all");

  const accountStatusRef = useRef<AccountStatusFilter>("all");

  const getIsBlocked = (status: AccountStatusFilter): boolean | undefined => {
    if (status === "active") {
      return false;
    }

    if (status === "blocked") {
      return true;
    }

    return undefined;
  };

  const fetchNutritionists = useCallback(async (cursor?: string) => {
    const response = await adminNutritionistService.getNutritionists({
      search: searchRef.current || undefined,

      coachLevel:
        coachLevelRef.current === "all" ? undefined : coachLevelRef.current,

      availabilityStatus:
        availabilityStatusRef.current === "all"
          ? undefined
          : availabilityStatusRef.current,

      applicationStatus: "approved",

      isBlocked: getIsBlocked(accountStatusRef.current),

      sortBy: sortByRef.current,

      cursor,

      limit: 10,
    });

    const data = response.data;

    if (cursor) {
      setNutritionists((prev) => [...prev, ...data.items]);
    } else {
      setNutritionists(data.items);
    }

    setNextCursor(data.nextCursor);
    setHasMore(data.hasMore);
  }, []);

  useEffect(() => {
    searchRef.current = debouncedSearch;

    sortByRef.current = sortBy;

    coachLevelRef.current = coachLevel;

    availabilityStatusRef.current = availabilityStatus;

    accountStatusRef.current = accountStatus;
  }, [debouncedSearch, sortBy, coachLevel, availabilityStatus, accountStatus]);

  useEffect(() => {
    if (
      debouncedSearch === "" &&
      sortBy === "newest" &&
      coachLevel === "all" &&
      availabilityStatus === "all" &&
      accountStatus === "all"
    ) {
      return;
    }

    resettingRef.current = true;
    setIsResetting(true);

    fetchNutritionists()
      .catch(() => toast.error("Failed to load nutritionists"))
      .finally(() => {
        resettingRef.current = false;
        setIsResetting(false);
      });
  }, [
    debouncedSearch,
    sortBy,
    coachLevel,
    availabilityStatus,
    accountStatus,
    fetchNutritionists,
  ]);

  useEffect(() => {
    setNutritionists(initialData.items);
    setNextCursor(initialData.nextCursor);
    setHasMore(initialData.hasMore);
  }, [initialData]);

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

        if (resettingRef.current) {
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

        fetchNutritionists(nextCursor)
          .catch(() => toast.error("Failed to load more nutritionists"))
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
  }, [fetchNutritionists, hasMore, nextCursor]);

  useEffect(() => {
    if (!activeId) {
      return;
    }

    const handleMouseDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveId(null);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [activeId]);

  const handleSort = () => {
    setSortBy((prev) => (prev === "newest" ? "oldest" : "newest"));
  };

  const toggleBlock = async (nutritionist: AdminNutritionistListItemDto) => {
    setIsToggling(true);

    try {
      await adminUserService.updateBlockStatus(
        nutritionist.userId,
        !nutritionist.isBlocked,
      );

      if (accountStatus !== "all") {
        setNutritionists((prev) =>
          prev.filter((item) => item.userId !== nutritionist.userId),
        );
      } else {
        setNutritionists((prev) =>
          prev.map((item) =>
            item.userId === nutritionist.userId
              ? {
                  ...item,
                  isBlocked: !item.isBlocked,
                }
              : item,
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

  const handleClearFilters = () => {
    setSearch("");
    setSortBy("newest");
    setCoachLevel("all");
    setAvailabilityStatus("all");
    setAccountStatus("all");
  };

  const hasActiveFilters =
    Boolean(search.trim()) ||
    sortBy !== "newest" ||
    coachLevel !== "all" ||
    availabilityStatus !== "all" ||
    accountStatus !== "all";

  return (
    <div className="bg-white">
      {/* Toolbar */}
      <div className="space-y-3 border-b border-slate-100 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <UserSearchBar value={search} onChange={setSearch} />

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="self-start text-xs font-semibold text-teal-700 transition hover:text-teal-800 sm:self-auto"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            value={coachLevel}
            onChange={setCoachLevel}
            options={[
              {
                value: "all",
                label: "All Levels",
              },
              {
                value: "beginner",
                label: "Beginner",
              },
              {
                value: "verified",
                label: "Verified",
              },
              {
                value: "expert",
                label: "Expert",
              },
              {
                value: "top_coach",
                label: "Top Coach",
              },
            ]}
          />

          <FilterSelect
            value={availabilityStatus}
            onChange={setAvailabilityStatus}
            options={[
              {
                value: "all",
                label: "All Availability",
              },
              {
                value: "available",
                label: "Available",
              },
              {
                value: "busy",
                label: "Busy",
              },
              {
                value: "offline",
                label: "Offline",
              },
            ]}
          />

          <FilterSelect
            value={accountStatus}
            onChange={setAccountStatus}
            options={[
              {
                value: "all",
                label: "All Accounts",
              },
              {
                value: "active",
                label: "Active",
              },
              {
                value: "blocked",
                label: "Blocked",
              },
            ]}
          />
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
              <th className="px-6 py-4 font-semibold">Professional</th>

              <th className="hidden px-6 py-4 font-semibold sm:table-cell">
                Level
              </th>

              <th className="hidden px-6 py-4 font-semibold md:table-cell">
                Availability
              </th>

              <th className="hidden px-6 py-4 font-semibold lg:table-cell">
                Experience
              </th>

              <th className="hidden px-6 py-4 font-semibold lg:table-cell">
                Rating
              </th>

              <th className="hidden px-6 py-4 font-semibold xl:table-cell">
                Coached
              </th>

              <th className="px-6 py-4 text-center font-semibold">Account</th>

              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>

            <tr className="sr-only">
              <th>Sort</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {nutritionists.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  No nutritionists found
                </td>
              </tr>
            ) : (
              nutritionists.map((nutritionist) => (
                <tr
                  key={nutritionist.userId}
                  className="group transition-colors hover:bg-slate-50/50"
                >
                  {/* Professional */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {nutritionist.profileImage ? (
                        <Image
                          src={nutritionist.profileImage}
                          alt={nutritionist.fullName}
                          width={40}
                          height={40}
                          className="h-10 w-10 shrink-0 rounded-full border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-emerald-50 text-xs font-bold text-emerald-600">
                          {getInitials(nutritionist.fullName)}
                        </div>
                      )}

                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-[13px] font-bold text-slate-900">
                          {nutritionist.fullName}
                        </span>

                        <span className="truncate text-xs text-slate-500">
                          @{nutritionist.username} · {nutritionist.email}
                        </span>

                        <div className="mt-1.5 flex flex-wrap items-center gap-2 sm:hidden">
                          <CoachLevelBadge level={nutritionist.coachLevel} />

                          <AvailabilityBadge
                            status={nutritionist.availabilityStatus}
                          />

                          <RatingDisplay
                            rating={nutritionist.rating}
                            totalReviews={nutritionist.totalReviews}
                          />
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Level */}
                  <td className="hidden px-6 py-4 sm:table-cell">
                    <CoachLevelBadge level={nutritionist.coachLevel} />
                  </td>

                  {/* Availability */}
                  <td className="hidden px-6 py-4 md:table-cell">
                    <AvailabilityBadge
                      status={nutritionist.availabilityStatus}
                    />
                  </td>

                  {/* Experience */}
                  <td className="hidden px-6 py-4 font-medium text-slate-500 lg:table-cell">
                    {nutritionist.totalExperienceYears} yrs
                  </td>

                  {/* Rating */}
                  <td className="hidden px-6 py-4 lg:table-cell">
                    <RatingDisplay
                      rating={nutritionist.rating}
                      totalReviews={nutritionist.totalReviews}
                    />
                  </td>

                  {/* Coached */}
                  <td className="hidden px-6 py-4 font-medium text-slate-500 xl:table-cell">
                    {nutritionist.totalPeopleCoached}
                  </td>

                  {/* Account */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                        nutritionist.isBlocked
                          ? "bg-red-50 text-red-600"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      <span
                        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                          nutritionist.isBlocked
                            ? "bg-red-600"
                            : "bg-emerald-600"
                        }`}
                      />

                      {nutritionist.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="relative px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveId(
                          activeId === nutritionist.userId
                            ? null
                            : nutritionist.userId,
                        )
                      }
                      className="rounded-lg border border-transparent p-1.5 transition hover:border-slate-200 hover:bg-white"
                      aria-label={`Actions for ${nutritionist.fullName}`}
                    >
                      <MoreHorizontal size={18} className="text-slate-400" />
                    </button>

                    {activeId === nutritionist.userId && (
                      <div
                        ref={menuRef}
                        className="absolute right-6 top-12 z-20 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-xl"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setActiveId(null);

                            router.push(
                              `/admin/nutritionists/${nutritionist.userId}`,
                            );
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <ExternalLink size={14} />
                          View Profile
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setConfirmNutritionist(nutritionist);

                            setActiveId(null);
                          }}
                          className={`mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                            nutritionist.isBlocked
                              ? "text-emerald-600 hover:bg-emerald-50"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                        >
                          {nutritionist.isBlocked ? (
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

        {/* Sort control */}
        <div className="border-t border-slate-100 px-6 py-3">
          <button
            type="button"
            onClick={handleSort}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-800"
          >
            {sortBy === "newest" ? (
              <ArrowDown size={13} />
            ) : (
              <ArrowUp size={13} />
            )}

            {sortBy === "newest" ? "Newest first" : "Oldest first"}
          </button>
        </div>
      </div>

      {/* Infinite Scroll */}
      <div ref={sentinelRef} className="flex h-16 items-center justify-center">
        {isLoadingMore && (
          <Loader2 size={18} className="animate-spin text-slate-400" />
        )}

        {!isLoadingMore && !hasMore && nutritionists.length > 0 && (
          <span className="text-xs font-medium text-slate-400">
            No more nutritionists
          </span>
        )}
      </div>

      {/* Confirm Dialog */}
      {confirmNutritionist && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900">Confirm Action</h2>

            <p className="mt-2 text-sm font-medium text-slate-500">
              Are you sure you want to{" "}
              {confirmNutritionist.isBlocked ? "unblock" : "block"}{" "}
              <span className="font-bold italic text-slate-900">
                {confirmNutritionist.fullName}
              </span>
              ?
            </p>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmNutritionist(null)}
                disabled={isToggling}
                className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-500 transition hover:bg-slate-200 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={async () => {
                  await toggleBlock(confirmNutritionist);

                  setConfirmNutritionist(null);
                }}
                disabled={isToggling}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-lg transition disabled:opacity-50 ${
                  confirmNutritionist.isBlocked
                    ? "bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700"
                    : "bg-red-600 shadow-red-200 hover:bg-red-700"
                }`}
              >
                {isToggling
                  ? "Please wait..."
                  : `Yes, ${
                      confirmNutritionist.isBlocked ? "Unblock" : "Block"
                    }`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
