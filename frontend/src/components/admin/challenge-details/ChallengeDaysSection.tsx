import Link from "next/link";

import { ArrowRight, ListChecks } from "lucide-react";

interface ChallengeDaysSectionProps {
  challengeId: string;
}

export function ChallengeDaysSection({
  challengeId,
}: ChallengeDaysSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <ListChecks className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-600">
                Challenge structure
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Challenge Days
              </h2>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Manage the daily structure, activities,
            and content for this challenge.
          </p>
        </div>

        <Link
          href={`/admin/challenges/${challengeId}/days`}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Manage Days
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}