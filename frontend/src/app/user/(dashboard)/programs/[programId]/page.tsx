"use client";

import { useEffect, useState } from "react";
import { Target } from "lucide-react";

import { userProgramService } from "@/services/user/userProgram.service";
import type { UserProgramDetailsDTO } from "@/dtos/user/program/user-program-details.dto";

import ProgramDetailsHeader from "@/components/user/program-detail/ProgramDetailsHeader";
import ProgramOverview from "@/components/user/program-detail/ProgramOverview";
import ProgramProgressCard from "@/components/user/program-detail/ProgramProgressCard";
import ProgramReviewSection from "@/components/user/program-detail/ProgramReviewSection";
import ProgramDetailsSkeleton from "@/components/user/program-detail/ProgramDetailsSkeleton";
import ProgramDaysSection from "@/components/user/program-detail/ProgramDaysSection";

interface ProgramDetailsPageProps {
  params: Promise<{
    programId: string;
  }>;
}

export default function ProgramDetailsPage({
  params,
}: ProgramDetailsPageProps) {
  const [programId, setProgramId] = useState<string | null>(null);
  const [program, setProgram] =
    useState<UserProgramDetailsDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProgram = async () => {
      try {
        const { programId: resolvedProgramId } = await params;

        if (!active) {
          return;
        }

        setProgramId(resolvedProgramId);

        const response =
          await userProgramService.getProgramDetails(
            resolvedProgramId,
          );

        if (active) {
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
    };

    void loadProgram();

    return () => {
      active = false;
    };
  }, [params]);

  if (loading) {
    return <ProgramDetailsSkeleton />;
  }

  if (!program || !programId) {
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
              This program may have been removed or is no longer
              available.
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
          status={program.status}
        />

        <ProgramOverview program={program} />

        <ProgramProgressCard program={program} />

        <ProgramDaysSection programId={programId} />

        <ProgramReviewSection
          nutritionistId={program.nutritionist._id}
          userPlanId={program.userPlanId}
        />
      </div>
    </main>
  );
}