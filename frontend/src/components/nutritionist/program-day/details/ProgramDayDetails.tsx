"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { nutriProgramDayService } from "@/services/nutritionist/nutri-program-day.service";
import type { NutriProgramDayResponseDTO } from "@/dtos/nutritionist/program-day/nutri-program-day-response.dto";

import { ProgramDayHeader } from "./ProgramDayHeader";
import { ProgramDayActivityList } from "./ProgramDayActivityList";
import { ProgramDayDetailsSkeleton } from "./ProgramDayDetailsSkeleton";
import { ProgramDayNotFound } from "./ProgramDayNotFound";

interface ProgramDayDetailsProps {
  programId: string;
  dayId: string;
}

export function ProgramDayDetails({
  programId,
  dayId,
}: ProgramDayDetailsProps) {
  const router = useRouter();

  const [day, setDay] = useState<NutriProgramDayResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchDay = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const result = await nutriProgramDayService.getProgramDayDetails(dayId);

        if (cancelled) return;

        setDay(result);
      } catch {
        if (cancelled) return;

        setDay(null);
        setNotFound(true);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (!programId || !dayId) {
      setDay(null);
      setNotFound(true);
      setLoading(false);
      return;
    }

    void fetchDay();

    return () => {
      cancelled = true;
    };
  }, [programId, dayId]);

  const handleEdit = () => {
    router.push(`/nutritionist/programs/${programId}/days/${dayId}/edit`);
  };

  const handleBack = () => {
    router.push(`/nutritionist/programs/${programId}/days`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors duration-150 hover:text-emerald-600"
        >
          <span aria-hidden="true">←</span>
          Back to days
        </button>

        {loading ? (
          <ProgramDayDetailsSkeleton />
        ) : notFound || !day ? (
          <ProgramDayNotFound onBack={handleBack} />
        ) : (
          <>
            <ProgramDayHeader dayNumber={day.dayNumber} onEdit={handleEdit} />

            <ProgramDayActivityList activities={day.activities} />
          </>
        )}
      </div>
    </div>
  );
}
