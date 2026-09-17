import {
  Clock3,
  Crown,
  Gauge,
  Sparkles,
} from "lucide-react";

import { AdminChallengeDetailsDTO } from "@/dtos/admin/challenge/admin-challenge-details.dto";

interface ChallengeOverviewProps {
  challenge: AdminChallengeDetailsDTO;
}

export function ChallengeOverview({
  challenge,
}: ChallengeOverviewProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-600">
          Challenge overview
        </p>

        <h2 className="mt-1 text-lg font-semibold text-slate-900">
          {challenge.title}
        </h2>

        <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
          {challenge.description}
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          icon={<Clock3 className="h-4 w-4" />}
          label="Duration"
          value={`${challenge.durationDays} ${
            challenge.durationDays === 1
              ? "day"
              : "days"
          }`}
        />

        <InfoCard
          icon={<Gauge className="h-4 w-4" />}
          label="Difficulty"
          value={challenge.difficulty}
          capitalize
        />

        <InfoCard
          icon={<Sparkles className="h-4 w-4" />}
          label="Category"
          value={challenge.category.replaceAll(
            "_",
            " ",
          )}
          capitalize
        />

        <InfoCard
          icon={<Crown className="h-4 w-4" />}
          label="Access"
          value={challenge.accessType}
          capitalize
        />
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  label,
  value,
  capitalize = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-xs font-medium">
          {label}
        </span>
      </div>

      <p
        className={`mt-2 text-sm font-semibold text-slate-800 ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}