"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  Loader2,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";

import { adminNutritionistApplicationService } from "@/services/admin/adminNutriApplication.service";
import { useDebounce } from "@/hooks/admin/debounce.hooks";

import { AdminNutritionistApplicationListItemDto } from "@/dtos/admin/nutritionistApplication/admin-nutritionist-application-list-item.dto";
import { InfiniteScrollResponseDto } from "@/dtos/common/infinite-scroll-response.dto";
import { ApplicationStatus } from "@/types/nutritionist.types";
import UserSearchBar from "./UserSearchBar";

interface ApplicationTableProps {
  initialData: InfiniteScrollResponseDto<AdminNutritionistApplicationListItemDto>;
  limit: number;
}

type SortBy = "createdAt" | "fullName";
type SortOrder = "asc" | "desc";
type StatusFilter = "all" | ApplicationStatus;

// NOTE: adjust these to match your actual ApplicationStatus enum values.
const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending" as ApplicationStatus, label: "Pending" },
  { value: "approved" as ApplicationStatus, label: "Approved" },
  { value: "rejected" as ApplicationStatus, label: "Rejected" },
];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  approved: "bg-emerald-50 text-emerald-600",
  rejected: "bg-red-50 text-red-600",
};

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
        STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(fullName: string) {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
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

export default function ApplicationTable({
  initialData,
  limit,
}: ApplicationTableProps) {
  const [applications, setApplications] = useState(initialData.data);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const skipRef = useRef(initialData.skip + initialData.data.length);
  const hasMoreRef = useRef(initialData.hasMore);
  const resettingRef = useRef(false);
  const fetchingMoreRef = useRef(false);
  const isFirstRun = useRef(true);

  const searchRef = useRef("");
  const sortByRef = useRef<SortBy>("createdAt");
  const sortOrderRef = useRef<SortOrder>("desc");
  const statusFilterRef = useRef<StatusFilter>("pending");

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchPage = useCallback(
    async (skip: number, replace: boolean) => {
      const res = await adminNutritionistApplicationService.getApplications({
        skip,
        limit,
        search: searchRef.current || undefined,
        sortBy: sortByRef.current,
        sortOrder: sortOrderRef.current,
        applicationStatus:
          statusFilterRef.current === "all"
            ? undefined
            : (statusFilterRef.current as ApplicationStatus),
      });

      setApplications((prev) => (replace ? res.data : [...prev, ...res.data]));

      skipRef.current = skip + res.data.length;
      hasMoreRef.current = res.hasMore;
    },
    [limit],
  );

  // Single reset path for search, sort, and status filter changes.
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
      .catch(() => toast.error("Failed to load applications"))
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
          .catch(() => toast.error("Failed to load more applications"))
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

  const handleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
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
                label="Applicant"
                field="fullName"
                activeSortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                className="px-6 py-4"
              />
              <th className="px-6 py-4 font-semibold hidden sm:table-cell">
                Email
              </th>
              <SortableHeader
                label="Applied On"
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
            {applications.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-400">
                  No applications found
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr
                  key={app._id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {app.profileImage ? (
                        <Image
                          src={app.profileImage}
                          alt={app.fullName}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                          {getInitials(app.fullName)}
                        </div>
                      )}

                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 uppercase text-[13px] truncate">
                          {app.fullName}
                        </span>
                        <span className="text-xs text-slate-500 truncate sm:hidden">
                          {app.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 hidden sm:table-cell text-slate-500 font-medium truncate">
                    {app.email}
                  </td>

                  <td className="px-6 py-4 hidden lg:table-cell text-slate-500 font-medium">
                    {formatDate(app.createdAt)}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={app.applicationStatus} />
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/nutritionists/${app.userId}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                    >
                      <ExternalLink size={14} /> View
                    </Link>
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
    </div>
  );
}
