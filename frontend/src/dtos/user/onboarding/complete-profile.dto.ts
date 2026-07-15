export interface CompleteProfileDto {
  gender: string;
  birthDate: string;
  heightCm: number;
  weightKg: number;
  activityLevel: string;
  dietType: string;
  goal: string;
  targetWeightKg?: number;
  preferredTimeline: string;
}