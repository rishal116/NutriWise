"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import ChallengeDayDetails from "@/components/admin/challenge-day/ChallengeDayDetails";
import { adminChallengeDayService } from "@/services/admin/admin-challenge-day.service";
import type { AdminChallengeDayDetailsDTO } from "@/dtos/admin/challenge-day/admin-challenge-day-details.dto";

interface ChallengeDayDetailsClientProps {
  challengeId: string;
  dayId: string;
}

export default function ChallengeDayDetailsClient({
  challengeId,
  dayId,
}: ChallengeDayDetailsClientProps) {
  const [day, setDay] = useState<AdminChallengeDayDetailsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchDay() {
      try {
        setIsLoading(true);
        setError(false);

        const response = await adminChallengeDayService.getDayDetails(
          challengeId,
          dayId,
        );

        if (cancelled) return;

        if (!response.success || !response.data) {
          setError(true);
          toast.error(response.message || "Failed to load challenge day.");
          return;
        }

        setDay(response.data);
      } catch {
        if (!cancelled) {
          setError(true);
          toast.error("Failed to load challenge day. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void fetchDay();

    return () => {
      cancelled = true;
    };
  }, [challengeId, dayId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse px-4 py-8 sm:px-6">
        <div className="h-8 w-48 rounded bg-slate-200" />
        <div className="mt-6 h-40 rounded-xl bg-slate-100" />
      </div>
    );
  }

  if (error || !day) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6">
        <p className="text-sm font-medium text-slate-600">
          Unable to load challenge day details.
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Try again
        </button>
      </div>
    );
  }

  return <ChallengeDayDetails challengeId={challengeId} day={day} />;
}