"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { nutriProgramService } from "@/services/nutritionist/nutriProgram.service";
import type { UserProgramDetailsResponseDTO } from "@/dtos/nutritionist/program/program-details-response.dto";
import { ProgramAvatar } from "@/components/nutritionist/programs/ProgramAvatar";
import {
  ProgramStatusBadge,
  SubscriptionStatusBadge,
} from "@/components/nutritionist/programs/StatusBadges";
import { StatCard } from "@/components/nutritionist/programs/StatCard";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
      <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
      <div className="h-32 animate-pulse rounded-2xl bg-slate-100" />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className="text-sm font-medium text-slate-800">{value}</span>
    </div>
  );
}

export default function ProgramDetailsPage() {
  const { programId } = useParams<{ programId: string }>();
  const router = useRouter();

  const [program, setProgram] = useState<UserProgramDetailsResponseDTO | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!programId) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await nutriProgramService.getProgramDetails(programId);
        if (!cancelled) setProgram(res);
      } catch {
        if (!cancelled) {
          setNotFound(true);
          toast.error("Couldn't load this program's details.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [programId]);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to programs
        </button>

        {loading ? (
          <DetailSkeleton />
        ) : notFound || !program ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <p className="text-sm font-bold text-slate-700">
              Program not found
            </p>
            <p className="text-xs text-slate-400">
              This program may have been removed or the link is incorrect.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <ProgramAvatar
                  userProfileImage={program.userProfileImage}
                  userFullName={program.userFullName}
                />
                <div>
                  <h1 className="text-lg font-bold text-slate-900">
                    {program.userFullName}
                  </h1>
                  <p className="text-sm text-slate-400">
                    {program.specialization}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <ProgramStatusBadge status={program.programStatus} />
                <SubscriptionStatusBadge status={program.subscriptionStatus} />
              </div>
            </div>

            {/* Plan + progress */}
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    {program.planTitle}
                  </h2>
                  {program.planDescription && (
                    <p className="mt-0.5 text-xs text-slate-400">
                      {program.planDescription}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/nutritionist/programs/${program.userProgramId}/days`,
                    )
                  }
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
                >
                  Day-by-day plan
                  <ArrowRight size={14} />
                </button>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500">
                  <span>
                    Day {program.currentDay}/{program.durationDays}
                  </span>
                  <span>{Math.round(program.completionPercentage)}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{
                      width: `${Math.min(100, Math.max(0, program.completionPercentage))}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <InfoRow
                  label="Start date"
                  value={formatDate(program.startDate)}
                />
                <InfoRow label="End date" value={formatDate(program.endDate)} />
                <InfoRow label="Payment status" value={program.paymentStatus} />
              </div>
            </div>

            {/* Stats grid */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-bold text-slate-900">
                Progress stats
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <StatCard
                  label="Adherence"
                  value={`${program.adherenceScore}%`}
                />
                <StatCard
                  label="Current streak"
                  value={`${program.currentStreak}d`}
                />
                <StatCard
                  label="Longest streak"
                  value={`${program.longestStreak}d`}
                />
                <StatCard
                  label="Days completed"
                  value={`${program.completedDays}/${program.totalDays}`}
                />
                <StatCard
                  label="Activities done"
                  value={`${program.completedActivities}/${program.totalActivities}`}
                />
                <StatCard
                  label="Skipped activities"
                  value={program.skippedActivities}
                />
              </div>
            </div>

            {/* Notes */}
            {program.programNotes && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-2 text-sm font-bold text-slate-900">Notes</h2>
                <p className="text-sm text-slate-600">{program.programNotes}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
