import type { CoachLevel } from "@/types/nutritionist.types";

export type CoachLevelFilter = "all" | CoachLevel;

export const COACH_LEVEL_LABELS: Record<CoachLevel, string> = {
  beginner: "Beginner",
  verified: "Verified",
  expert: "Expert",
  top_coach: "Top Coach",
};

export const COACH_LEVEL_STYLES: Record<CoachLevel, string> = {
  beginner: "bg-slate-100 text-slate-600",
  verified: "bg-sky-50 text-sky-600",
  expert: "bg-violet-50 text-violet-600",
  top_coach: "bg-amber-50 text-amber-600",
};

export const COACH_LEVEL_OPTIONS: { value: CoachLevelFilter; label: string }[] =
  [
    { value: "all", label: "All Levels" },
    ...(Object.keys(COACH_LEVEL_LABELS) as CoachLevel[]).map((level) => ({
      value: level,
      label: COACH_LEVEL_LABELS[level],
    })),
  ];