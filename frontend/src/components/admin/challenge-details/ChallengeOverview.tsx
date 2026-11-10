import type { ReactNode } from "react";
import {
  CheckCircle2,
  Clock3,
  Crown,
  Gauge,
  Gift,
  Sparkles,
  Tags,
} from "lucide-react";

import { AdminChallengeDetailsDTO } from "@/dtos/admin/challenge/admin-challenge-details.dto";

interface ChallengeOverviewProps {
  challenge: AdminChallengeDetailsDTO;
}

export function ChallengeOverview({ challenge }: ChallengeOverviewProps) {
  return (
    <section className="rounded-2xl border border-admin-border bg-admin-surface p-5 shadow-sm shadow-admin-text/5 sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-admin-accent">
          Challenge overview
        </p>

        <h2 className="mt-1 text-lg font-semibold text-admin-text">
          {challenge.title}
        </h2>

        <p className="mt-4 text-sm leading-7 text-admin-muted sm:text-base">
          {challenge.description}
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          icon={<Clock3 className="h-4 w-4" />}
          label="Duration"
          value={`${challenge.durationDays} ${
            challenge.durationDays === 1 ? "day" : "days"
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
          value={challenge.category.replaceAll("_", " ")}
          capitalize
        />

        <InfoCard
          icon={<Crown className="h-4 w-4" />}
          label="Access"
          value={challenge.accessType}
          capitalize
        />
      </div>

      {/* Goals */}
      {challenge.goals.length > 0 && (
        <div className="mt-6 border-t border-admin-border pt-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-admin-success" />
            <h3 className="text-sm font-semibold text-admin-text">
              Challenge Goals
            </h3>
          </div>

          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {challenge.goals.map((goal, index) => (
              <li
                key={`${goal}-${index}`}
                className="flex items-start gap-2 rounded-xl bg-admin-pastel-green p-3 text-sm text-admin-text"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-admin-success" />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Benefits */}
      {challenge.benefits.length > 0 && (
        <div className="mt-6 border-t border-admin-border pt-5">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-admin-accent" />
            <h3 className="text-sm font-semibold text-admin-text">
              Participant Benefits
            </h3>
          </div>

          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {challenge.benefits.map((benefit, index) => (
              <li
                key={`${benefit}-${index}`}
                className="rounded-xl border border-admin-border bg-admin-surface-hover p-3 text-sm text-admin-text"
              >
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags */}
      {challenge.tags.length > 0 && (
        <div className="mt-6 border-t border-admin-border pt-5">
          <div className="flex items-center gap-2">
            <Tags className="h-5 w-5 text-admin-muted" />
            <h3 className="text-sm font-semibold text-admin-text">Tags</h3>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {challenge.tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="rounded-full bg-admin-bg px-3 py-1.5 text-xs font-medium text-admin-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function InfoCard({
  icon,
  label,
  value,
  capitalize = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="rounded-xl border border-admin-border bg-admin-surface-hover p-4">
      <div className="flex items-center gap-2 text-admin-muted">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>

      <p
        className={`mt-2 text-sm font-semibold text-admin-text ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}