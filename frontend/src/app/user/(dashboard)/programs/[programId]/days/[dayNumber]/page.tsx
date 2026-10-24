"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, ListChecks } from "lucide-react";

import { useProgramDay } from "@/hooks/user/useProgramDay";
import {
  ActivityCard,
  ProgramDayError,
  ProgramDayHeader,
  ProgramDaySkeleton,
} from "@/components/user/program-day";

interface ProgramDayDetailsPageProps {
  params: Promise<{
    programId: string;
    dayNumber: string;
  }>;
}

export default function ProgramDayDetailsPage({
  params,
}: ProgramDayDetailsPageProps) {
  const {
    day,
    programId,
    loading,
    error,
    pendingActivityId,
    actionError,
    handleActivityAction,
  } = useProgramDay({ params });

  if (loading) {
    return <ProgramDaySkeleton />;
  }

  if (error || !day) {
    return <ProgramDayError programId={programId} />;
  }

  const tracking = day.tracking;
  const sortedActivities = [...day.activities].sort(
    (first, second) => first.order - second.order,
  );

  return (
    <div className="mx-auto max-w-5xl p-6">
      <Link
        href={`/user/programs/${programId}/days`}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors duration-150 hover:text-emerald-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Days
      </Link>

      {actionError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          {actionError}
        </div>
      )}

      <ProgramDayHeader dayNumber={day.dayNumber} tracking={tracking} />

      <div className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-emerald-600" />
          <h2 className="text-base font-bold tracking-tight text-slate-900">
            Activities
          </h2>
        </div>

        {sortedActivities.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 py-16 text-center">
            <ListChecks className="h-6 w-6 text-emerald-600" />
            <h3 className="mt-4 text-sm font-bold text-slate-900">
              No activities for this day
            </h3>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedActivities.map((activity) => (
              <ActivityCard
                key={activity._id}
                activity={activity}
                isDayLocked={!tracking || tracking.isLocked}
                isPending={pendingActivityId === activity._id}
                onAction={(action) => handleActivityAction(activity, action)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
