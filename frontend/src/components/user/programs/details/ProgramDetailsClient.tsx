"use client";

import { useEffect, useState } from "react";
import { Target } from "lucide-react";

import { userProgramService } from "@/services/user/user-program.service";
import type { UserProgramDetailsResponseDTO } from "@/dtos/user/program/user-program-details.dto";

import ProgramDetailsHeader from "./ProgramDetailsHeader";
import ProgramOverview from "./ProgramOverview";
import ProgramProgressCard from "./ProgramProgressCard";
import ProgramReviewSection from "./ProgramReviewSection";
import ProgramDetailsSkeleton from "./ProgramDetailsSkeleton";
import ProgramDaysPreview from "./ProgramDaysPreview";
import ProgramHealthPanel from "@/components/user/program-health/ProgramHealthPanel";

interface ProgramDetailsClientProps {
  programId: string;
}

export default function ProgramDetailsClient({
  programId,
}: ProgramDetailsClientProps) {
  const [program, setProgram] = useState<UserProgramDetailsResponseDTO | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProgram() {
      setLoading(true);
      setProgram(null);

      try {
        const response = await userProgramService.getProgramDetails(programId);

        if (!active) return;

        if (response.success && response.data) {
          setProgram(response.data);
        }
      } catch {
        if (active) {
          setProgram(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProgram();

    return () => {
      active = false;
    };
  }, [programId]);

  if (loading) {
    return <ProgramDetailsSkeleton />;
  }

  if (!program) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white px-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              <Target className="h-6 w-6 text-emerald-600" />
            </div>

            <h2 className="mt-4 text-lg font-bold tracking-tight text-slate-900">
              Program not found
            </h2>

            <p className="mt-1 max-w-sm text-xs font-medium leading-relaxed text-slate-500">
              This program may have been removed or is no longer available.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <ProgramDetailsHeader
          title={program.title}
          nutritionistName={program.nutritionist.fullName}
          username={program.nutritionist.username}
          status={program.programStatus}
        />

        <ProgramOverview program={program} />

        <ProgramProgressCard program={program} />

        <ProgramDaysPreview programId={programId} />

        {/* Program-specific health information */}
        <ProgramHealthPanel programId={programId} />

        <ProgramReviewSection
          nutritionistId={program.nutritionist.id}
          userPlanId={program.userPlanId}
        />
      </div>
    </main>
  );
}
