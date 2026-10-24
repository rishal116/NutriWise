"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  PauseCircle,
  PlayCircle,
  XCircle,
} from "lucide-react";

import type {
  ClientProgramSummaryDTO,
  ProgramStatus,
} from "@/dtos/nutritionist/client/client-response.dto";

interface ClientProgramCardProps {
  clientId: string;
  program: ClientProgramSummaryDTO;
}

const PROGRAM_STYLES: Record<
  ProgramStatus,
  { badge: string; icon: typeof PlayCircle; label: string }
> = {
  upcoming: {
    badge: "border-sky-200 bg-sky-50 text-sky-700",
    icon: Clock3,
    label: "Upcoming",
  },
  active: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: PlayCircle,
    label: "Active",
  },
  paused: {
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    icon: PauseCircle,
    label: "Paused",
  },
  completed: {
    badge: "border-slate-200 bg-slate-100 text-slate-600",
    icon: CheckCircle2,
    label: "Completed",
  },
  cancelled: {
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    icon: XCircle,
    label: "Cancelled",
  },
};

const DEFAULT_STATUS_STYLE = {
  badge: "border-slate-200 bg-slate-100 text-slate-600",
  icon: Clock3,
  label: "Unknown",
};

function formatDate(value?: string | null): string {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function DateItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-3">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="break-words text-xs font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

export default function ClientProgramCard({
  clientId,
  program,
}: ClientProgramCardProps) {
  const router = useRouter();

  const percentage = Number.isFinite(program.completionPercentage)
    ? Math.min(100, Math.max(0, program.completionPercentage))
    : 0;

  const duration = Number.isFinite(program.durationDays)
    ? Math.max(0, program.durationDays)
    : 0;

  const currentDay = Number.isFinite(program.currentDay)
    ? Math.min(duration, Math.max(0, program.currentDay))
    : 0;

  const status = PROGRAM_STYLES[program.programStatus] ?? DEFAULT_STATUS_STYLE;

  const StatusIcon = status.icon;

  const progressUrl =
    `/nutritionist/clients/${encodeURIComponent(clientId)}` +
    `/programs/${encodeURIComponent(program.userProgramId)}/progress`;

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-emerald-200 hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Nutrition program
          </p>

          <h3 className="mt-1 break-words text-base font-bold text-slate-900 transition-colors group-hover:text-emerald-700">
            {program.planTitle || "Untitled program"}
          </h3>
        </div>

        <span
          className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.badge}`}
        >
          <StatusIcon size={14} aria-hidden="true" />
          {status.label}
        </span>
      </div>

      <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-slate-600">
            Program progress
          </span>

          <span className="text-sm font-bold tabular-nums text-slate-900">
            {Math.round(percentage)}%
          </span>
        </div>

        <div
          className="h-2.5 overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-label={`${program.planTitle || "Nutrition program"} completion`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(percentage)}
        >
          <div
            className="h-full rounded-full bg-emerald-600 transition-[width] duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Day {currentDay} of {duration}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <DateItem label="Start date" value={formatDate(program.startDate)} />
        <DateItem label="End date" value={formatDate(program.endDate)} />
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <CalendarDays size={14} aria-hidden="true" />

        <span>
          Duration:{" "}
          <span className="font-semibold text-slate-700">
            {duration} {duration === 1 ? "day" : "days"}
          </span>
        </span>
      </div>

      <button
        type="button"
        onClick={() => router.push(progressUrl)}
        className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        aria-label={`View progress for ${program.planTitle || "nutrition program"}`}
      >
        View progress
        <ArrowRight
          size={16}
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5"
        />
      </button>
    </article>
  );
}
