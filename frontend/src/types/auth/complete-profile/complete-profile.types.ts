export type FormFields = {
  gender: string;
  birthDate: string;
  heightCm: string;
  weightKg: string;
  activityLevel: string;
  dietType: string;
  goal: string;
  targetWeightKg: string;
  preferredTimeline: string;
};

export type FormErrors = Partial<Record<keyof FormFields, string>>;