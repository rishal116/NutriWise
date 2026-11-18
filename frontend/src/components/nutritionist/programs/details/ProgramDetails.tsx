"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { nutriProgramService } from "@/services/nutritionist/nutri-program.service";
import type { NutriProgramDetailsResponseDTO } from "@/dtos/nutritionist/program/nutri-program-details-response.dto";

import { ProgramDetailsHeader } from "@/components/nutritionist/programs/details/ProgramDetailsHeader";
import { ProgramOverview } from "@/components/nutritionist/programs/details/ProgramOverview";
import { ProgramProgressStats } from "@/components/nutritionist/programs/details/ProgramProgressStats";
import { ProgramDetailsSkeleton } from "@/components/nutritionist/programs/details/ProgramDetailsSkeleton";
import { ProgramNotFound } from "@/components/nutritionist/programs/details/ProgramNotFound";

interface ProgramDetailsProps {
  programId: string;
}

interface ProgramDetailsState {
  programId: string;
  data: NutriProgramDetailsResponseDTO | null;
  notFound: boolean;
}

export function ProgramDetails({ programId }: ProgramDetailsProps) {
  const router = useRouter();

  const [result, setResult] = useState<ProgramDetailsState | null>(null);
  const [markingReady, setMarkingReady] = useState(false);

  const loading = Boolean(programId) && result?.programId !== programId;
  const notFound =
    !programId || (result?.programId === programId && result.notFound);
  const program = result?.programId === programId ? result.data : null;

  useEffect(() => {
    if (!programId) return;

    let cancelled = false;

    async function fetchProgramDetails() {
      try {
        const response = await nutriProgramService.getProgramDetails(programId);

        if (cancelled) return;

        setResult({
          programId,
          data: response,
          notFound: false,
        });

        try {
          sessionStorage.setItem(
            `nutriwise:program-duration:${response.userProgramId}`,
            String(response.program.durationDays),
          );
        } catch {
          // Session storage is optional; loading program details should still succeed.
        }
      } catch {
        if (cancelled) return;

        setResult({
          programId,
          data: null,
          notFound: true,
        });

        toast.error("Couldn't load this program's details.");
      }
    }

    void fetchProgramDetails();

    return () => {
      cancelled = true;
    };
  }, [programId]);

  const handleMarkAsReady = async () => {
    if (!program || markingReady || program.program.status !== "preparing") {
      return;
    }

    try {
      setMarkingReady(true);

      await nutriProgramService.markProgramAsReady(program.userProgramId);

      setResult((previous) => {
        if (!previous || previous.programId !== programId || !previous.data) {
          return previous;
        }

        return {
          ...previous,
          data: {
            ...previous.data,
            program: {
              ...previous.data.program,
              status: "ready",
            },
          },
        };
      });

      toast.success("Program marked as ready successfully.");
    } catch {
      toast.error("Failed to mark the program as ready.");
    } finally {
      setMarkingReady(false);
    }
  };

  const handleBack = () => router.back();

  const handleProgramsNavigation = () => router.push("/nutritionist/programs");

  const handleViewDays = () => {
    if (!program) return;

    router.push(`/nutritionist/programs/${program.userProgramId}/days`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to programs
        </button>

        {loading ? (
          <ProgramDetailsSkeleton />
        ) : notFound || !program ? (
          <ProgramNotFound onBack={handleProgramsNavigation} />
        ) : (
          <>
            <ProgramDetailsHeader
              client={program.client}
              status={program.program.status}
              onMarkAsReady={handleMarkAsReady}
              markingReady={markingReady}
            />

            <ProgramOverview
              programId={program.userProgramId}
              purchase={program.purchase}
              program={program.program}
              progress={program.progress}
              onViewDays={handleViewDays}
            />

            <ProgramProgressStats progress={program.progress} />
          </>
        )}
      </div>
    </div>
  );
}
