"use client";

import Image from "next/image";

import { Clock3, PlayCircle } from "lucide-react";

import type { PublicChallengeActivityDTO } from "@/dtos/public/challenge-day/public-challenge-day-details.dto";

interface ChallengeActivityCardProps {
  activity: PublicChallengeActivityDTO;
}

const formatActivityType = (type: string): string =>
  type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

export function ChallengeActivityCard({
  activity,
}: ChallengeActivityCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
      {(activity.imageUrl || activity.videoUrl) && (
        <div className="relative aspect-video overflow-hidden bg-muted">
          {activity.imageUrl ? (
            <Image
              src={activity.imageUrl}
              alt={activity.title}
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <PlayCircle className="h-10 w-10 text-muted-foreground" />
            </div>
          )}

          {activity.videoUrl && (
            <a
              href={activity.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute inset-0 flex items-center justify-center bg-black/20 transition hover:bg-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`Open video for ${activity.title}`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-foreground shadow-lg">
                <PlayCircle className="h-6 w-6" />
              </span>
            </a>
          )}
        </div>
      )}

      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {formatActivityType(activity.type)}
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground">
              {activity.title}
            </h2>
          </div>

          {activity.isRequired && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Required
            </span>
          )}
        </div>

        {activity.description && (
          <p className="text-sm leading-6 text-muted-foreground">
            {activity.description}
          </p>
        )}

        {activity.instructions && (
          <div className="rounded-xl bg-muted/40 p-4">
            <h3 className="text-sm font-semibold text-foreground">
              Instructions
            </h3>

            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
              {activity.instructions}
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
          {activity.estimatedDurationMinutes !== undefined && (
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              {activity.estimatedDurationMinutes} min
            </span>
          )}

          {activity.targetValue !== undefined && (
            <span>
              Target: {activity.targetValue}
              {activity.unit ? ` ${activity.unit}` : ""}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
