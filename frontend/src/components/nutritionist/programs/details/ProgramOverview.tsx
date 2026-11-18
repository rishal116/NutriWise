import { ArrowRight } from "lucide-react";

import type { NutriProgramDetailsResponseDTO } from "@/dtos/nutritionist/program/nutri-program-details-response.dto";
import { ProgramInfoRow } from "@/components/nutritionist/programs/details/ProgramInfoRow";
import { formatProgramDate } from "@/components/nutritionist/programs/details/program-details.utils";

interface ProgramOverviewProps {
  programId: string;
  purchase: NutriProgramDetailsResponseDTO["purchase"];
  program: NutriProgramDetailsResponseDTO["program"];
  progress: NutriProgramDetailsResponseDTO["progress"];
  onViewDays: () => void;
}

export function ProgramOverview({
  programId,
  purchase,
  program,
  progress,
  onViewDays,
}: ProgramOverviewProps) {
  const completionPercentage = Math.min(
    100,
    Math.max(0, progress.completionPercentage),
  );

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: purchase.currency,
    maximumFractionDigits: 2,
  }).format(purchase.amount);

  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900">
            {purchase.planTitle}
          </h2>

          {purchase.planDescription && (
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              {purchase.planDescription}
            </p>
          )}

          <p className="mt-2 text-xs font-semibold text-emerald-700">
            {purchase.specialization.replace(/_/g, " ")}
          </p>
        </div>

        <button
          type="button"
          onClick={onViewDays}
          aria-label={`View day-by-day plan for program ${programId}`}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
        >
          Day-by-day plan
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="rounded-xl bg-slate-50 p-4">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
          <span>
            {progress.completedDays} of {progress.totalDays} days completed
          </span>

          <span className="text-slate-700">
            {Math.round(completionPercentage)}%
          </span>
        </div>

        <div
          className="h-2 w-full overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-label="Program completion"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(completionPercentage)}
        >
          <div
            className="h-full rounded-full bg-emerald-600 transition-[width] duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-slate-400">
          Currently on day {progress.currentDay} of {program.durationDays}
        </p>
      </div>

      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Program information
        </h3>

        <ProgramInfoRow
          label="Start date"
          value={formatProgramDate(program.startDate)}
        />

        <ProgramInfoRow
          label="End date"
          value={formatProgramDate(program.endDate)}
        />

        <ProgramInfoRow
          label="Duration"
          value={`${program.durationDays} days`}
        />

        <ProgramInfoRow
          label="Created on"
          value={formatProgramDate(program.createdAt)}
        />

        <ProgramInfoRow label="Purchase amount" value={formattedAmount} />

        <ProgramInfoRow
          label="Purchased on"
          value={formatProgramDate(purchase.purchasedAt)}
        />

        <ProgramInfoRow
          label="Last activity"
          value={formatProgramDate(progress.lastActivityAt)}
        />

        {program.cancellationReason && (
          <ProgramInfoRow
            label="Cancellation reason"
            value={program.cancellationReason}
          />
        )}
      </div>

      {purchase.features.length > 0 && (
        <div className="border-t border-slate-100 pt-4">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
            Plan features
          </h3>

          <ul className="grid gap-2 sm:grid-cols-2">
            {purchase.features.map((feature, index) => (
              <li
                key={`${feature}-${index}`}
                className="flex items-start gap-2 text-sm text-slate-600"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
