"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { nutritionistPlanDayService } from "@/services/nutritionist/nutri-plan-day.service";
import type { NutritionistPlanDayDetailsDTO } from "@/dtos/nutritionist/plan-day/nutritionist-plan-day-details.dto";

import { PlanDayDetailsHeader } from "./PlanDayDetailsHeader";
import { PlanDayInformation } from "./PlanDayInformation";
import { PlanDayActivityList } from "./PlanDayActivityList";
import { PlanDayDetailsSkeleton } from "./PlanDayDetailsSkeleton";
import { PlanDayNotFound } from "./PlanDayNotFound";

interface PlanDayDetailsClientProps {
  planId: string;
  dayNumber: string;
}

export function PlanDayDetailsClient({
  planId,
  dayNumber,
}: PlanDayDetailsClientProps) {
  const router = useRouter();

  const [day, setDay] = useState<NutritionistPlanDayDetailsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parsedDayNumber = Number(dayNumber);
  const isValidDayNumber =
    Number.isInteger(parsedDayNumber) && parsedDayNumber > 0;

  const fetchPlanDay = useCallback(async () => {
    if (!planId || !isValidDayNumber) {
      setDay(null);
      setError("The requested plan day is invalid.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await nutritionistPlanDayService.getPlanDayDetails(
        planId,
        parsedDayNumber,
      );

      setDay(response);
    } catch {
      setDay(null);
      setError("Unable to load this plan day. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [planId, parsedDayNumber, isValidDayNumber]);

  const handleEdit = () => {
    router.push(`/nutritionist/plans/${planId}/days/${parsedDayNumber}/edit`);
  };

  useEffect(() => {
    void fetchPlanDay();
  }, [fetchPlanDay]);

  const handleBack = () => {
    router.push(`/nutritionist/plans/${planId}/days`);
  };

  if (isLoading) {
    return <PlanDayDetailsSkeleton />;
  }

  if (error || !day) {
    return (
      <PlanDayNotFound
        message={error ?? "The requested plan day could not be found."}
        onBack={handleBack}
        onRetry={() => void fetchPlanDay()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-500 transition-colors hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to plan days
        </button>

        <PlanDayDetailsHeader
          dayNumber={day.dayNumber}
          activityCount={day.activities.length}
          onEdit={handleEdit}
        />

        <PlanDayInformation
          title={day.title}
          description={day.description}
          createdAt={day.createdAt}
          updatedAt={day.updatedAt}
        />

        <PlanDayActivityList activities={day.activities} />
      </div>
    </div>
  );
}
