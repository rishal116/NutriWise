import { Flame, TrendingUp, Clock } from "lucide-react";
import { formatRelativeTime } from "@/lib/formatRelativeTime";

interface ProgramStatsChipsProps {
  adherenceScore: number;
  currentStreak: number;
  lastActivityAt?: string;
}

export function ProgramStatsChips({
  adherenceScore,
  currentStreak,
  lastActivityAt,
}: ProgramStatsChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
      <span className="inline-flex items-center gap-1">
        <TrendingUp size={13} className="text-emerald-600" />
        {adherenceScore}% adherence
      </span>
      <span className="inline-flex items-center gap-1">
        <Flame size={13} className="text-amber-500" />
        {currentStreak}d streak
      </span>
      <span className="inline-flex items-center gap-1">
        <Clock size={13} className="text-slate-400" />
        {formatRelativeTime(lastActivityAt)}
      </span>
    </div>
  );
}
