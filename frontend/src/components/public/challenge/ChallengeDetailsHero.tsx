"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Flame,
  LockKeyhole,
  Target,
  Trophy,
} from "lucide-react";

import type { PublicChallengeDetailsDTO } from "@/dtos/public/challenge/public-challenge-details.dto";

import { StartChallengeButton } from "./StartChallengeButton";

interface ChallengeDetailsHeroProps {
  challenge: PublicChallengeDetailsDTO;
}

const formatCategory = (category: string): string =>
  category
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const formatDifficulty = (difficulty: string): string =>
  difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

export function ChallengeDetailsHero({
  challenge,
}: ChallengeDetailsHeroProps) {
  const { participation } = challenge;

  const isActive =
    participation.status === "active" &&
    Boolean(participation.userChallengeId);

  const isCompleted = participation.status === "completed";

  const progressPercentage = Math.min(
    100,
    Math.max(0, Math.round(participation.progressPercentage ?? 0)),
  );

  return (
    <section className="relative overflow-hidden border-b border-[#D1FAE5] bg-[#ECFDF5]">
      <div className="absolute inset-0">
        {challenge.coverImageUrl && (
          <Image
            src={challenge.coverImageUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-15 blur-sm"
          />
        )}

        <div className="absolute inset-0 bg-[#F8FAF9]/90" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <Link
          href="/challenges"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#047857] transition hover:text-[#065F46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ECFDF5]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to challenges
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(280px,520px)_1fr] lg:items-center lg:gap-12">
          <div className="relative mx-auto w-full max-w-[520px] overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-[#D1FAE5]">
            <div className="relative aspect-[3/1]">
              {challenge.coverImageUrl ? (
                <Image
                  src={challenge.coverImageUrl}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#ECFDF5] px-8 text-center">
                  <span className="text-sm text-slate-600">
                    No image available
                  </span>
                </div>
              )}

              {challenge.accessType === "premium" && (
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 shadow-sm">
                  <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
                  Premium
                </div>
              )}
            </div>
          </div>

          <div className="max-w-3xl">
            {/* Category and difficulty */}
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
              <span className="rounded-full bg-[#D1FAE5] px-3 py-1.5 text-[#065F46]">
                {formatCategory(challenge.category)}
              </span>

              <span className="rounded-full border border-[#D1FAE5] bg-white px-3 py-1.5 text-slate-700">
                {formatDifficulty(challenge.difficulty)}
              </span>

              {isCompleted && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#047857] px-3 py-1.5 text-white">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Completed
                </span>
              )}
            </div>

            {/* Challenge information */}
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-[#065F46] sm:text-4xl lg:text-5xl">
              {challenge.title}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              {challenge.description}
            </p>

            {/* Duration and type */}
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              <div className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-[#047857]" aria-hidden="true" />
                {challenge.durationDays}{" "}
                {challenge.durationDays === 1 ? "day" : "days"}
              </div>

              <div className="inline-flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-[#047857]" aria-hidden="true" />
                Guided challenge
              </div>
            </div>

            {/* Challenge goals */}
            {challenge.goals.length > 0 && (
              <div className="mt-7">
                <div className="mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-[#047857]" aria-hidden="true" />
                  <h2 className="text-sm font-semibold text-[#065F46]">
                    Challenge Goals
                  </h2>
                </div>

                <ul className="grid gap-3 sm:grid-cols-2">
                  {challenge.goals.map((goal, index) => (
                    <li
                      key={`${goal}-${index}`}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#047857]"
                        aria-hidden="true"
                      />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Participation statistics */}
            {isActive && (
              <div className="mt-7 space-y-4">
                <div className="grid max-w-md grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[#D1FAE5] bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Flame className="h-4 w-4 text-orange-500" aria-hidden="true" />
                      <span className="text-xs font-medium">Current Streak</span>
                    </div>

                    <p className="mt-2 text-2xl font-bold text-[#065F46]">
                      {participation.currentStreak ?? 0}
                      <span className="ml-1 text-sm font-medium text-slate-600">
                        days
                      </span>
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#D1FAE5] bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Trophy className="h-4 w-4 text-amber-500" aria-hidden="true" />
                      <span className="text-xs font-medium">Longest Streak</span>
                    </div>

                    <p className="mt-2 text-2xl font-bold text-[#065F46]">
                      {participation.longestStreak ?? 0}
                      <span className="ml-1 text-sm font-medium text-slate-600">
                        days
                      </span>
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="max-w-md">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#065F46]">
                      Your Progress
                    </span>

                    <span className="text-sm font-semibold text-[#047857]">
                      {progressPercentage}%
                    </span>
                  </div>

                  <div
                    className="h-2 overflow-hidden rounded-full bg-[#D1FAE5]"
                    role="progressbar"
                    aria-label="Challenge progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progressPercentage}
                  >
                    <div
                      className="h-full rounded-full bg-[#047857] transition-all duration-500 motion-reduce:transition-none"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Challenge action */}
            <div className="mt-7">
              {isActive ? (
                <Link
                  href={`/user/challenges/${participation.userChallengeId}`}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#047857] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#065F46] hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ECFDF5]"
                >
                  Continue Challenge
                </Link>
              ) : (
                <StartChallengeButton
                  challengeId={challenge.id}
                  accessType={challenge.accessType}
                  participation={participation}
                />
              )}
            </div>

            {/* Instructions */}
            {challenge.instructions && (
              <div className="mt-8 rounded-2xl border border-[#D1FAE5] bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-[#065F46]">
                  How it works
                </h2>

                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                  {challenge.instructions}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}