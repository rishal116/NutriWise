"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  CreditCard,
  Sparkles,
  Target,
} from "lucide-react";

import { userProgramService } from "@/services/user/userProgram.service";
import type { UserProgramDetailsDTO } from "@/dtos/user/program/user-program-details.dto";

interface ProgramDetailsPageProps {
  params: Promise<{
    programId: string;
  }>;
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-sky-50 text-sky-700 border-sky-200",
  paused: "bg-amber-50 text-amber-700 border-amber-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  pending: "bg-slate-100 text-slate-700 border-slate-200",
};

function getStatusStyle(status: string) {
  return STATUS_STYLES[status?.toLowerCase()] ?? STATUS_STYLES.pending;
}

export default function ProgramDetailsPage({
  params,
}: ProgramDetailsPageProps) {
  const [program, setProgram] = useState<UserProgramDetailsDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProgram = async () => {
      try {
        const { programId } = await params;
        const response = await userProgramService.getProgramDetails(programId);
        if (active) setProgram(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProgram();
    return () => {
      active = false;
    };
  }, [params]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="h-5 w-32 rounded bg-slate-200 animate-pulse" />
        <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="h-8 w-2/3 rounded bg-slate-200 animate-pulse" />
          <div className="mt-3 h-4 w-40 rounded bg-slate-200 animate-pulse" />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-slate-200 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 py-20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <Target className="h-6 w-6 text-emerald-600" />
          </div>
          <h2 className="mt-4 text-lg font-bold tracking-tight text-slate-900">
            Program not found
          </h2>
          <p className="mt-1 text-xs font-medium text-slate-500">
            This program may have been removed or is no longer available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Link
        href="/user/programs"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors duration-150 hover:text-emerald-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Programs
      </Link>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              {program.title}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-800">
                {program.nutritionist.fullName}
              </p>
              <span className="text-xs font-medium text-slate-400">
                @{program.nutritionist.username}
              </span>
            </div>
          </div>

          <span
            className={`rounded-full border px-3 py-1 text-[11px] font-semibold capitalize ${getStatusStyle(
              program.status
            )}`}
          >
            {program.status}
          </span>
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-emerald-600" />
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              Overview
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
              value={`${program.durationDays} Days`}
            />
            <StatCard
              icon={<CalendarDays className="h-4 w-4" />}
              label="Start Date"
              value={new Date(program.startDate).toLocaleDateString()}
            />
            <StatCard
              icon={<CalendarDays className="h-4 w-4" />}
              label="End Date"
              value={new Date(program.endDate).toLocaleDateString()}
            />
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-slate-50 p-5">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-bold tracking-tight text-slate-900">
                Overall Progress
              </span>
            </div>
            <span className="text-sm font-bold text-emerald-700">
              {program.completionPercentage}%
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${program.completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="mt-8">
          <Link
            href={`/user/programs/${program._id}/days`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-lg"
          >
            View Program Days
          </Link>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  badge?: boolean;
}

function StatCard({ icon, label, value, badge }: StatCardProps) {
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
            className={`mt-0.5 inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${getStatusStyle(
              String(value)
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