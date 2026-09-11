"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { ExternalLink, Loader2, ArrowUp, ArrowDown } from "lucide-react";

import { adminNutritionistApplicationService } from "@/services/admin/adminNutriApplication.service";

import { useDebounce } from "@/hooks/admin/debounce.hooks";

import { AdminNutritionistApplicationListItemDto } from "@/dtos/admin/nutritionistApplication/admin-nutritionist-application-list-item.dto";

import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import { ApplicationStatus } from "@/types/nutritionist.types";

import UserSearchBar from "./UserSearchBar";

interface ApplicationTableProps {
  initialData: InfiniteScrollResponseDTO<AdminNutritionistApplicationListItemDto>;
}

type SortBy = "newest" | "oldest";

type StatusFilter = "all" | ApplicationStatus;

const STATUS_FILTERS: {
  value: StatusFilter;
  label: string;
}[] = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "approved",
    label: "Approved",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  approved: "bg-emerald-50 text-emerald-600",
  rejected: "bg-red-50 text-red-600",
};

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
        STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function formatDate(value: string | Date): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
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

export default function ApplicationTable({
  initialData,
}: ApplicationTableProps) {
  const [applications, setApplications] = useState<
    AdminNutritionistApplicationListItemDto[]
  >(initialData.items);

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const [sortBy, setSortBy] = useState<SortBy>("newest");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");

  const [nextCursor, setNextCursor] = useState<string | null>(
    initialData.nextCursor,
  );

  const [hasMore, setHasMore] = useState(initialData.hasMore);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [isResetting, setIsResetting] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchingMoreRef = useRef(false);

  const resettingRef = useRef(false);

  const searchRef = useRef("");

  const sortByRef = useRef<SortBy>("newest");

  const statusFilterRef = useRef<StatusFilter>("pending");

  const fetchApplications = useCallback(async (cursor?: string) => {
    const response = await adminNutritionistApplicationService.getApplications({
      search: searchRef.current || undefined,

      applicationStatus:
        statusFilterRef.current === "all"
          ? undefined
          : (statusFilterRef.current as ApplicationStatus),

      sortBy: sortByRef.current,

      cursor,

      limit: 10,
    });

    const data = response.data;

    if (cursor) {
      setApplications((prev) => [...prev, ...data.items]);
    } else {
      setApplications(data.items);
    }

    setNextCursor(data.nextCursor);
    setHasMore(data.hasMore);
  }, []);

  useEffect(() => {
    searchRef.current = debouncedSearch;

    sortByRef.current = sortBy;

    statusFilterRef.current = statusFilter;
  }, [debouncedSearch, sortBy, statusFilter]);

  useEffect(() => {
    if (
      debouncedSearch === "" &&
      sortBy === "newest" &&
      statusFilter === "pending"
    ) {
      return;
    }

    resettingRef.current = true;
    setIsResetting(true);

    fetchApplications()
      .catch(() => toast.error("Failed to load applications"))
      .finally(() => {
        resettingRef.current = false;
        setIsResetting(false);
      });
  }, [debouncedSearch, sortBy, statusFilter, fetchApplications]);

  useEffect(() => {
    setApplications(initialData.items);

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

        fetchApplications(nextCursor)
          .catch(() => toast.error("Failed to load more applications"))
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
  }, [fetchApplications, hasMore, nextCursor]);

  const handleSort = () => {
    setSortBy((prev) => (prev === "newest" ? "oldest" : "newest"));
  };

  const handleClearFilters = () => {
    setSearch("");
    setSortBy("newest");
    setStatusFilter("pending");
  };

  const hasActiveFilters =
    Boolean(search.trim()) || sortBy !== "newest" || statusFilter !== "pending";

  return (
    <div className="bg-white">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <StatusFilterTabs value={statusFilter} onChange={setStatusFilter} />

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

        <div className="flex items-center justify-end">
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
              <th className="px-6 py-4 font-semibold">Applicant</th>

              <th className="hidden px-6 py-4 font-semibold sm:table-cell">
                Email
              </th>

              <th className="hidden px-6 py-4 font-semibold lg:table-cell">
                Applied On
              </th>

              <th className="px-6 py-4 text-center font-semibold">Status</th>

              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  No applications found
                </td>
              </tr>
            ) : (
              applications.map((application) => (
                <tr
                  key={application._id}
                  className="group transition-colors hover:bg-slate-50/50"
                >
                  {/* Applicant */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {application.profileImage ? (
                        <Image
                          src={application.profileImage}
                          alt={application.fullName}
                          width={40}
                          height={40}
                          className="h-10 w-10 shrink-0 rounded-full border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-emerald-50 text-xs font-bold text-emerald-600">
                          {getInitials(application.fullName)}
                        </div>
                      )}

                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-[13px] font-bold text-slate-900">
                          {application.fullName}
                        </span>

                        <span className="truncate text-xs text-slate-500 sm:hidden">
                          {application.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="hidden px-6 py-4 font-medium text-slate-500 sm:table-cell">
                    {application.email}
                  </td>

                  {/* Applied On */}
                  <td className="hidden px-6 py-4 font-medium text-slate-500 lg:table-cell">
                    {formatDate(application.createdAt)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={application.applicationStatus} />
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/nutritionists/${application.userId}`}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-emerald-600 transition hover:bg-emerald-50"
                    >
                      <ExternalLink size={14} />
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Infinite Scroll */}
      <div ref={sentinelRef} className="flex h-16 items-center justify-center">
        {isLoadingMore && (
          <Loader2 size={18} className="animate-spin text-slate-400" />
        )}

        {!isLoadingMore && !hasMore && applications.length > 0 && (
          <span className="text-xs font-medium text-slate-400">
            No more applications
          </span>
        )}
      </div>
    </div>
  );
}
