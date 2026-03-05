export interface CreateProgramDTO {
  userId: string;
  planId: string;
  userPlanId: string;
  nutritionistId: string;

  goal: string;
  focusAreas?: string[];
  dietType?: string;
  activityLevel?: string;

  startDate: Date;
  endDate: Date;
  durationDays: number;

  notes?: string;
}