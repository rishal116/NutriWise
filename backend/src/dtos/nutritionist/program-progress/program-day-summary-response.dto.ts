export class ProgramDaySummaryResponseDTO {
  dayNumber!: number;
  date!: Date | null;
  status!:
    | "not_started"
    | "in_progress"
    | "completed"
    | "missed"
    | "skipped"
    | null;
  totalActivities!: number;
  completedActivities!: number;
  skippedActivities!: number;
  completionPercentage!: number;
  isLocked!: boolean;
}