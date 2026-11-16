import type { ReactNode } from "react";
import {
  CalendarDays,
  Clock,
  CreditCard,
  Target,
} from "lucide-react";

import type { UserProgramDetailsResponseDTO } from "@/dtos/user/program/user-program-details.dto";
import type { ProgramStatus } from "@/constants/user/program/program-status.constants";

interface ProgramOverviewProps {
  program: UserProgramDetailsResponseDTO;
}

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  badge?: boolean;
}

const STATUS_STYLES: Record<ProgramStatus, string> = {
  preparing: "border-amber-200 bg-amber-50 text-amber-700",
  ready: "border-indigo-200 bg-indigo-50 text-indigo-700",
  upcoming: "border-violet-200 bg-violet-50 text-violet-700",
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  paused: "border-amber-200 bg-amber-50 text-amber-700",
  completed: "border-sky-200 bg-sky-50 text-sky-700",
  cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

function StatCard({
  icon,
  label,
  value,
  badge = false,
}: StatCardProps) {
  const statusStyle = badge
    ? STATUS_STYLES[value as ProgramStatus]
    : undefined;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-700">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>

        {badge ? (
          <span
            className={`mt-0.5 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${
              statusStyle ?? "border-slate-200 bg-slate-100 text-slate-700"
            }`}
          >
            {value}
          </span>
        ) : (
          <p className="mt-0.5 truncate text-sm font-bold text-slate-900">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function formatDate(date: string | null): string {
  if (!date) {
    return "Not scheduled";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number, currency: string): string {
  if (!Number.isFinite(amount)) {
    return "Not available";
  }

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

export default function ProgramOverview({
  program,
}: ProgramOverviewProps) {
  const rawPercentage = program.completionPercentage;

  const completionPercentage = Number.isFinite(rawPercentage)
    ? Math.round(Math.min(100, Math.max(0, rawPercentage)))
    : 0;

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-5 w-1 rounded-full bg-emerald-600" />

        <h2 className="text-base font-bold tracking-tight text-slate-900">
          Program Overview
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard
          icon={<Target className="h-4 w-4" />}
          label="Program Status"
          value={program.programStatus}
          badge
        />

        <StatCard
          icon={<Clock className="h-4 w-4" />}
          label="Current Day"
          value={`${program.currentDay} / ${program.durationDays}`}
        />

        <StatCard
          icon={<CalendarDays className="h-4 w-4" />}
          label="Duration"
          value={`${program.durationDays} days`}
        />

        <StatCard
          icon={<Target className="h-4 w-4" />}
          label="Completion"
          value={`${completionPercentage}%`}
        />

        <StatCard
          icon={<CalendarDays className="h-4 w-4" />}
          label="Start Date"
          value={formatDate(program.startDate)}
        />

        <StatCard
          icon={<CalendarDays className="h-4 w-4" />}
          label="End Date"
          value={formatDate(program.endDate)}
        />

        <StatCard
          icon={<CreditCard className="h-4 w-4" />}
          label="Purchase Amount"
          value={formatCurrency(
            program.purchaseAmount,
            program.currency,
          )}
        />

        <StatCard
          icon={<CalendarDays className="h-4 w-4" />}
          label="Purchase Date"
          value={formatDate(program.purchaseDate)}
        />
      </div>

      <div className="mt-5 space-y-4 border-t border-slate-100 pt-5">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Specialization
          </h3>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {program.specialization.replaceAll("_", " ")}
          </p>
        </div>

        {program.description && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Description
            </h3>

            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {program.description}
            </p>
          </div>
        )}

        {program.features.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Included Features
            </h3>

            <ul className="mt-2 flex flex-wrap gap-2">
              {program.features.map((feature, index) => (
                <li
                  key={`${feature}-${index}`}
                  className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}