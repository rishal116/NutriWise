export class DayActivityResultResponseDTO {
  activityId!: string;
  title!: string;
  category!: string;
  valueType!: string;
  targetValue?: number;
  targetUnit?: string;
  status!: string;
  recordedValue?: number;
  recordedText?: string;
  unit?: string;
  evidence!: string[];
  skippedReason?: string;
  notes?: string;
  nutritionistFeedback?: string;
  lastUpdatedBy!: string;
  startedAt?: Date | null;
  completedAt?: Date | null;
}