export class ProgramProgressResponseDTO {
  userProgramId!: string;
  clientId!: string;
  nutritionistId!: string;
  userPlanId!: string;
  planId!: string;
  status!: string;
  startDate!: Date;
  endDate!: Date;
  durationDays!: number;
  currentDay!: number;
  completedDays!: number;
  totalDays!: number;
  totalActivities!: number;
  completedActivities!: number;
  skippedActivities!: number;
  completionPercentage!: number;
  currentStreak!: number;
  longestStreak!: number;
  lastCompletedDay!: number;
}