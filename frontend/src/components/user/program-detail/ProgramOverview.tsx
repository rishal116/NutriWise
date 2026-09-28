import type { ReactNode } from "react";
import {
  CalendarDays,
  Clock,
  CreditCard,
} from "lucide-react";

import type { UserProgramDetailsDTO } from "@/dtos/user/program/user-program-details.dto";

interface ProgramOverviewProps {
  program: UserProgramDetailsDTO;
}

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  badge?: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  active:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  completed:
    "border-sky-200 bg-sky-50 text-sky-700",
  paused:
    "border-amber-200 bg-amber-50 text-amber-700",
  cancelled:
    "border-rose-200 bg-rose-50 text-rose-700",
  pending:
    "border-slate-200 bg-slate-100 text-slate-700",
  paid:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  failed:
    "border-rose-200 bg-rose-50 text-rose-700",
  refunded:
    "border-amber-200 bg-amber-50 text-amber-700",
};

function getStatusStyle(status: string): string {
  return (
    STATUS_STYLES[status.toLowerCase()] ??
    STATUS_STYLES.pending
  );
}

function StatCard({
  icon,
  label,
  value,
  badge,
}: StatCardProps) {
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
            className={`mt-0.5 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${getStatusStyle(
              String(value),
            )}`}
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

export default function ProgramOverview({
  program,
}: ProgramOverviewProps) {
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
          icon={<CreditCard className="h-4 w-4" />}
          label="Subscription"
          value={program.subscriptionStatus}
          badge
        />

        <StatCard
          icon={<CreditCard className="h-4 w-4" />}
          label="Payment"
          value={program.paymentStatus}
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
          icon={<CalendarDays className="h-4 w-4" />}
          label="Start Date"
          value={new Date(
            program.startDate,
          ).toLocaleDateString()}
        />

        <StatCard
          icon={<CalendarDays className="h-4 w-4" />}
          label="End Date"
          value={new Date(
            program.endDate,
          ).toLocaleDateString()}
        />
      </div>
    </section>
  );
}