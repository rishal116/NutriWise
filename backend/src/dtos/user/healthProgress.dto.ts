export interface IProgressPoint {
  date: Date;
  value: number;
}

export interface HealthProgressResponseDTO {
  weightProgress: IProgressPoint[];
  bmiProgress: IProgressPoint[];
  waterProgress: IProgressPoint[];
  sleepProgress: IProgressPoint[];
}


export interface IHealthProgressData {
  date: Date;
  weightKg?: number;
  bmi?: number;
  dailyWaterIntakeLiters?: number;
  sleepDurationHours?: number;
}

export interface IUpsertHealthProgressDTO {
  userId: string;
  date: Date;

  weightKg?: number;
  bmi?: number;

  dailyWaterIntakeLiters?: number;
  sleepDurationHours?: number;
}