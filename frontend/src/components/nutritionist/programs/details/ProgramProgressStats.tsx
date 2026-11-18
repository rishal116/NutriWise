import { StatCard } from "@/components/nutritionist/programs/details/StatCard";

import type { NutriProgramDetailsResponseDTO } from "@/dtos/nutritionist/program/nutri-program-details-response.dto";

interface ProgramProgressStatsProps {
  progress: NutriProgramDetailsResponseDTO["progress"];
}

export function ProgramProgressStats({
  progress,
}: ProgramProgressStatsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold text-slate-900">
        Progress statistics
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Current streak"
          value={`${progress.currentStreak}d`}
        />

        <StatCard
          label="Longest streak"
          value={`${progress.longestStreak}d`}
        />

        <StatCard
          label="Days completed"
          value={`${progress.completedDays}/${progress.totalDays}`}
        />

        <StatCard
          label="Activities done"
          value={`${progress.completedActivities}/${progress.totalActivities}`}
        />

        <StatCard
          label="Skipped activities"
          value={progress.skippedActivities}
        />

        <StatCard
          label="Total activities"
          value={progress.totalActivities}
        />
      </div>
    </div>
  );
}