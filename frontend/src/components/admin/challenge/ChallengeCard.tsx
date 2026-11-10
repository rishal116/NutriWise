
import Image from "next/image";
import Link from "next/link";

import {
  Activity,
  Apple,
  ArrowUpRight,
  Brain,
  Clock,
  Crown,
  Droplets,
  Gauge,
  HeartPulse,
  Moon,
  Scale,
} from "lucide-react";

import { AdminChallengeCardDTO } from "@/dtos/admin/challenge/admin-challenge-card.dto";

interface ChallengeCardProps {
  challenge: AdminChallengeCardDTO;
}

const getStatusBadge = (status: string): string => {
  switch (status.toLowerCase()) {
    case "published":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "draft":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "archived":
      return "border-slate-200 bg-slate-100 text-slate-600";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
};

const getDifficultyBadge = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return "bg-emerald-50 text-emerald-700";
    case "intermediate":
      return "bg-amber-50 text-amber-700";
    case "advanced":
      return "bg-rose-50 text-rose-700";
    default:
      return "bg-slate-50 text-slate-600";
  }
};

function CategoryIcon({ category }: { category: string }) {
  const iconClassName = "h-4 w-4 shrink-0 text-emerald-600";

  switch (category.toLowerCase()) {
    case "nutrition":
      return <Apple className={iconClassName} />;
    case "hydration":
      return <Droplets className={iconClassName} />;
    case "fitness":
      return <Activity className={iconClassName} />;
    case "sleep":
      return <Moon className={iconClassName} />;
    case "mindfulness":
      return <Brain className={iconClassName} />;
    case "weight_management":
      return <Scale className={iconClassName} />;
    case "healthy_habits":
      return <HeartPulse className={iconClassName} />;
    default:
      return <HeartPulse className={iconClassName} />;
  }
}

const formatCategory = (category: string): string =>
  category
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5">
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-slate-100">
        {challenge.thumbnailUrl ? (
          <Image
            src={challenge.thumbnailUrl}
            alt={challenge.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
              <CategoryIcon category={challenge.category} />
            </div>
          </div>
        )}

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />

        {/* Top badges */}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          {challenge.accessType === "premium" ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200/80 bg-amber-50/95 px-2.5 py-1.5 text-xs font-semibold text-amber-800 shadow-sm backdrop-blur-sm">
              <Crown className="h-3.5 w-3.5 text-amber-600" />
              Premium
            </span>
          ) : (
            <span className="rounded-lg border border-white/70 bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
              Free
            </span>
          )}

          <span
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold capitalize shadow-sm backdrop-blur-sm ${getStatusBadge(
              challenge.status,
            )}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {challenge.status}
          </span>
        </div>

        {/* Category badge */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-white/70 bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
            <CategoryIcon category={challenge.category} />
            <span className="truncate">
              {formatCategory(challenge.category)}
            </span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title */}
        <h2 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-slate-900 transition-colors group-hover:text-emerald-700">
          {challenge.title}
        </h2>

        {/* Metadata */}
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
          {/* Duration */}
          <div className="rounded-xl bg-slate-50 px-3 py-2.5">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <p className="text-[11px] font-medium text-slate-400">
                Duration
              </p>
            </div>

            <p className="mt-1 text-xs font-semibold text-slate-800">
              {challenge.durationDays}{" "}
              {challenge.durationDays === 1 ? "day" : "days"}
            </p>
          </div>

          {/* Difficulty */}
          <div className="rounded-xl bg-slate-50 px-3 py-2.5">
            <div className="flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <p className="text-[11px] font-medium text-slate-400">
                Difficulty
              </p>
            </div>

            <div className="mt-1">
              <span
                className={`inline-flex whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-semibold capitalize ${getDifficultyBadge(
                  challenge.difficulty,
                )}`}
              >
                {challenge.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Action */}
        <Link
          href={`/admin/challenges/${challenge.id}`}
          className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-emerald-600/15 transition-all duration-200 hover:bg-emerald-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          View Challenge
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}
