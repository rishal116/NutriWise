import Image from "next/image";

import {
  CalendarDays,
  Flame,
  Trophy,
} from "lucide-react";

import { UserChallengeDetailsDTO } from "@/dtos/user/challenge/user-challenge-details.dto";

interface UserChallengeHeaderProps {
  challenge: UserChallengeDetailsDTO;
}

export default function UserChallengeHeader({
  challenge,
}: UserChallengeHeaderProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid lg:grid-cols-[1.4fr_1fr]">
        <div className="relative min-h-64 bg-emerald-50">
          {challenge.challenge.coverImageUrl ? (
            <Image
              src={challenge.challenge.coverImageUrl}
              alt={challenge.challenge.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          ) : (
            <div className="flex h-full min-h-64 items-center justify-center">
              <Trophy className="h-16 w-16 text-emerald-200" />
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
              {challenge.challenge.category.replace("_", " ")}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
              {challenge.challenge.difficulty}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {challenge.status}
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {challenge.challenge.title}
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {challenge.challenge.description}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <CalendarDays className="h-4 w-4 text-emerald-600" />
              <p className="mt-2 text-xs text-slate-500">Duration</p>
              <p className="text-sm font-bold text-slate-900">
                {challenge.challenge.durationDays} days
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <Trophy className="h-4 w-4 text-emerald-600" />
              <p className="mt-2 text-xs text-slate-500">Current day</p>
              <p className="text-sm font-bold text-slate-900">
                Day {challenge.currentDay}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <Flame className="h-4 w-4 text-orange-500" />
              <p className="mt-2 text-xs text-slate-500">Current streak</p>
              <p className="text-sm font-bold text-slate-900">
                {challenge.currentStreak} days
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}