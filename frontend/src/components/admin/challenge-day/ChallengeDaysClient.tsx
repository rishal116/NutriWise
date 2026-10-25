
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
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-4">
          <div className="h-8 w-64 rounded bg-slate-200" />
          <div className="h-48 rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  if (error || !initialData) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-red-600">
            {error ?? "Unable to load challenge days."}
          </p>

          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="mt-4 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <ChallengeDayList
      challengeId={challengeId}
      initialData={initialData}
    />
  );
}
