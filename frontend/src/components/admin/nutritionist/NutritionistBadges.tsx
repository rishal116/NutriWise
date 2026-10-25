import { Star } from "lucide-react";

import type { CoachLevel } from "@/types/nutritionist.types";

import { COACH_LEVEL_LABELS, COACH_LEVEL_STYLES } from "./nutritionist-table.types";

export function CoachLevelBadge({ level }: { level: CoachLevel }) {
  return (
    <span
      className={`rounded-md px-2 py-1 text-xs font-bold uppercase tracking-tight ${COACH_LEVEL_STYLES[level]}`}
    >
      {COACH_LEVEL_LABELS[level]}
    </span>
  );
}

export function RatingDisplay({
  rating,
  totalReviews,
}: {
  rating: number;
  totalReviews: number;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700">
      <Star size={13} className="fill-amber-400 text-amber-400" />
      {rating.toFixed(1)}
      <span className="font-medium text-slate-400">({totalReviews})</span>
    </span>
  );
}