"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Clock3, Sparkles } from "lucide-react";

import type { PublicChallengeCardDTO } from "@/dtos/public/challenge/public-challenge-card.dto";

interface ChallengeCardProps {
  challenge: PublicChallengeCardDTO;
}

const formatCategory = (category: string): string =>
  category
    .replace(/\_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const formatDifficulty = (difficulty: string): string =>
  difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

const CARD_WIDTH_CLASSES =
  "w-[68vw] min-w-[68vw] sm:w-[250px] sm:min-w-[250px] md:w-[265px] md:min-w-[265px] lg:w-[280px] lg:min-w-[280px] xl:w-[290px] xl:min-w-[290px]";

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  return (
    <Link
      href={`/challenges/${challenge.id}`}
      className={[
        "group flex h-full flex-col shrink-0 snap-start overflow-hidden",
        "rounded-2xl border border-border/70 bg-card",
        "shadow-sm transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-lg",
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary",
        "focus-visible:ring-offset-2",
        CARD_WIDTH_CLASSES,
      ].join(" ")}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {challenge.thumbnailUrl ? (
          <Image
            src={challenge.thumbnailUrl}
            alt={challenge.title}
            fill
            sizes="(max-width: 640px) 72vw, 300px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted px-6 text-center">
            <span className="text-sm font-medium text-muted-foreground">
              Image coming soon
            </span>
          </div>
        )}

        {/* Bottom gradient */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/15 to-transparent"
          aria-hidden="true"
        />

        {/* Premium badge */}
        {challenge.accessType === "premium" && (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-amber-200/70 bg-amber-50/95 px-2.5 py-1 text-[11px] font-semibold text-amber-800 shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Premium
          </div>
        )}

        {/* Duration badge */}
        <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
          <Clock3 className="h-3 w-3" aria-hidden="true" />
          {challenge.durationDays}{" "}
          {challenge.durationDays === 1 ? "day" : "days"}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="line-clamp-2 text-base font-semibold leading-5 tracking-tight text-foreground transition-colors group-hover:text-primary">
              {challenge.title}
            </h3>

            <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-muted-foreground">
              {challenge.description}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-muted-foreground">
            <span>{formatCategory(challenge.category)}</span>

            <span
              className="h-1 w-1 rounded-full bg-muted-foreground/40"
              aria-hidden="true"
            />

            <span>{formatDifficulty(challenge.difficulty)}</span>
          </div>
        </div>

        {/* Start Challenge CTA — visual only; the whole card is the click target */}
        <div className="mt-4 flex items-center justify-between rounded-lg bg-primary/5 px-3 py-2 text-sm font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          Start Challenge
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}