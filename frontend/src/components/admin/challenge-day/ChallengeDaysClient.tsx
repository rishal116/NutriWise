"use client";

import { useEffect, useState } from "react";

import ChallengeDayList from "@/components/admin/challenge-day/ChallengeDayList";
import { adminChallengeDayService } from "@/services/admin/admin-challenge-day.service";
import type { AdminChallengeDayListItemDTO } from "@/dtos/admin/challenge-day/admin-challenge-day-list-item.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

interface ChallengeDaysClientProps {
  challengeId: string;
}

export default function ChallengeDaysClient({
  challengeId,
}: ChallengeDaysClientProps) {
  const [initialData, setInitialData] = useState<
    InfiniteScrollResponseDTO<AdminChallengeDayListItemDTO> | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchDays() {
      try {
        setLoading(true);
        setError(null);

        const response = await adminChallengeDayService.listDays(
          challengeId,
          {
            limit: 12,
            sortBy: "day_asc",
          },
        );

        if (cancelled) return;

        if (!response.success || !response.data) {
          setError(response.message || "Failed to load challenge days.");
          return;
        }

        setInitialData(response.data);
      } catch {
        if (!cancelled) {
          setError("Failed to load challenge days. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchDays();

    return () => {
      cancelled = true;
    };
  }, [challengeId, retryCount]);

  if (loading) {
    return (
      <div
        role="status"
        aria-label="Loading challenge days"
        className="mx-auto max-w-7xl animate-pulse space-y-4"
      >
        <div className="h-8 w-64 rounded bg-admin-border" />
        <div className="h-48 rounded-2xl border border-admin-border bg-admin-surface" />
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="mx-auto max-w-7xl rounded-2xl border border-admin-border bg-admin-surface p-6 shadow-sm shadow-admin-text/5">
        <p role="alert" className="text-sm font-medium text-admin-danger">
          {error ?? "Unable to load challenge days."}
        </p>

        <button
          type="button"
          onClick={() => setRetryCount((count) => count + 1)}
          className="mt-4 rounded-xl bg-admin-accent px-4 py-2 text-sm font-semibold text-admin-accent-fg transition-colors hover:bg-admin-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ChallengeDayList
      challengeId={challengeId}
      initialData={initialData}
    />
  );
}