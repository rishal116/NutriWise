"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Flame,
  HeartPulse,
  RefreshCw,
  Sparkles,
  Trophy,
  UserRound,
} from "lucide-react";

import { userDashboardService } from "@/services/user/userDashboard.service";

import type { UserDashboardOverviewDTO } from "@/dtos/user/dashboard/user-dashboard-overview.dto";

import DashboardStatCard from "@/components/user/dashboard/DashboardStatCard";
import ActiveProgramCard from "@/components/user/dashboard/ActiveProgramCard";
import ProgramProgress from "@/components/user/dashboard/ProgramProgress";

function getFirstName(fullName: string): string {
  return fullName.trim().split(" ")[0] || "there";
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-44 rounded-3xl bg-slate-100" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="h-32 rounded-2xl bg-slate-100" />
        <div className="h-32 rounded-2xl bg-slate-100" />
        <div className="h-32 rounded-2xl bg-slate-100" />
      </div>

      <div className="h-[430px] rounded-2xl bg-slate-100" />
    </div>
  );
}

function EmptyProgramCard() {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm sm:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <HeartPulse className="h-7 w-7" />
      </div>

      <h2 className="mt-5 text-xl font-bold text-slate-900">
        No active coaching program
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        You can explore nutritionists and choose a coaching program that fits
        your goals.
      </p>

      <Link
        href="/coaching"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        Explore nutritionists
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}

function DashboardError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-rose-500 shadow-sm">
        <RefreshCw className="h-5 w-5" />
      </div>

      <h2 className="mt-4 text-lg font-bold text-slate-900">
        Unable to load your dashboard
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Something went wrong while loading your latest dashboard data.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}

function DashboardContent({
  dashboard,
}: {
  dashboard: UserDashboardOverviewDTO;
}) {
  const activeProgram = dashboard.coaching.activeProgram;
  const firstName = getFirstName(dashboard.user.fullName);

  const programProgress = activeProgram?.completionPercentage ?? 0;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 sm:p-8">
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-teal-100/40 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-100">
              <Sparkles className="h-3.5 w-3.5" />
              Your health journey
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Welcome back, {firstName}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Keep an eye on your coaching progress and stay consistent with the
              goals you have started.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
            {dashboard.user.profileImage ? (
              <div className="h-12 w-12 overflow-hidden rounded-xl bg-emerald-50">
                <img
                  src={dashboard.user.profileImage}
                  alt={dashboard.user.fullName}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white">
                {dashboard.user.fullName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-400">Account</p>
              <p className="truncate text-sm font-bold text-slate-900">
                {dashboard.user.fullName}
              </p>
            </div>

            <Link
              href="/user/profile"
              aria-label="Open your profile"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-50 hover:text-emerald-600"
            >
              <UserRound className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardStatCard
          label="Active programs"
          value={dashboard.summary.activePrograms}
          description="Programs currently in progress"
          icon={Activity}
        />

        <DashboardStatCard
          label="Joined challenges"
          value={dashboard.summary.joinedChallenges}
          description="Challenges you have joined"
          icon={Trophy}
        />

        <DashboardStatCard
          label="Program progress"
          value={Math.round(programProgress)}
          description={
            activeProgram ? "Current coaching completion" : "No active program"
          }
          icon={Flame}
        />
      </section>

      {activeProgram ? (
        <>
          <ActiveProgramCard program={activeProgram} />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            <ProgramProgress program={activeProgram} />

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Nutritionist
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    Your coach
                  </h2>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <HeartPulse className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                {activeProgram.nutritionist.profileImage ? (
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                    <img
                      src={activeProgram.nutritionist.profileImage}
                      alt={activeProgram.nutritionist.fullName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-bold text-white">
                    {activeProgram.nutritionist.fullName
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-slate-900">
                    {activeProgram.nutritionist.fullName}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Your active coaching program
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-emerald-50/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  Current focus
                </p>

                <p className="mt-2 text-sm leading-6 text-emerald-950">
                  Continue Day {activeProgram.currentDay} of{" "}
                  {activeProgram.durationDays} and keep your progress moving
                  forward.
                </p>
              </div>

              <Link
                href={`/coaching/${activeProgram.nutritionist.id}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
              >
                View nutritionist
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </div>
        </>
      ) : (
        <EmptyProgramCard />
      )}
    </div>
  );
}

export default function UserDashboardPage() {
  const [dashboard, setDashboard] = useState<UserDashboardOverviewDTO | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await userDashboardService.getOverview();

      setDashboard(response.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <DashboardSkeleton />
      </main>
    );
  }

  if (error || !dashboard) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <DashboardError onRetry={() => void fetchDashboard()} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <DashboardContent dashboard={dashboard} />
    </main>
  );
}
