"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import Link from "next/link";
import Image from "next/image";

import {
  CalendarDays,
  Clock3,
  Users,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Video,
} from "lucide-react";

import { publicSessionService } from "@/services/public/publicSession.service";

import {
  GetPublicSessionsQueryDTO,
  PublicSessionSortOption,
} from "@/dtos/public/session/public-session-list-query.dto";

import { PublicSessionListItemResponseDTO } from "@/dtos/public/session/public-session-list-response.dto";

import {
  SESSION_PRICING_TYPES,
  SESSION_TYPES,
  SessionPricingType,
  SessionType,
} from "@/types/public/session/session.types";

const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  webinar: "Webinar",
  workshop: "Workshop",
  group_consultation: "Group Consultation",
  qna: "Q&A",
  seminar: "Seminar",
};

const SORT_OPTIONS: {
  value: PublicSessionSortOption;
  label: string;
}[] = [
  {
    value: "upcoming",
    label: "Upcoming",
  },
  {
    value: "latest",
    label: "Latest",
  },
  {
    value: "oldest",
    label: "Oldest",
  },
  {
    value: "price_low_to_high",
    label: "Price: Low to High",
  },
  {
    value: "price_high_to_low",
    label: "Price: High to Low",
  },
];

export default function PublicSessionsPage() {
  const [sessions, setSessions] = useState<PublicSessionListItemResponseDTO[]>(
    [],
  );

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [type, setType] = useState<SessionType | undefined>();

  const [pricingType, setPricingType] = useState<
    SessionPricingType | undefined
  >();

  const [sortBy, setSortBy] = useState<PublicSessionSortOption>("upcoming");

  const [cursor, setCursor] = useState<string | undefined>();

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadSessions = useCallback(
    async (reset = false) => {
      if (loading) return;

      try {
        setLoading(true);

        const query: GetPublicSessionsQueryDTO = {
          limit: 12,
          cursor: reset ? undefined : cursor,
          search: search || undefined,
          type,
          pricingType,
          sortBy,
        };

        const response = await publicSessionService.getSessions(query);

        const data = response.data;

        if (reset) {
          setSessions(data.items);
        } else {
          setSessions((previous) => [...previous, ...data.items]);
        }

        setCursor(data.nextCursor ?? undefined);
        setHasMore(data.hasMore);
      } catch (error) {
        console.error("Failed to load public sessions:", error);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [cursor, loading, pricingType, search, sortBy, type],
  );

  /*
   * Initial load and filter/sort changes.
   */
  useEffect(() => {
    setSessions([]);
    setCursor(undefined);
    setHasMore(true);
    setInitialLoading(true);

    const timeout = setTimeout(() => {
      loadSessions(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, type, pricingType, sortBy]);

  /*
   * Infinite scroll.
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (
          firstEntry.isIntersecting &&
          hasMore &&
          !loading &&
          sessions.length > 0
        ) {
          loadSessions(false);
        }
      },
      {
        threshold: 0.1,
      },
    );

    const current = observerRef.current;

    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [hasMore, loading, loadSessions, sessions.length]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(searchInput.trim());
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setType(undefined);
    setPricingType(undefined);
    setSortBy("upcoming");
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Sessions
        </h2>

        <p className="text-sm text-gray-500">
          Learn, connect, and grow with live sessions from nutritionists.
        </p>
      </div>

      {/* Search + filters */}
      <div className="space-y-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search sessions..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-24 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />

          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
          >
            Search
          </button>
        </form>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </div>

            {/* Session type */}
            <div className="relative">
              <select
                value={type ?? ""}
                onChange={(event) =>
                  setType(
                    event.target.value
                      ? (event.target.value as SessionType)
                      : undefined,
                  )
                }
                className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 outline-none focus:border-emerald-500"
              >
                <option value="">All types</option>

                {SESSION_TYPES.map((sessionType) => (
                  <option key={sessionType} value={sessionType}>
                    {SESSION_TYPE_LABELS[sessionType]}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Pricing */}
            <div className="relative">
              <select
                value={pricingType ?? ""}
                onChange={(event) =>
                  setPricingType(
                    event.target.value
                      ? (event.target.value as SessionPricingType)
                      : undefined,
                  )
                }
                className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 outline-none focus:border-emerald-500"
              >
                <option value="">All pricing</option>

                {SESSION_PRICING_TYPES.map((pricing) => (
                  <option key={pricing} value={pricing}>
                    {pricing === "free" ? "Free" : "Paid"}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>

            {(search || type || pricingType) && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg px-3 py-2 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as PublicSessionSortOption)
              }
              className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm text-gray-700 outline-none focus:border-emerald-500"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Loading */}
      {initialLoading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SessionSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!initialLoading && sessions.length === 0 && (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <Video className="h-5 w-5 text-emerald-500" />
          </div>

          <h3 className="text-base font-semibold text-gray-900">
            No sessions found
          </h3>

          <p className="mt-1 max-w-sm text-sm text-gray-500">
            Try changing your search or filters to find available sessions.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Session cards */}
      {!initialLoading && sessions.length > 0 && (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <SessionCard key={session.sessionId} session={session} />
            ))}
          </div>

          {/* Infinite scroll trigger */}
          <div
            ref={observerRef}
            className="flex min-h-10 items-center justify-center"
          >
            {loading && (
              <p className="text-sm text-gray-400">Loading more sessions...</p>
            )}

            {!hasMore && (
              <p className="text-sm text-gray-400">
                You&apos;ve reached the end.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function SessionCard({
  session,
}: {
  session: PublicSessionListItemResponseDTO;
}) {
  const scheduledDate = new Date(session.scheduledAt);

  const formattedDate = scheduledDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = scheduledDate.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });

  const isLive = session.status === "live";

  const currencySymbol =
    session.pricing.currency === "inr" ? "₹" : session.pricing.currency;

  return (
    <Link
      href={`/communities/sessions/${session.sessionId}`}
      className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        {session.thumbnailUrl ? (
          <Image
            src={session.thumbnailUrl}
            alt={session.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
            <Video className="h-10 w-10 text-emerald-400" />
          </div>
        )}

        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-gray-700 shadow-sm">
            {SESSION_TYPE_LABELS[session.type]}
          </span>
        </div>

        {isLive && (
          <div className="absolute right-3 top-3">
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-semibold text-white">
              Live
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4 p-4">
        <div>
          <h3 className="line-clamp-2 text-base font-semibold text-gray-900 transition group-hover:text-emerald-600">
            {session.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-500">
            {session.description}
          </p>
        </div>

        {/* Nutritionist */}
        <div className="flex items-center gap-2">
          {session.nutritionist.profileImage ? (
            <Image
              src={session.nutritionist.profileImage}
              alt={session.nutritionist.name}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
              {session.nutritionist.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <p className="text-xs text-gray-400">Hosted by</p>

            <p className="text-sm font-medium text-gray-700">
              {session.nutritionist.name}
            </p>
          </div>
        </div>

        {/* Session metadata */}
        <div className="space-y-2 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <CalendarDays className="h-3.5 w-3.5 text-emerald-500" />

            <span>{formattedDate}</span>

            <span>•</span>

            <span>{formattedTime}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock3 className="h-3.5 w-3.5 text-emerald-500" />

            <span>{session.durationInMinutes} minutes</span>

            <span>•</span>

            <Users className="h-3.5 w-3.5 text-emerald-500" />

            <span>Up to {session.maxParticipants}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div>
            {session.pricing.type === "free" ? (
              <span className="text-sm font-bold text-emerald-600">Free</span>
            ) : (
              <span className="text-sm font-bold text-gray-900">
                {currencySymbol}
                {session.pricing.amount}
              </span>
            )}
          </div>

          <span className="text-xs font-semibold text-emerald-600">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}

function SessionSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <div className="aspect-[16/9] animate-pulse bg-gray-100" />

      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="h-5 w-3/4 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-100" />

          <div className="space-y-1">
            <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
          </div>
        </div>

        <div className="space-y-2 border-t border-gray-100 pt-3">
          <div className="h-3 w-40 animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-32 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
