export interface IUpsertDailyProgress {
  userId: string;
  date?: Date;
  weightKg?: number;
  bmi?: number;
  dailyWaterIntakeLiters?: number;
  sleepDurationHours?: number;
}
