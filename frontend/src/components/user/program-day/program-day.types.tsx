import type { ReactNode } from "react";
import {
  BookOpen,
  Brain,
  CalendarClock,
  CheckCircle2,
  Droplet,
  Dumbbell,
  ListChecks,
  Moon,
  Pill,
  Ruler,
  Utensils,
} from "lucide-react";

import {
  ProgramActivityCategory,
  UserActivityTrackingStatus,
  UserDayTrackingStatus,
} from "@/types/user/program/user-program-day.types";

export type ActivityAction =
  | { type: "start" }
  | {
      type: "complete";
      recordedValue?: number;
      recordedText?: string;
      notes?: string;
      evidence?: string[];
    }
  | { type: "skip"; skippedReason: string };

export const DAY_STATUS_STYLES: Record<UserDayTrackingStatus, string> = {
  [UserDayTrackingStatus.NOT_STARTED]:
    "bg-slate-100 text-slate-700 border-slate-200",
  [UserDayTrackingStatus.IN_PROGRESS]:
    "bg-amber-50 text-amber-700 border-amber-200",
  [UserDayTrackingStatus.COMPLETED]:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  [UserDayTrackingStatus.MISSED]: "bg-rose-50 text-rose-700 border-rose-200",
  [UserDayTrackingStatus.SKIPPED]:
    "bg-slate-100 text-slate-500 border-slate-200",
};

export const DAY_STATUS_LABELS: Record<UserDayTrackingStatus, string> = {
  [UserDayTrackingStatus.NOT_STARTED]: "Not started",
  [UserDayTrackingStatus.IN_PROGRESS]: "In progress",
  [UserDayTrackingStatus.COMPLETED]: "Completed",
  [UserDayTrackingStatus.MISSED]: "Missed",
  [UserDayTrackingStatus.SKIPPED]: "Skipped",
};

export const ACTIVITY_STATUS_STYLES: Record<UserActivityTrackingStatus, string> =
  {
    [UserActivityTrackingStatus.NOT_STARTED]:
      "bg-slate-100 text-slate-700 border-slate-200",
    [UserActivityTrackingStatus.IN_PROGRESS]:
      "bg-amber-50 text-amber-700 border-amber-200",
    [UserActivityTrackingStatus.COMPLETED]:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    [UserActivityTrackingStatus.SKIPPED]:
      "bg-slate-100 text-slate-500 border-slate-200",
  };

export const ACTIVITY_STATUS_LABELS: Record<UserActivityTrackingStatus, string> =
  {
    [UserActivityTrackingStatus.NOT_STARTED]: "Not started",
    [UserActivityTrackingStatus.IN_PROGRESS]: "In progress",
    [UserActivityTrackingStatus.COMPLETED]: "Completed",
    [UserActivityTrackingStatus.SKIPPED]: "Skipped",
  };

export const CATEGORY_ICONS: Record<ProgramActivityCategory, ReactNode> = {
  meal: <Utensils className="h-4 w-4" />,
  exercise: <Dumbbell className="h-4 w-4" />,
  habit: <CheckCircle2 className="h-4 w-4" />,
  water: <Droplet className="h-4 w-4" />,
  supplement: <Pill className="h-4 w-4" />,
  meditation: <Brain className="h-4 w-4" />,
  sleep: <Moon className="h-4 w-4" />,
  reading: <BookOpen className="h-4 w-4" />,
  appointment: <CalendarClock className="h-4 w-4" />,
  measurement: <Ruler className="h-4 w-4" />,
  task: <ListChecks className="h-4 w-4" />,
};

export async function uploadEvidencePhotoStub(
  file: File,
): Promise<{ url: string }> {
  // Replace this with your actual image-upload service.
  // Object URLs are temporary and must not be persisted as evidence.
  return { url: URL.createObjectURL(file) };
}
