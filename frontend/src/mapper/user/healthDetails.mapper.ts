import {
  ActivityLevel,
  FitnessLevel,
  DietType,
  GoalType,
  TimelineType,
} from "@/types/health.types";

type FormState = {
  heightCm: string;
  weightKg: string;

  activityLevel: ActivityLevel | "";
  fitnessLevel: FitnessLevel | "";
  dietType: DietType | "";

  dailyWaterIntakeLiters: string;
  sleepDurationHours: string;

  goal: GoalType | "";
  preferredTimeline: TimelineType | "";

  customTimelineWeeks: string;

  targetWeightKg: string;
  focusAreas: string;

  allergies: string;
  dietaryRestrictions: string;
  medicalConditions: string;
  injuries: string;

  dailyStepGoal: string;
  workoutDaysPerWeek: string;
  workoutTimePerSession: string;
};

import { HealthDetailsPayload } from "@/constants/user/healthDetails.constant";

export function toHealthDetailsPayload(form: FormState): HealthDetailsPayload {
  return {
    heightCm: Number(form.heightCm),
    weightKg: Number(form.weightKg),

    activityLevel: form.activityLevel as ActivityLevel,
    fitnessLevel: form.fitnessLevel as FitnessLevel,
    dietType: form.dietType as DietType,

    dailyWaterIntakeLiters: Number(form.dailyWaterIntakeLiters),
    sleepDurationHours: Number(form.sleepDurationHours),

    goal: form.goal as GoalType,
    preferredTimeline: form.preferredTimeline as TimelineType,

    customTimelineWeeks:
      form.preferredTimeline === "custom"
        ? Number(form.customTimelineWeeks)
        : undefined,

    targetWeightKg: form.targetWeightKg
      ? Number(form.targetWeightKg)
      : undefined,

    focusAreas: form.focusAreas
      ? form.focusAreas.split(",").map((x) => x.trim())
      : undefined,

    allergies: form.allergies
      ? form.allergies.split(",").map((x) => x.trim())
      : undefined,

    dietaryRestrictions: form.dietaryRestrictions
      ? form.dietaryRestrictions.split(",").map((x) => x.trim())
      : undefined,

    medicalConditions: form.medicalConditions
      ? form.medicalConditions.split(",").map((x) => x.trim())
      : undefined,

    injuries: form.injuries
      ? form.injuries.split(",").map((x) => x.trim())
      : undefined,

    dailyStepGoal: form.dailyStepGoal
      ? Number(form.dailyStepGoal)
      : undefined,

    workoutDaysPerWeek: form.workoutDaysPerWeek
      ? Number(form.workoutDaysPerWeek)
      : undefined,

    workoutTimePerSession: form.workoutTimePerSession
      ? Number(form.workoutTimePerSession)
      : undefined,
  };
}