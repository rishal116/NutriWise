import type { CoachLevel } from "@/types/nutritionist.types";

export type CoachLevelFilter = "all" | CoachLevel;

export const COACH_LEVEL_LABELS: Record<CoachLevel, string> = {
  beginner: "Beginner",
  verified: "Verified",
  expert: "Expert",
  top_coach: "Top Coach",
};

export const COACH_LEVEL_STYLES: Record<CoachLevel, string> = {
  beginner: "bg-admin-surface-hover text-admin-muted",
  verified: "bg-admin-pastel-blue text-admin-text",
  expert: "bg-admin-pastel-purple text-admin-text",
  top_coach: "bg-admin-warning/15 text-admin-warning",
};

export const COACH_LEVEL_OPTIONS: { value: CoachLevelFilter; label: string }[] =
  [
    { value: "all", label: "All Levels" },
    ...(Object.keys(COACH_LEVEL_LABELS) as CoachLevel[]).map((level) => ({
      value: level,
      label: COACH_LEVEL_LABELS[level],
    })),
  ];