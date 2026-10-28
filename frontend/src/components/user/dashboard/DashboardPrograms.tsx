"use client";

import Link from "next/link";
import { ArrowRight, Flame, HeartPulse } from "lucide-react";
import type { UserDashboardProgramsDTO } from "@/dtos/user/dashboard/user-dashboard-programs.dto";
import {
  EmptyState,
  SectionHeading,
  formatDashboardDate,
  getInitials,
} from "./DashboardShared";
import Image from "next/image";

export default function DashboardPrograms({
  programs,
}: {
  programs: UserDashboardProgramsDTO;
}) {
  return (
    <section className="space-y-4">
      <SectionHeading
        title="Your coaching programs"
        description="Track your active plans and stay consistent with your goals."
        href="/user/programs"
        linkLabel="View programs"
      />

      {programs.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <EmptyState
            title="No active coaching programs"
            description="Explore nutritionists and find a personalized program that suits your health goals."
          />
          <div className="mt-5 text-center">
            <Link
              href="/coaching"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Explore nutritionists
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {programs.map((program) => {
            const progress = Math.min(
              100,
              Math.max(0, program.progress?.completionPercentage ?? 0),
            );

            return (
              <article
                key={program.id}
                className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <HeartPulse className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="break-words font-bold text-slate-900">
                        {program.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {program.durationDays} days
                      </p>
                    </div>
                  </div>

                  <span className="w-fit shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                    {program.status.replace("_", " ")}
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  {program.nutritionist.profileImage ? (
                    <Image
                      src={program.nutritionist.profileImage}
                      alt={program.nutritionist.fullName}
                      width={40}
                      height={40}
                      sizes="40px"
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                      {getInitials(program.nutritionist.fullName)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Your nutritionist</p>
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {program.nutritionist.fullName}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-slate-600">
                      Overall progress
                    </span>
                    <span className="font-bold tabular-nums text-slate-900">
                      {Math.round(progress)}%
                    </span>
                  </div>

                  <div
                    className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                    aria-label={`${program.title} completion`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progress)}
                  >
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
                    <span>
                      {program.progress?.completedDays ?? 0} of{" "}
                      {program.progress?.totalDays ?? program.durationDays} days
                      completed
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5 text-orange-500" />
                      {program.progress?.currentStreak ?? 0} day streak
                    </span>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
                  {formatDashboardDate(program.startDate)} –{" "}
                  {formatDashboardDate(program.endDate)}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
