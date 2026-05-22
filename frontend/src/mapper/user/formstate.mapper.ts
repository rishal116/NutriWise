
import { HealthDetailsPayload } from "@/constants/user/healthDetails.constant";
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


export function toFormState(data: HealthDetailsPayload): FormState {
  return {
    heightCm: String(data.heightCm),
    weightKg: String(data.weightKg),

    activityLevel: data.activityLevel,
    fitnessLevel: data.fitnessLevel,
    dietType: data.dietType,

    dailyWaterIntakeLiters: String(data.dailyWaterIntakeLiters),
    sleepDurationHours: String(data.sleepDurationHours),

    goal: data.goal,
    preferredTimeline: data.preferredTimeline,

    customTimelineWeeks: data.customTimelineWeeks
      ? String(data.customTimelineWeeks)
      : "",

    targetWeightKg: data.targetWeightKg ? String(data.targetWeightKg) : "",
    focusAreas: data.focusAreas?.join(",") || "",

    allergies: data.allergies?.join(",") || "",
    dietaryRestrictions: data.dietaryRestrictions?.join(",") || "",
    medicalConditions: data.medicalConditions?.join(",") || "",
    injuries: data.injuries?.join(",") || "",

    dailyStepGoal: data.dailyStepGoal ? String(data.dailyStepGoal) : "",
    workoutDaysPerWeek: data.workoutDaysPerWeek
      ? String(data.workoutDaysPerWeek)
      : "",
    workoutTimePerSession: data.workoutTimePerSession
      ? String(data.workoutTimePerSession)
      : "",
  };
}