export interface ProgramProgressResponseDTO {
  userProgramId: string;
  clientId: string;
  nutritionistId: string;
  userPlanId: string;
  planId: string;
  status: string;
  startDate: string;
  endDate: string;
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

export interface ProgramDaySummaryResponseDTO {
  dayNumber: number;
  date: string | null;
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

export interface DayActivityResultResponseDTO {
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
  startedAt?: string | null;
  completedAt?: string | null;
}