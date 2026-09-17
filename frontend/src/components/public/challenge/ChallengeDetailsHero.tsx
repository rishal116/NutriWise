"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock3, Dumbbell, LockKeyhole } from "lucide-react";

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

export function ChallengeDetailsHero({ challenge }: ChallengeDetailsHeroProps) {
  const { participation } = challenge;

  const isActive = participation.status === "active";

  return (
    <section className="relative overflow-hidden border-b border-border bg-muted/20">
      <div className="absolute inset-0">
        {challenge.coverImageUrl && (
          <Image
            src={challenge.coverImageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-15 blur-sm"
          />
        )}

        <div className="absolute inset-0 bg-background/90" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <Link
          href="/challenges"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to challenges
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(280px,520px)_1fr] lg:items-center lg:gap-12">
          <div className="relative mx-auto w-full max-w-[520px] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/10">
            <div className="relative aspect-[3/1]">
              {challenge.coverImageUrl ? (
                <Image
                  src={challenge.coverImageUrl}
                  alt={challenge.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted px-8 text-center">
                  <span className="text-sm text-muted-foreground">
                    No image available
                  </span>
                </div>
              )}

              {challenge.accessType === "premium" && (
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-2 text-xs font-semibold text-white backdrop-blur">
                  <LockKeyhole className="h-3.5 w-3.5" />
                  Premium
                </div>
              )}
            </div>
          </div>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
              <span className="rounded-full bg-primary/10 px-3 py-1.5 text-primary">
                {formatCategory(challenge.category)}
              </span>

              <span className="rounded-full bg-muted px-3 py-1.5 text-muted-foreground">
                {formatDifficulty(challenge.difficulty)}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {challenge.title}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {challenge.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-primary" />
                {challenge.durationDays}{" "}
                {challenge.durationDays === 1 ? "day" : "days"}
              </div>

              <div className="inline-flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-primary" />
                Guided challenge
              </div>
            </div>

            <div className="mt-7">
              {isActive && participation.userChallengeId ? (
                <Link
                  href={`/user/challenges/${participation.userChallengeId}`}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Continue Challenge
                </Link>
              ) : (
                <StartChallengeButton
                  challengeId={challenge.id}
                  accessType={challenge.accessType}
                  participation={challenge.participation}
                />
              )}
            </div>

            {challenge.instructions && (
              <div className="mt-8 rounded-2xl border border-border/70 bg-background/75 p-5 backdrop-blur-sm sm:p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                  How it works
                </h2>

                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
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
