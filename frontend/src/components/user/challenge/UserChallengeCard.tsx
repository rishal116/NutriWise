import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Flame,
  Lock,
  Trophy,
} from "lucide-react";

import { UserChallengeCardDTO } from "@/dtos/user/challenge/user-challenge-card.dto";

interface UserChallengeCardProps {
  challenge: UserChallengeCardDTO;
}

const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  completed: "bg-slate-100 text-slate-700 border-slate-200",
  abandoned: "bg-rose-50 text-rose-700 border-rose-100",
} as const;

const STATUS_LABELS = {
  active: "Active",
  completed: "Completed",
  abandoned: "Abandoned",
} as const;

export default function UserChallengeCard({
  challenge,
}: UserChallengeCardProps) {
  const progress = Math.min(
    Math.max(challenge.progressPercentage, 0),
    100,
  );

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[16/9] overflow-hidden bg-emerald-50">
        {challenge.thumbnailUrl ? (
          <Image
            src={challenge.thumbnailUrl}
            alt={challenge.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Trophy className="h-10 w-10 text-emerald-300" />
          </div>
        )}

        <div className="absolute left-3 top-3">
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
              STATUS_STYLES[challenge.status]
            }`}
          >
            {STATUS_LABELS[challenge.status]}
          </span>
        </div>

        {challenge.accessType === "premium" && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-700 backdrop-blur">
            <Lock className="h-3 w-3" />
            Premium
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              {challenge.category.replace("_", " ")}
            </p>

            <h2 className="mt-1 line-clamp-2 text-lg font-bold text-slate-900">
              {challenge.title}
            </h2>
          </div>

          <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium capitalize text-slate-600">
            {challenge.difficulty}
          </span>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-500">
              Overall progress
            </span>

            <span className="font-semibold text-slate-900">
              {progress}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Current day</p>
            <p className="mt-1 text-sm font-bold text-slate-900">
              Day {challenge.currentDay}
              <span className="font-normal text-slate-400">
                {" "}
                / {challenge.durationDays}
              </span>
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <div className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              <p className="text-xs text-slate-500">Streak</p>
            </div>

            <p className="mt-1 text-sm font-bold text-slate-900">
              {challenge.currentStreak} days
            </p>
          </div>
        </div>

        <Link
          href={`/user/challenges/${challenge.id}`}
          className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          {challenge.status === "active"
            ? "Continue challenge"
            : "View challenge"}

          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}