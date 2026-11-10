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
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const formatDifficulty = (difficulty: string): string =>
  difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  return (
    <Link
      href={`/challenges/${challenge.id}`}
      className={[
        "group flex h-full w-full flex-col overflow-hidden",
        "rounded-2xl border border-[#D1FAE5] bg-white",
        "shadow-sm transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-[#047857]/30 hover:shadow-md",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-[#047857]",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAF9]",
      ].join(" ")}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#ECFDF5]">
        {challenge.thumbnailUrl ? (
          <Image
            src={challenge.thumbnailUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 72vw, 320px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#ECFDF5] px-6 text-center">
            <span className="text-sm font-medium text-slate-600">
              Image coming soon
            </span>
          </div>
        )}

        {/* Premium badge */}
        {challenge.accessType === "premium" && (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800 shadow-sm">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Premium
          </div>
        )}

        {/* Duration badge */}
        <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-[#D1FAE5] bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#065F46] shadow-sm backdrop-blur-sm">
          <Clock3 className="h-3 w-3 text-[#047857]" aria-hidden="true" />
          {challenge.durationDays}{" "}
          {challenge.durationDays === 1 ? "day" : "days"}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="line-clamp-2 text-base font-semibold leading-5 tracking-tight text-[#065F46] transition-colors group-hover:text-[#047857]">
              {challenge.title}
            </h3>

            <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-slate-600">
              {challenge.description}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-slate-600">
            <span>{formatCategory(challenge.category)}</span>
            <span
              className="h-1 w-1 rounded-full bg-slate-300"
              aria-hidden="true"
            />
            <span>{formatDifficulty(challenge.difficulty)}</span>
          </div>
        </div>

        {/* CTA: visual only; the whole card is the click target */}
        <div className="mt-4 flex items-center justify-between rounded-lg bg-[#ECFDF5] px-3 py-2 text-sm font-semibold text-[#047857] transition-colors group-hover:bg-[#047857] group-hover:text-white">
          Start Challenge
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}
