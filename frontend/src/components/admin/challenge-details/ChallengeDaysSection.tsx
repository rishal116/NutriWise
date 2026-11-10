import Link from "next/link";

import { ArrowRight, ListChecks } from "lucide-react";

interface ChallengeDaysSectionProps {
  challengeId: string;
}

export function ChallengeDaysSection({
  challengeId,
}: ChallengeDaysSectionProps) {
  return (
    <section className="rounded-2xl border border-admin-border bg-admin-surface p-5 shadow-sm shadow-admin-text/5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-admin-pastel-green text-admin-accent">
              <ListChecks className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-admin-accent">
                Challenge structure
              </p>

              <h2 className="mt-1 text-lg font-semibold text-admin-text">
                Challenge Days
              </h2>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-admin-muted">
            Manage the daily structure, activities,
            and content for this challenge.
          </p>
        </div>

        <Link
          href={`/admin/challenges/${challengeId}/days`}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-admin-accent px-4 py-2.5 text-sm font-semibold text-admin-accent-fg transition-colors hover:bg-admin-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60"
        >
          Manage Days
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}