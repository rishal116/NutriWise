import type { CursorPaginationResult } from "../../common/cursor-pagination.types"; 

export interface ProgramProgressScope {
  clientId: string;
  nutritionistId: string;
  userProgramId: string;
}

export interface ProgramDaysQuery {
  scope: ProgramProgressScope;
  cursor?: string;
  limit: number;
}

export interface ProgramProgressOverview {
  userProgramId: string;
  clientId: string;
  nutritionistId: string;
  userPlanId: string;
  planId: string;
  status: string;
  startDate: Date;
  endDate: Date;
  durationDays: number;
  currentDay: number;
  completedDays: number;
  totalDays: number;
  totalActivities: number;
  completedActivities: number;
  skippedActivities: number;
  completionPercentage: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDay: number;
}

export interface ProgramDaySummary {
  dayNumber: number;
  date: Date | null;
  status:
    | "not_started"
    | "in_progress"
    | "completed"
    | "missed"
    | "skipped"
    | null;
  totalActivities: number;
  completedActivities: number;
  skippedActivities: number;
  completionPercentage: number;
  isLocked: boolean;
}

export interface DayActivityResult {
  activityId: string;
  title: string;
  category: string;
  valueType: string;
  targetValue?: number;
  targetUnit?: string;
  status: string;
  recordedValue?: number;
  recordedText?: string;
  unit?: string;
  evidence: string[];
  skippedReason?: string;
  notes?: string;
  nutritionistFeedback?: string;
  lastUpdatedBy: string;
  startedAt?: Date | null;
  completedAt?: Date | null;
}

export type ProgramDaysResponse =
  CursorPaginationResult<ProgramDaySummary>;